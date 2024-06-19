document.addEventListener('DOMContentLoaded', () => {
    const prizesContainer = document.getElementById('prizesContainer');
    const addPrizeBtn = document.getElementById('addPrizeBtn');
    const saveConfigBtn = document.getElementById('saveConfigBtn');
    const applyColorsBtn = document.getElementById('applyColorsBtn');
    const textColorInput = document.getElementById('textColor');
    const bgColorInput = document.getElementById('bgColor');

    // Carregar configuração do local storage
    loadConfig();

    addPrizeBtn.addEventListener('click', addPrize);
    saveConfigBtn.addEventListener('click', saveConfig);
    applyColorsBtn.addEventListener('click', applyColors);

    // Função para adicionar um novo prêmio
    function addPrize() {
        const prizeItem = document.createElement('div');
        prizeItem.classList.add('prize-item');
        prizeItem.innerHTML = `
            <input type="text" placeholder="Nome do Prêmio" required>
            <input type="number" placeholder="Porcentagem (%)" required min="1" max="99">
            <input type="file" accept="image/jpeg" required>
            <img src="#" alt="Imagem do Prêmio" class="hidden">
            <button type="button" class="remove-prize-btn">Remover</button>
        `;
        const fileInput = prizeItem.querySelector('input[type="file"]');
        fileInput.addEventListener('change', handleImageUpload);
        prizeItem.querySelector('.remove-prize-btn').addEventListener('click', () => prizeItem.remove());
        prizesContainer.appendChild(prizeItem);
    }

    // Função para lidar com upload de imagem
    function handleImageUpload(event) {
        const file = event.target.files[0];
        const imgElement = event.target.nextElementSibling;

        if (file && file.type === 'image/jpeg') {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = new Image();
                img.onload = function() {
                    if (img.width === 100 && img.height === 100) {
                        imgElement.src = e.target.result;
                        imgElement.classList.remove('hidden');
                    } else {
                        alert('Imagem de tamanho não permitido. Deve ser 100x100.');
                        event.target.value = '';
                    }
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            alert('Por favor, envie uma imagem JPEG.');
            event.target.value = '';
        }
    }

    // Função para salvar a configuração
    function saveConfig() {
        const prizeItems = prizesContainer.querySelectorAll('.prize-item');
        const prizes = [];

        prizeItems.forEach(item => {
            const name = item.querySelector('input[type="text"]').value;
            const percentage = item.querySelector('input[type="number"]').value;
            const image = item.querySelector('img').src;

            if (!name || !percentage || !image || image === '#') {
                alert('Preencha todas as informações do prêmio.');
                return;
            }

            prizes.push({ name, percentage, image });
        });

        localStorage.setItem('prizes', JSON.stringify(prizes));
        alert('Configuração salva com sucesso!');
    }

    // Função para carregar a configuração do local storage
    function loadConfig() {
        const savedPrizes = JSON.parse(localStorage.getItem('prizes'));

        if (savedPrizes) {
            savedPrizes.forEach(prize => {
                const prizeItem = document.createElement('div');
                prizeItem.classList.add('prize-item');
                prizeItem.innerHTML = `
                    <input type="text" value="${prize.name}" required>
                    <input type="number" value="${prize.percentage}" required min="1" max="99">
                    <input type="file" accept="image/jpeg" required>
                    <img src="${prize.image}" alt="Imagem do Prêmio">
                    <button type="button" class="remove-prize-btn">Remover</button>
                `;
                const fileInput = prizeItem.querySelector('input[type="file"]');
                fileInput.addEventListener('change', handleImageUpload);
                prizeItem.querySelector('.remove-prize-btn').addEventListener('click', () => prizeItem.remove());
                prizesContainer.appendChild(prizeItem);
            });
        }

        const textColor = localStorage.getItem('textColor');
        const bgColor = localStorage.getItem('bgColor');

        if (textColor && bgColor) {
            document.documentElement.style.setProperty('--text-color', textColor);
            document.documentElement.style.setProperty('--bg-color', bgColor);
            textColorInput.value = textColor;
            bgColorInput.value = bgColor;
        }
    }

    // Função para aplicar cores selecionadas
    function applyColors() {
        const textColor = textColorInput.value;
        const bgColor = bgColorInput.value;

        document.documentElement.style.setProperty('--text-color', textColor);
        document.documentElement.style.setProperty('--bg-color', bgColor);

        localStorage.setItem('textColor', textColor);
        localStorage.setItem('bgColor', bgColor);

        alert('Cores aplicadas com sucesso!');
    }

    // Função para desenhar a roleta e mostrar o vencedor na página da roleta
    function drawWheel(prizes) {
        const totalSegments = prizes.length;
        const arcSize = (2 * Math.PI) / totalSegments;
        let startAngle = 0;

        prizes.forEach((prize, index) => {
            const endAngle = startAngle + arcSize;
            ctx.beginPath();
            ctx.moveTo(300, 300);
            ctx.arc(300, 300, 300, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = getRandomColor();
            ctx.fill();
            startAngle = endAngle;

            ctx.save();
            ctx.translate(300, 300);
            ctx.rotate(startAngle - arcSize / 2);
            ctx.textAlign = "right";
            ctx.fillStyle = '#000';
            ctx.font = '16px Arial';
            ctx.fillText(prize.name, 290, 10);
            ctx.restore();
        });
    }

    // Função para selecionar um prêmio com base nas porcentagens
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

    // Função para gerar uma cor aleatória
    function getRandomColor() {
        return '#' + Math.floor(Math.random() * 16777215).toString(16);
    }
});
