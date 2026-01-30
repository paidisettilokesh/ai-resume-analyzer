import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const HISTORY_FILE = path.join(__dirname, '../data/history.json');

export const saveHistory = async (data, userId = 'guest') => {
    try {
        let history = [];
        try {
            const fileData = await fs.readFile(HISTORY_FILE, 'utf8');
            history = JSON.parse(fileData);
        } catch (e) {
            // File likely doesn't exist
        }

        const newEntry = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            userId,
            ...data
        };

        // Add to top
        history.unshift(newEntry);

        // Optional: Clean up very old guest entries if array gets too huge globally, 
        // but for now let's just keep it simple. Limit total file size? 
        // Or specific user limit? Let's limit specific user to 50.
        const userHistory = history.filter(h => h.userId === userId);
        if (userHistory.length > 50) {
            // Find the oldest one for this user and remove it from main history
            const oldestId = userHistory[userHistory.length - 1].id;
            history = history.filter(h => h.id !== oldestId);
        }

        await fs.writeFile(HISTORY_FILE, JSON.stringify(history, null, 2));
        return newEntry;
    } catch (error) {
        console.error("Failed to save history:", error);
    }
};

export const getHistory = async (userId = 'guest') => {
    try {
        const fileData = await fs.readFile(HISTORY_FILE, 'utf8');
        const history = JSON.parse(fileData);
        return history.filter(h => h.userId === userId);
    } catch (e) {
        return [];
    }
};

export const clearHistory = async (userId = 'guest') => {
    try {
        const fileData = await fs.readFile(HISTORY_FILE, 'utf8');
        let history = JSON.parse(fileData);

        // Remove only this user's items
        history = history.filter(h => h.userId !== userId);

        await fs.writeFile(HISTORY_FILE, JSON.stringify(history, null, 2));
        return true;
    } catch (e) {
        console.error("Failed to clear history", e);
        return false;
    }
};
