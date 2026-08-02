const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },
    analysis: {
      atsScore: Number,
      summary: String,
      strengths: [String],
      weaknesses: [String],
      missingSkills: [String],
      suggestions: [String],
      recommendedRoles: [String],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Analysis", analysisSchema);
