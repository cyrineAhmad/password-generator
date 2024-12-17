const bcrypt = require('bcrypt');
const Password = require('../models/password');

const getPasswordStrength = (password) => {
    
    const length = password.length;
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);

    if (length >= 7 && hasLowercase && hasUppercase && hasNumbers) return 'Strong';
    if (length >= 7 && (hasLowercase || hasUppercase) && hasNumbers) return 'Medium';
    return 'Weak';
};

const generatePassword = async (req, res) => {
    try {
        const { includeLowercase, includeUppercase, includeNumbers, length } = req.body;

        
        if (!includeLowercase && !includeUppercase && !includeNumbers) {
            return res.status(400).json({ error: 'Please select at least one character type.' });
        }

        let charset = '';
        if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
        if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (includeNumbers) charset += '0123456789';

        if (!length || length < 7) {
            return res.status(400).json({ error: 'Please provide a valid length for the password.' });
        }

        let plainPassword = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            plainPassword += charset[randomIndex];
        }

        const saltRounds = parseInt(process.env.SALT_ROUNDS);
        const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

        const newPassword = new Password({ password: hashedPassword });
        await newPassword.save();

        res.json({ 
            message: 'Password generated and saved successfully!', 
            password: plainPassword, 
            strength: getPasswordStrength(plainPassword) 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getPasswordHistory = async (req, res) => {
    try {
        const passwords = await Password.find().sort({ createdAt: -1 }).limit(10);
        res.json(passwords);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    generatePassword,
    getPasswordHistory
};
