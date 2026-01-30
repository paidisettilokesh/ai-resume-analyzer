import express from "express";
import db from "../database.js";

const router = express.Router();

// Get all saved resumes for a user
router.get("/", (req, res) => {
    const userId = req.headers['x-user-id'] || 'guest';

    db.all("SELECT * FROM saved_resumes WHERE userId = ? ORDER BY createdAt DESC", [userId], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(rows);
    });
});

// Save a new resume
router.post("/", (req, res) => {
    const userId = req.headers['x-user-id'] || 'guest';
    const { title, content, type } = req.body;

    if (!content) return res.status(400).json({ error: "Content is required" });

    const sql = "INSERT INTO saved_resumes (userId, title, content, type) VALUES (?, ?, ?, ?)";
    const params = [userId, title || 'Untitled Resume', content, type || 'builder'];

    db.run(sql, params, function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to save resume" });
        }
        res.json({
            success: true,
            id: this.lastID,
            message: "Resume saved successfully!"
        });
    });
});

// Delete a saved resume
router.delete("/:id", (req, res) => {
    const userId = req.headers['x-user-id'] || 'guest';
    const id = req.params.id;

    db.run("DELETE FROM saved_resumes WHERE id = ? AND userId = ?", [id, userId], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to delete" });
        }
        res.json({ success: true, message: "Resume deleted" });
    });
});

export default router;
