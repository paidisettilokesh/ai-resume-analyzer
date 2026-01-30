import express from 'express';
import db from '../database.js';

const router = express.Router();

// Save or Update Resume
router.post('/save', (req, res) => {
    const { userId, resumeData } = req.body;
    const title = resumeData.personal?.fullName || 'My Resume';
    const content = JSON.stringify(resumeData);

    // Check if a resume already exists for this user to update or create new
    // For simplicity, we'll allow multiple but this endpoint will "save" a specific one
    const query = `INSERT INTO saved_resumes (userId, title, content, type) VALUES (?, ?, ?, 'builder')`;

    db.run(query, [userId || 'guest', title, content], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ success: true, id: this.lastID });
    });
});

// Get User's Latest Resume
router.get('/latest', (req, res) => {
    const userId = req.headers['x-user-id'] || 'guest';
    const query = `SELECT * FROM saved_resumes WHERE userId = ? AND type = 'builder' ORDER BY createdAt DESC LIMIT 1`;

    db.get(query, [userId], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (row) {
            row.content = JSON.parse(row.content);
        }
        res.json(row || { content: null });
    });
});

export default router;
