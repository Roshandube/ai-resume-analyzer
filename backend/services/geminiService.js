const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const normalizeText = (value, maxLength = 20000) => {
  if (!value) return "";

  const text = String(value).replace(/\s+/g, " ").trim();

  if (text.length <= maxLength) {
    return text;
  }

  return text.slice(0, maxLength);
};

const parseGeminiResponse = (response) => {
  if (!response) {
    throw new Error("Empty Gemini response");
  }

  if (typeof response === "string") {
    return JSON.parse(response);
  }

  if (response.text) {
    return JSON.parse(response.text);
  }

  if (response.candidates?.length) {
    const text = response.candidates
      .map(
        (candidate) =>
          candidate.content?.parts?.map((part) => part.text || "").join("") ||
          "",
      )
      .join("\n");

    return JSON.parse(text);
  }

  throw new Error("Gemini response format is unexpected");
};

const extractJsonFromText = (text) => {
  const jsonMatch = text.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error("Gemini response did not include valid JSON");
  }

  return JSON.parse(jsonMatch[0]);
};

const MODEL_CANDIDATES = [
  "gemini-3.6-flash",
  "gemini-3.5-flash-lite",
  "gemini-2.5-flash-lite",
];

const analyzeResume = async (resumeText, jobDescription = "", attempt = 0) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is missing");
    }

    const safeResumeText = normalizeText(resumeText, 20000);
    const safeJobDescription = normalizeText(jobDescription, 8000);
    const hasJobDescription = safeJobDescription.trim().length > 0;

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

${safeResumeText}

${
  hasJobDescription
    ? `
JOB DESCRIPTION:

${safeJobDescription}
`
    : ""
}
`;

    let lastError;

    for (const model of MODEL_CANDIDATES) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
        });

        const text = response.text || JSON.stringify(response);

        try {
          return parseGeminiResponse(response);
        } catch {
          return extractJsonFromText(text);
        }
      } catch (error) {
        lastError = error;
        const message = error?.message || "Gemini request failed";

        if (
          !/429|503|500|timeout|overloaded|resource_exhausted|unavailable|temporar|not found/i.test(
            message,
          )
        ) {
          throw error;
        }
      }
    }

    throw lastError || new Error("No Gemini model responded successfully");
  } catch (error) {
    const message = error?.message || "Gemini request failed";
    const retryable =
      /429|503|500|timeout|overloaded|resource_exhausted|unavailable|temporar|not found/i.test(
        message,
      );

    if (retryable && attempt < 2) {
      const waitTime = 1000 * (attempt + 1) * 2;
      console.warn(`Gemini retry ${attempt + 1}/3 in ${waitTime}ms`);
      await sleep(waitTime);
      return analyzeResume(resumeText, jobDescription, attempt + 1);
    }

    console.error("GEMINI ERROR:");
    console.error(message);

    throw new Error(
      "Gemini AI Error. Please try again after a moment. If it keeps failing, refresh the API key or use another supported model.",
    );
  }
};

module.exports = {
  analyzeResume,
};
