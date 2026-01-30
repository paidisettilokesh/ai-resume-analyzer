import express from "express";
import multer from "multer";
import { handleResumeRequest } from "../utils/aiService.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("resume"), (req, res) => {
    handleResumeRequest(req, res, ({ resumeText, companyName, jobDescription }) => {
        return `Write a compelling cover letter for "${companyName}".
Job Description: ${jobDescription}
Resume: ${resumeText.substring(0, 2000)}

Return JSON:
{
  "coverLetter": "Dear Hiring Manager..."
}`;
    });
});

export default router;
