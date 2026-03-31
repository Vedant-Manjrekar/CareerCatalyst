const mongoose = require("mongoose");

// Roadmap Step Schema
const roadmapStepSchema = new mongoose.Schema({
  duration: { type: String, required: false },
  title: { type: String, required: true },
  description: { type: String, required: true },
});

// Resource Schema
const resourceSchema = new mongoose.Schema({
  type: { type: String, required: true }, // e.g. Online Course, Article
  title: { type: String, required: true },
  url: { type: String, required: true },
  duration: { type: String, required: false },
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
    required: false,
  },

  roleOverview: {
    type: [String],
    required: false,
    default: [],
  },

  salaryRange: {
    type: String,
    required: false,
    default: "Competitive",
  },

  requiredSkills: {
    type: [String],
    required: false,
    default: [],
  },

  roadmap: {
    type: [roadmapStepSchema],
    required: false,
    default: [],
  },

  resources: {
    type: [resourceSchema],
    required: false,
    default: [],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

savedCareerSchema.index({ userId: 1, id: 1 }, { unique: true });

module.exports = mongoose.model("SavedCareer", savedCareerSchema);
