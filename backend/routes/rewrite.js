import express from "express";
import multer from "multer";
import { handleResumeRequest } from "../utils/aiService.js";
import { saveHistory } from "../utils/historyManager.js"; // Import history manager

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("resume"), (req, res) => {
  handleResumeRequest(req, res, ({ resumeText, jobRole }) => {
    return `Rewrite this resume to drastically improve its impact for a ${jobRole} position.
Use strong action verbs (Achieved, Spearheaded, Engineered).
Quantify impact where possible (e.g., "Improved performance by 30%").
Fix all grammar and flow issues.
Keep the same structure but upgrade the content to be elite (Top 1% candidate).

Resume Text:
${resumeText.substring(0, 3000)}

Return strictly valid JSON:
{
  "rewritten": "Full markdown text of the improved resume..."
}`;
  }, async (result, meta) => {
    // Save to history
    const userId = req.headers['x-user-id'] || 'guest';
    await saveHistory({
      type: 'rewrite',
      role: meta.jobRole,
      candidateName: 'Rewritten Candidate', // We might not have name here easily unless extracted again, but it's fine
      details: result.rewritten?.substring(0, 100) + '...'
    }, userId);
  });
});

export default router;
