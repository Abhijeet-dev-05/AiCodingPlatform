const mongoose = require("mongoose");
const { Schema } = mongoose;

const codeReviewSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  problemId: {
    type: Schema.Types.ObjectId,
    ref: "Problem",
    required: true,
  },
  submissionId: {
    type: Schema.Types.ObjectId,
    ref: "submission",
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },

  // AI Analysis Results
  complexityAnalysis: {
    timeComplexity: { type: String, default: "Unknown" },
    spaceComplexity: { type: String, default: "Unknown" },
    explanation: { type: String, default: "" },
  },

  codeSmells: [{
    type: {
      type: String,
      default: "general",
    },
    severity: {
      type: String,
      enum: ["info", "warning", "critical"],
      default: "info",
    },
    line: { type: Number, default: 0 },
    description: { type: String, default: "" },
    suggestion: { type: String, default: "" },
  }],

  optimizations: [{
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    impact: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    suggestedCode: { type: String, default: "" },
  }],

  scores: {
    readability: { type: Number, default: 0, min: 0, max: 100 },
    efficiency: { type: Number, default: 0, min: 0, max: 100 },
    bestPractices: { type: Number, default: 0, min: 0, max: 100 },
    overall: { type: Number, default: 0, min: 0, max: 100 },
  },

  comparisonWithOptimal: {
    isOptimal: { type: Boolean, default: false },
    optimalComplexity: { type: String, default: "" },
    gap: { type: String, default: "" },
    explanation: { type: String, default: "" },
  },
}, {
  timestamps: true,
});

// Indexes for fast lookups
codeReviewSchema.index({ userId: 1, problemId: 1 });
codeReviewSchema.index({ userId: 1, createdAt: -1 });
codeReviewSchema.index({ submissionId: 1 }, { unique: true });

const CodeReview = mongoose.model("CodeReview", codeReviewSchema);
module.exports = CodeReview;
