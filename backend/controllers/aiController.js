const fs = require("fs");
const Resume = require("../models/Resume");
const Analysis = require("../models/Analysis");
const { extractTextFromPDF } = require("../services/pdfService");
const {
  analyzeResume: analyzeWithGemini,
} = require("../services/geminiService");

// Existing test endpoint (keep this)
const testAI = async (req, res) => {
  try {
    const result = await analyzeWithGemini(
      "Java Developer with Spring Boot, MySQL and React.",
    );

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Main Resume Analysis
const analyzeResume = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const { jobDescription = "" } = req.body;

    // Find Resume
    const resume = await Resume.findById(resumeId);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    // Extract text from PDF
    const resumeText = await extractTextFromPDF(resume.filePath);

    // Send to Gemini
    const aiResult = await analyzeWithGemini(resumeText, jobDescription);

    // Save analysis
    const analysis = await Analysis.create({
      user: req.user.userId,
      resume: resume._id,
      analysis: aiResult,
    });

    res.status(200).json({
      success: true,
      message: "Resume analyzed successfully",
      analysis,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAnalysisByResume = async (req, res) => {
  try {
    const { resumeId } = req.params;

    const analysis = await Analysis.findOne({
      resume: resumeId,
      user: req.user.userId,
    });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: "Analysis not found",
      });
    }

    res.status(200).json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  testAI,
  analyzeResume,
  getAnalysisByResume,
};
