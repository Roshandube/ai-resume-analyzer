const Resume = require("../models/Resume");
const { extractTextFromPDF } = require("../services/pdfService");

// ==========================================
// Upload Resume
// ==========================================
const uploadResume = async (req, res) => {
  try {
    // Check if file exists
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF resume",
      });
    }

    // Save resume details in MongoDB
    const resume = await Resume.create({
      user: req.user.userId,
      originalName: req.file.originalname,
      fileName: req.file.filename,
      filePath: req.file.path,
      fileSize: req.file.size,
    });

    // Extract text from uploaded PDF
    const resumeText = await extractTextFromPDF(req.file.path);

    console.log("========== Resume Text ==========");
    console.log(resumeText);
    console.log("=================================");

    res.status(201).json({
      success: true,
      message: "Resume uploaded successfully",
      resume,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================================
// Get All Resumes of Logged-in User
// ==========================================
const getMyResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({
      user: req.user.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: resumes.length,
      resumes,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const fs = require("fs");
const Analysis = require("../models/Analysis");

// Delete Resume
const deleteResume = async (req, res) => {
  try {
    const { id } = req.params;

    // Find Resume
    const resume = await Resume.findOne({
      _id: id,
      user: req.user.userId,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    // Delete PDF file
    if (fs.existsSync(resume.filePath)) {
      fs.unlinkSync(resume.filePath);
    }

    // Delete AI Analysis
    await Analysis.deleteOne({
      resume: resume._id,
    });

    // Delete Resume
    await Resume.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Resume deleted successfully",
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
  uploadResume,
  getMyResumes,
  deleteResume,
};
