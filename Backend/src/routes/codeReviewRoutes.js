const express = require("express");
const codeReviewRouter = express.Router();
const userMiddleware = require("../middleware/userMiddleware");
const { reviewCode, getReviewHistory, getReviewBySubmission } = require("../controllers/codeReviewController");

// Review a submission's code quality
codeReviewRouter.post("/review/:submissionId", userMiddleware, reviewCode);

// Get user's code review history with trends
codeReviewRouter.get("/history", userMiddleware, getReviewHistory);

// Get review for a specific submission
codeReviewRouter.get("/submission/:submissionId", userMiddleware, getReviewBySubmission);

module.exports = codeReviewRouter;
