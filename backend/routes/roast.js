import express from "express";
import multer from "multer";
import { handleResumeRequest } from "../utils/aiService.js";
import { saveHistory } from "../utils/historyManager.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("resume"), (req, res) => {
    handleResumeRequest(req, res, ({ resumeText, jobRole }) => {
        return `You are a brutal, sarcastic, and highly critical senior recruiter who has seen thousands of bad resumes. 
Your task is to ROAST this resume for the role of "${jobRole}". 
Be mean, be funny, be constructive but ruthless. 
Point out clichés, vague statements, bad formatting, and lack of impact.

Resume Text: ${resumeText.substring(0, 3000)}

Return strictly valid JSON with this structure:
{
  "roast": "Your brutal 3-paragraph roast here...",
  "burnScore": 0-100 (where 100 is a sick burn, 0 is boring)
}`;
    }, async (result, meta) => {
        // Save to history? Maybe not needed for a roast, or as a fun item.
        // Let's save it.
        const userId = req.headers['x-user-id'] || 'guest';
        await saveHistory({
            type: 'roast',
            role: meta.jobRole,
            candidateName: 'Roast Victim',
            atsScore: 0,
            matchScore: result.burnScore
        }, userId);
    });
});

export default router;
