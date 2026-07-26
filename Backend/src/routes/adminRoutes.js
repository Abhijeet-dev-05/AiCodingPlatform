const express = require('express');
const router = express.Router();
const {
    getOverviewStats,
    getProblemStats,
    getSubmissionStats,
    getUserStats,
    getRecentActivity
} = require('../controllers/adminController');
const adminMiddleware = require('../middleware/adminMiddleware');

// All routes require authentication and admin role
router.get('/stats/overview', adminMiddleware, getOverviewStats);
router.get('/stats/problems', adminMiddleware, getProblemStats);
router.get('/stats/submissions', adminMiddleware, getSubmissionStats);
router.get('/stats/users', adminMiddleware, getUserStats);
router.get('/stats/recent-activity', adminMiddleware, getRecentActivity);

module.exports = router;

