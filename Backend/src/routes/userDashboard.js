const express = require('express');
const userDashboardRouter = express.Router();
const userMiddleware = require('../middleware/userMiddleware');
const { getUserStats, getHeatmapData, getRecentSubmissions, getSolvedProblems } = require('../controllers/userDashboardController');

// User dashboard routes
userDashboardRouter.get('/stats', userMiddleware, getUserStats);
userDashboardRouter.get('/heatmap', userMiddleware, getHeatmapData);
userDashboardRouter.get('/submissions', userMiddleware, getRecentSubmissions);
userDashboardRouter.get('/solved-problems', userMiddleware, getSolvedProblems);

module.exports = userDashboardRouter;
