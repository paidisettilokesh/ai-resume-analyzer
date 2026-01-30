import express from "express";
import multer from "multer";
import { handleResumeRequest } from "../utils/aiService.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("resume"), (req, res) => {
    handleResumeRequest(req, res, ({ resumeText, jobRole, jobDescription }) => {
        const { userAnswer, currentQuestion } = req.body;

        if (userAnswer) {
            // Feedback Mode
            return `Analyze this interview answer using the STAR Method (Situation, Task, Action, Result).
            Question: "${currentQuestion}"
            Candidate Answer: "${userAnswer}"
            
            Return JSON:
            {
              "starAnalysis": {
                "situation": "Strong/Weak/Missing - Feedback",
                "task": "Strong/Weak/Missing - Feedback",
                "action": "Strong/Weak/Missing - Feedback",
                "result": "Strong/Weak/Missing - Feedback"
              },
              "overallFeedback": "One sentence summary.",
              "improvedAnswer": "A rewrite of their answer using the STAR method."
            }`;
        }

        // Question Generation Mode
        return `Generate 5 highly relevant technical and behavioral interview questions for a "${jobRole}" role.
    ${jobDescription ? `Strictly base questions on this Job Description:\n${jobDescription}` : ''}
    Resume Context: ${resumeText.substring(0, 2000)}
    
    Return JSON:
    {
      "preparation": {
          "commonQuestions": [
              { "question": "Question 1?", "answer": "Suggested answer based on user skills..." },
              { "question": "Question 2?", "answer": "Suggested answer..." },
              { "question": "Question 3?", "answer": "Suggested answer..." },
              { "question": "Question 4?", "answer": "Suggested answer..." },
              { "question": "Question 5?", "answer": "Suggested answer..." }
          ]
      }
    }`;
    });
});

export default router;
