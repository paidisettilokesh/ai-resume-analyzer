import express from "express";
import multer from "multer";
import { handleResumeRequest } from "../utils/aiService.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("resume"), (req, res) => {
    handleResumeRequest(req, res, ({ resumeText, jobDescription }) => {
        return `Analyze the match between this resume and the provided Job Description.
JD: ${jobDescription}
Resume: ${resumeText.substring(0, 3000)}

Return strictly valid JSON:
{
  "matchScore": 0-100,
  "matchAnalysis": "A detailed paragraph explaining how well the resume matches this specific JD.",
  "matchingKeywords": ["Keyword 1", "Keyword 2", "Skill 1"],
  "missingKeywords": ["Missing Skill 1", "Missing Skill 2"],
  "adjustmentsNeeded": ["Specific suggestion 1", "Specific suggestion 2"]
}`;
    });
});

export default router;
