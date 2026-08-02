const express = require("express");
const router = express.Router();

const {
  testAI,
  analyzeResume,
  getAnalysisByResume,
} = require("../controllers/aiController");

const protect = require("../middleware/authMiddleware");

// Test Gemini
router.get("/test", testAI);

// Analyze Resume
router.post("/analyze/:resumeId", protect, analyzeResume);

// Get Analysis by Resume ID
router.get("/analysis/:resumeId", protect, getAnalysisByResume);

module.exports = router;
