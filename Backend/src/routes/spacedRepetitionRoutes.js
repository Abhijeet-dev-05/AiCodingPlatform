const express = require("express");
const reviewRouter = express.Router();
const userMiddleware = require("../middleware/userMiddleware");
const {
  addToReviewQueue,
  getDailyReview,
  submitReview,
  getReviewStats,
  getUpcomingReviews,
  resetCard,
  migrateSolvedProblems,
} = require("../controllers/spacedRepetitionController");

// Add a problem to review queue
reviewRouter.post("/add/:problemId", userMiddleware, addToReviewQueue);

// Get today's due reviews
reviewRouter.get("/daily", userMiddleware, getDailyReview);

// Submit a review rating
reviewRouter.post("/submit/:cardId", userMiddleware, submitReview);

// Get review statistics
reviewRouter.get("/stats", userMiddleware, getReviewStats);

// Get upcoming 7-day forecast
reviewRouter.get("/upcoming", userMiddleware, getUpcomingReviews);

// Reset a card to new state
reviewRouter.post("/reset/:cardId", userMiddleware, resetCard);

// Migrate all previously solved problems to spaced repetition
reviewRouter.post("/migrate", userMiddleware, migrateSolvedProblems);

module.exports = reviewRouter;
