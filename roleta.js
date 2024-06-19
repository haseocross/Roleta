document.addEventListener('DOMContentLoaded', () => {
    const prizeBar = document.getElementById('prizeBar');
    const startBtn = document.getElementById('startBtn');
    const winnerDisplay = document.getElementById('winnerDisplay');
    let prizes = JSON.parse(localStorage.getItem('prizes'));

    startBtn.addEventListener('click', startRoulette);

    function startRoulette() {
        if (!prizes || prizes.length < 5) {
            alert('Configure ao menos 5 prêmios.');
            return;
        }

        let totalPercentage = 0;
        prizes.forEach(prize => totalPercentage += parseInt(prize.percentage));

        if (totalPercentage !== 100) {
            alert('A soma das porcentagens deve ser 100%.');
            return;
        }

        displayPrizes(prizes);
        setTimeout(() => {
            animatePrizes(prizes);
        }, 500);
    }

    function displayPrizes(prizes) {
        prizeBar.innerHTML = '';
        // Duplicate prizes to make an infinite loop effect
        for (let i = 0; i < 3; i++) {  // Repeat the list of prizes thrice for continuous scrolling
            prizes.forEach(prize => {
                const prizeContainer = document.createElement('div');
                prizeContainer.classList.add('prize-container');

                const prizeName = document.createElement('div');
                prizeName.classList.add('prize-name');
                prizeName.innerText = prize.name;

                const prizeImg = document.createElement('img');
                prizeImg.src = prize.image;
                prizeImg.alt = prize.name;

                prizeContainer.appendChild(prizeName);
                prizeContainer.appendChild(prizeImg);
                prizeBar.appendChild(prizeContainer);
            });
        }
    }

    function animatePrizes(prizes) {
        const prizeWidth = 120; // 100px + 2*10px margin
        const totalWidth = prizes.length * prizeWidth;

        prizeBar.style.transition = 'transform 0s linear';
        prizeBar.style.transform = 'translateX(0)';

        let position = 0;
        const step = 10;
        const interval = setInterval(() => {
            position += step;
            prizeBar.style.transition = 'transform 0.16s linear';
            prizeBar.style.transform = `translateX(-${position}px)`;
            if (position >= totalWidth) {
                position = 0;
                prizeBar.style.transition = 'transform 0s linear';
                prizeBar.style.transform = 'translateX(0)';
            }
        }, 16); // 60 FPS for smoother animation

        setTimeout(() => {
            clearInterval(interval);
            const selectedPrizeIndex = selectPrize(prizes);
            const selectedPrize = prizes[selectedPrizeIndex];
            const offset = (selectedPrizeIndex + prizes.length) * prizeWidth - (prizeWidth * 2.5);
            prizeBar.style.transition = 'transform 1s ease';
            prizeBar.style.transform = `translateX(-${offset}px)`;

            setTimeout(() => {
                winnerDisplay.innerHTML = `Parabéns! Você ganhou: ${selectedPrize.name}`;
            }, 1000); // Same as the CSS transition duration
        }, 5000); // Animation duration (5 seconds)
    }

    function selectPrize(prizes) {
        let rand = Math.random() * 100;
        let sum = 0;

        for (let i = 0; i < prizes.length; i++) {
            sum += parseInt(prizes[i].percentage);
            if (rand <= sum) {
                return i;
            }
        }
    }
});
