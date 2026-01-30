import express from "express";
import multer from "multer";
import { handleResumeRequest } from "../utils/aiService.js";
import { saveHistory } from "../utils/historyManager.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("resume"), (req, res) => {
  handleResumeRequest(req, res, ({ resumeText, jobRole }) => {
    return `Resume: """${resumeText.substring(0, 1500)}"""
    Role: "${jobRole}"
    
    ANALYZE THIS RESUME FOR ${jobRole}. RETURN STRICT JSON ONLY.
    
    CRITICAL INSTRUCTIONS:
    - Provide 5-7 CONCISE strengths and 5-7 CONCISE areas for improvement
    - Each point should be ONE SHORT SENTENCE (max 15 words)
    - Be specific and use numbers/metrics when possible
    - Focus on most impactful observations only
    - Use professional but brief language
    
    {
      "candidateName": "Extract name",
      "location": "Extract preferred or current location (default to India if not found)",
      "atsScore": 85, 
      "jobMatchScore": 75,
      "roleSuitability": "High Match",
      "summary": "Concise 2-sentence summary of candidate's fit for ${jobRole}.",
      "mobileAnalysis": { 
         "superpowers": [
            "Strong technical skills in [skill] with [X years] experience",
            "Proven results: increased [metric] by [X]% at [company]",
            "Relevant [degree] from [institution] with [GPA/honors]",
            "Expert-level proficiency in [3-4 key technologies]",
            "Clean ATS-friendly format with strategic keyword placement",
            "Quantified achievements across all experience entries",
            "Industry certifications: [cert name] and [cert name]"
         ], 
         "demerits": [
            "Missing [X]% of job description keywords for ${jobRole}",
            "No metrics in experience bullets - add numbers/percentages",
            "Lacks key ${jobRole} skills: [skill 1], [skill 2]",
            "Generic action verbs - use stronger, specific terms",
            "No professional summary highlighting ${jobRole} expertise",
            "Technical skills section incomplete - add [tool/framework]",
            "Resume too text-heavy - needs better visual hierarchy"
         ] 
      },
      "missingSkills": ["Skill 1", "Skill 2", "Tool", "Framework", "Methodology"],
      "sectionAnalysis": {
          "formatting": "Professional",
          "experience": "Strong",
          "skills": "Good",
          "education": "Clear"
      },
      "recommendedCourses": [
         { "title": "Exact real course title on specific skill gap", "platform": "Coursera/Udemy/EdX", "focus": "Fixes [Specific Missing Skill]" },
         { "title": "Another top-rated course for role", "platform": "Coursera/Udemy/EdX", "focus": "Mastering [Key Technology]" },
         { "title": "Advanced certification for ${jobRole}", "platform": "Coursera/Udemy/EdX", "focus": "Professional Certification" },
         { "title": "Project-based course on [Skill]", "platform": "Coursera/Udemy/EdX", "focus": "Practical Application" }
      ]
    }`;
  }, async (result, meta) => {
    // Save to history on success
    const userId = req.headers['x-user-id'] || 'guest';
    await saveHistory({
      type: 'analysis',
      role: meta.jobRole,
      analysis: result // Save full analysis object
    }, userId);
  });
});

export default router;
