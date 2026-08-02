const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const analyzeResume = async (resumeText, jobDescription = "") => {
  try {
    const hasJobDescription = jobDescription.trim().length > 0;

    const prompt = `
You are an expert resume reviewer and ATS-readiness evaluator.

IMPORTANT:
The ATS readiness score is NOT a prediction of whether a
specific company will accept the candidate.

Evaluate the resume's general ATS readiness.

Calculate atsScore from 0 to 100 using these criteria:

- Skills and keyword clarity: 25 points
- Experience and project quality: 25 points
- Measurable achievements and impact: 20 points
- Resume structure and section completeness: 15 points
- Clear professional language and relevance: 15 points

${
  hasJobDescription
    ? `
A job description has also been provided.

Calculate jobMatchScore from 0 to 100 by comparing
the resume against the job description.

Consider:

- Required skills
- Technologies
- Experience requirements
- Responsibilities
- Education or qualifications
- Relevant keywords

Also identify matchedSkills and missingSkills.
`
    : `
No job description has been provided.

Set jobMatchScore to null.
Set matchedSkills to [].

For missingSkills, suggest useful skills that could
strengthen the candidate's profile based on the resume
and likely relevant roles. Do not claim these are missing
from a specific employer's requirements.
`
}

Return ONLY valid JSON.

Do NOT return markdown.
Do NOT use markdown code fences.
Do NOT add text before or after the JSON.

Return exactly this structure:

{
  "atsScore": number,
  "jobMatchScore": number or null,
  "summary": "string",
  "strengths": ["string"],
  "weaknesses": ["string"],
  "matchedSkills": ["string"],
  "missingSkills": ["string"],
  "suggestions": ["string"],
  "recommendedRoles": ["string"]
}

RESUME:

${resumeText}

${
  hasJobDescription
    ? `
JOB DESCRIPTION:

${jobDescription}
`
    : ""
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: prompt,
    });

    const text = response.text;

    return JSON.parse(text);
  } catch (error) {
    console.error("GEMINI ERROR:");
    console.error(error);

    throw new Error("Gemini AI Error");
  }
};

module.exports = {
  analyzeResume,
};
