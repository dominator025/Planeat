const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const { getAsync, runAsync } = require('../db/schema');

const router = express.Router();

// @route   POST api/auth/signup
router.post('/signup', async (req, res) => {
    const { name, email, password, institution } = req.body;

    try {
        const userExists = await getAsync(`SELECT id FROM users WHERE email = ?`, [email]);
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const result = await runAsync(
            `INSERT INTO users (name, email, password, institution) VALUES (?, ?, ?, ?)`,
            [name, email, hashedPassword, institution]
        );

        const payload = { user: { id: result.lastID } };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'planeat-secret-token',
            { expiresIn: '5 days' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await getAsync(`SELECT * FROM users WHERE email = ?`, [email]);
        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const payload = { user: { id: user.id } };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'planeat-secret-token',
            { expiresIn: '5 days' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.id, name: user.name, role: user.role }});
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/auth/me
router.get('/me', auth, async (req, res) => {
    try {
        const user = await getAsync(`SELECT id, name, email, role, institution FROM users WHERE id = ?`, [req.user.id]);
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
