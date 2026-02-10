const mongoose = require("mongoose");

// Roadmap Step Schema
const roadmapStepSchema = new mongoose.Schema({
  duration: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
});

// Resource Schema
const resourceSchema = new mongoose.Schema({
  type: { type: String, required: true }, // e.g. Online Course, Article
  title: { type: String, required: true },
  url: { type: String, required: true },
  duration: { type: String, required: true },
});

// Saved Career Schema
const savedCareerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  id: {
    type: String,
    required: true, // e.g. kubernetes_administrator_001
  },

  title: {
    type: String,
    required: true, // Kubernetes Administrator
  },

  description: {
    type: String,
    required: true,
  },

  matchPercentage: {
    type: Number,
    required: true,
  },

  roleOverview: {
    type: [String],
    required: true,
  },

  salaryRange: {
    type: String,
    required: true,
  },

  requiredSkills: {
    type: [String],
    required: true,
  },

  roadmap: {
    type: [roadmapStepSchema],
    required: true,
  },

  resources: {
    type: [resourceSchema],
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

savedCareerSchema.index({ userId: 1, id: 1 }, { unique: true });

module.exports = mongoose.model("SavedCareer", savedCareerSchema);
