import express from "express";
import multer from "multer";
import { handleResumeRequest } from "../utils/aiService.js";
import { saveHistory } from "../utils/historyManager.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("resume"), (req, res) => {
  handleResumeRequest(req, res, ({ resumeText, jobRole }) => {
    return `Perform a detailed Skills Gap Analysis for the role of "${jobRole}" based on this resume.
Resume: ${resumeText.substring(0, 3000)}

Return strictly valid JSON:
{
  "currentProficiency": "Beginner/Intermediate/Advanced",
  "topSkillsFound": ["Skill 1", "Skill 2"],
  "criticalGaps": ["Critical Skill 1", "Critical Skill 2"],
  "learningPath": ["Step 1: Learn X", "Step 2: Build Y"],
  "certificationSuggestions": ["Cert 1", "Cert 2"]
}`;
  }, async (result, meta) => {
    const userId = req.headers['x-user-id'] || 'guest';
    await saveHistory({
      type: 'skills',
      role: meta.jobRole,
      details: `Gap Analysis: ${result.criticalGaps?.length || 0} gaps found`
    }, userId);
  });
});

export default router;
