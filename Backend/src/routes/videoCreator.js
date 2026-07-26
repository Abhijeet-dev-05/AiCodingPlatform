const express = require('express');
const adminMiddleware = require('../middleware/adminMiddleware');
const videoRouter = express.Router();
const { generateUploadSignature, saveVideoMetadata, deleteVideo, getVideoByProblemId, getVideoStats } = require("../controllers/videoSection")

// Public route - Get video by problem ID (no auth required for viewing)
videoRouter.get("/get/:problemId", getVideoByProblemId);

// Admin routes
videoRouter.get("/stats", adminMiddleware, getVideoStats);
videoRouter.get("/create/:problemId", adminMiddleware, generateUploadSignature);
videoRouter.post("/save", adminMiddleware, saveVideoMetadata);
videoRouter.delete("/delete/:problemId", adminMiddleware, deleteVideo);


module.exports = videoRouter;