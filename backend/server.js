import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import analyzeRoute from './routes/analyze.js';
import rewriteRoute from './routes/rewrite.js';
import coverLetterRoute from './routes/coverLetter.js';
import interviewRoute from './routes/interview.js';
import tailorRoute from './routes/tailor.js';
import skillsRoute from './routes/skills.js';
import authRoute from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ... existing middleware ...
app.use(cors());
app.use(express.json());
// app.use(express.static(path.join(__dirname, '../frontend/dist')));

import { getHistory, clearHistory } from './utils/historyManager.js';

// API Routes
import roastRoute from './routes/roast.js';
import salaryRoute from './routes/salary.js';
import savedResumesRoute from './routes/savedResumes.js';
import userResumesRoute from './routes/userResumes.js';

app.use('/api/auth', authRoute);
app.use('/api/analyze', analyzeRoute);
app.use('/api/rewrite', rewriteRoute);
app.use('/api/cover-letter', coverLetterRoute);
app.use('/api/interview', interviewRoute);
app.use('/api/tailor', tailorRoute);
app.use('/api/skills', skillsRoute);
app.use('/api/roast', roastRoute);
app.use('/api/user-resumes', userResumesRoute);
app.use('/api/salary', salaryRoute);
app.use('/api/resumes', savedResumesRoute);

app.get('/api/history', async (req, res) => {
    const userId = req.headers['x-user-id'] || 'guest';
    const history = await getHistory(userId);
    res.json(history);
});

app.delete('/api/history', async (req, res) => {
    const userId = req.headers['x-user-id'] || 'guest';
    await clearHistory(userId);
    res.json({ success: true });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!', details: err.message });
});

app.get('/', (req, res) => {
    res.send('AI Resume Analyzer API is Running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`GROQ_API_KEY present: ${!!process.env.GROQ_API_KEY}`);
});

// Force restart trigger: 2026-01-06T17:18:00
