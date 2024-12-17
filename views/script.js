const fetchPasswordHistory = async () => {
    try {
        const response = await fetch('/api/password-history');
        const data = await response.json();

        const historyDiv = document.getElementById('historyContainer');
        historyDiv.innerHTML = '';

        data.forEach(entry => {
            const div = document.createElement('div');
            div.classList.add('history-item');
            div.innerHTML = `Password: ${entry.password} <span class="timestamp">${new Date(entry.createdAt).toLocaleString()}</span>`;
            historyDiv.appendChild(div);
        });
    } catch (error) {
        console.error('Error fetching password history:', error);
    }
};

document.getElementById('generatePasswordBtn').addEventListener('click', async () => {
    const includeLowercase = document.getElementById('includeLowercase').checked;
    const includeUppercase = document.getElementById('includeUppercase').checked;
    const includeNumbers = document.getElementById('includeNumbers').checked;
    const length = parseInt(document.getElementById('passwordLength').value, 10);

    const feedback = document.getElementById('feedback');
    feedback.textContent = ''; 
    if (length > 20 || length < 7) {
        feedback.style.color = 'red';
        feedback.textContent = 'Password length must be less than or equal to 20 characters.';
        return;
    }

    try {
        const response = await fetch('/api/generate-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ includeLowercase, includeUppercase, includeNumbers, length })
        });

        const data = await response.json();

        const passwordResult = document.getElementById('passwordResult');
        const strengthIndicator = document.createElement('div');
        strengthIndicator.classList.add('strength');

        if (response.ok) {
            passwordResult.textContent = `Generated Password: ${data.password}`;
            strengthIndicator.textContent = `Strength: ${data.strength}`;
            feedback.style.color = 'green';
            feedback.textContent = data.message;
        } else {
            passwordResult.textContent = '';
            strengthIndicator.textContent = '';
            feedback.style.color = 'red';
            feedback.textContent = data.error;
        }

        passwordResult.appendChild(strengthIndicator);

        fetchPasswordHistory();
    } catch (error) {
        feedback.style.color = 'red';
        feedback.textContent = 'An error occurred while generating the password.';
        console.error('Error:', error);
    }
});

document.getElementById('toggleHistory').addEventListener('click', () => {
    const historyContent = document.getElementById('historyContent');
    const isVisible = historyContent.style.display === 'block';
    historyContent.style.display = isVisible ? 'none' : 'block';
    document.getElementById('toggleHistory').textContent = isVisible ? 'Show Password History' : 'Hide Password History';
});

fetchPasswordHistory();
