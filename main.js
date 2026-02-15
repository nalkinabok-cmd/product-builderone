
document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const lottoSetsContainer = document.getElementById('lotto-sets-container');
    const toggleSwitch = document.getElementById('checkbox');
    // const numberSpans = document.querySelectorAll('.number'); // This is no longer used, as numbers are dynamically created.

    const currentTheme = localStorage.getItem('theme');

    if (currentTheme) {
        document.body.classList.add(currentTheme === 'light' ? 'light-mode' : '');
        if (currentTheme === 'light') {
            toggleSwitch.checked = true;
        }
    }

    function switchTheme(e) {
        if (e.target.checked) {
            document.body.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
        } else {
            document.body.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark');
        }
    }

    toggleSwitch.addEventListener('change', switchTheme, false);

    generateBtn.addEventListener('click', () => {
        lottoSetsContainer.innerHTML = ''; // Clear previous sets

        const colors = ['#FFD700', '#ADFF2F', '#87CEEB', '#FF6347', '#DA70D6', '#BA55D3']; // Gold, GreenYellow, SkyBlue, Tomato, Orchid, MediumPurple

        for (let i = 0; i < 5; i++) { // Generate 5 sets
            const lottoNumbers = new Set();
            while (lottoNumbers.size < 6) { // Each set has 6 numbers
                const randomNumber = Math.floor(Math.random() * 45) + 1; // Numbers from 1 to 45
                lottoNumbers.add(randomNumber);
            }

            const sortedNumbers = Array.from(lottoNumbers).sort((a, b) => a - b);

            const lottoSetDiv = document.createElement('div');
            lottoSetDiv.classList.add('lotto-set');

            sortedNumbers.forEach((number, index) => {
                const numberSpan = document.createElement('span');
                numberSpan.classList.add('number');
                numberSpan.textContent = number;
                numberSpan.style.backgroundColor = colors[index % colors.length]; // Apply distinct color
                lottoSetDiv.appendChild(numberSpan);
            });
            lottoSetsContainer.appendChild(lottoSetDiv);
        }
    });
});
