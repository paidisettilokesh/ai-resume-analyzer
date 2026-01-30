import express from 'express';
import multer from 'multer';
import { handleResumeRequest } from '../utils/aiService.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('resume'), (req, res) => {
    handleResumeRequest(req, res, ({ resumeText }) => {
        return `
        Resume Content: "${resumeText.substring(0, 3000)}"

        TASK: Act as a LinkedIn Expert. Analyze the resume and generate optimized LinkedIn profile content.

        RETURN JSON OBJECT ONLY:
        {
            "headline": "Professional Headline (max 220 chars)",
            "about": "Engaging About section (first person, 3-4 paragraphs, storytelling approach)",
            "experiencePoints": [
                { "role": "Latest Role Title", "bullets": ["Optimized bullet 1", "Optimized bullet 2"] }
            ],
            "skillsToPin": ["Skill 1", "Skill 2", "Skill 3"],
            "networkingMessage": "Template message for networking connection requests"
        }
        `;
    }, null); // No extra success handler needed
});

export default router;
