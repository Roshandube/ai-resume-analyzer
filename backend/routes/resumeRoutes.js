const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const controller = require("../controllers/resumeController");

const { uploadResume, getMyResumes, deleteResume } = controller;

// Upload Resume
router.post("/upload", protect, upload.single("resume"), uploadResume);

// Get All Resumes
router.get("/", protect, getMyResumes);

// Delete Resume
router.delete("/:id", protect, deleteResume);

module.exports = router;
