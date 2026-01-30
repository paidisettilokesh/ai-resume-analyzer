import express from 'express';
import multer from 'multer';
import { handleResumeRequest } from '../utils/aiService.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('resume'), (req, res) => {
    handleResumeRequest(req, res, ({ resumeText, jobRole }) => {
        return `
        Resume & Role: "${jobRole}" (fallback to resume text if generic).
        Resume Preview: "${resumeText.substring(0, 1000)}"

        TASK: Estimate the market salary range for this candidate based on their experience level implied in the text and the target role of "${jobRole}". Default location: India/US/Global (infer from text or assume Global Remote).

        RETURN JSON STRICTLY:
        {
            "estimation": {
                "salaryRange": { "min": "$Xk", "max": "$Yk", "currency": "USD/INR" },
                "experienceLevel": "Junior/Mid/Senior",
                "locationFactors": { "marketDemand": "High/Med/Low", "location": "Detected Location" },
                "explanation": "Brief explanation of why this range."
            }
        }
        `;
    });
});

export default router;
