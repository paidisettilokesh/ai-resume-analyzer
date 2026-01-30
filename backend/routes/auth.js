import express from 'express';
import { registerUser, loginUser } from '../utils/userManager.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const user = await registerUser(email, password, name);
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }
        const user = await loginUser(email, password);
        res.json(user);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

export default router;
