const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewHistoryEntrySchema = new Schema({
  date: { type: Date, default: Date.now },
  rating: { type: Number, enum: [1, 2, 3, 4], required: true }, // 1=Again, 2=Hard, 3=Good, 4=Easy
  elapsedDays: { type: Number, default: 0 },
  scheduledDays: { type: Number, default: 0 },
  state: { type: String, default: "new" },
}, { _id: false });

const spacedRepetitionSchema = new Schema({
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

  // FSRS Core Parameters
  stability: { type: Number, default: 0 },
  difficulty: { type: Number, default: 5, min: 1, max: 10 },
  elapsedDays: { type: Number, default: 0 },
  scheduledDays: { type: Number, default: 0 },
  reps: { type: Number, default: 0 },
  lapses: { type: Number, default: 0 },
  state: {
    type: String,
    enum: ["new", "learning", "review", "relearning"],
    default: "new",
  },

  // Scheduling
  nextReviewDate: { type: Date, default: Date.now },
  lastReviewDate: { type: Date, default: null },

  // Performance History
  reviewHistory: [reviewHistoryEntrySchema],

  // Analytics
  retentionRate: { type: Number, default: 1.0, min: 0, max: 1 },
  totalReviewTime: { type: Number, default: 0 }, // cumulative seconds

}, {
  timestamps: true,
});

// Compound unique index — one card per user per problem
spacedRepetitionSchema.index({ userId: 1, problemId: 1 }, { unique: true });
// Query index for daily review lookups
spacedRepetitionSchema.index({ userId: 1, nextReviewDate: 1, state: 1 });

const SpacedRepetition = mongoose.model("SpacedRepetition", spacedRepetitionSchema);
module.exports = SpacedRepetition;
