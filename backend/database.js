import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

const dbPath = path.join(dataDir, 'resume_app.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database ' + dbPath, err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initDb();
    }
});

function initDb() {
    db.serialize(() => {
        // Users Table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            username TEXT,
            password TEXT,
            email TEXT
        )`);

        // Saved Resumes Table
        db.run(`CREATE TABLE IF NOT EXISTS saved_resumes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId TEXT,
            title TEXT,
            content TEXT,
            type TEXT, 
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // History Table (Moving from JSON to DB)
        db.run(`CREATE TABLE IF NOT EXISTS history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId TEXT,
            type TEXT,
            role TEXT,
            candidateName TEXT,
            details TEXT,
            matchScore INTEGER,
            atsScore INTEGER,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        console.log("Database tables initialized.");
    });
}

export default db;
