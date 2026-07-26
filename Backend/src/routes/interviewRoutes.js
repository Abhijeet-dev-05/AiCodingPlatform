const express = require('express');
const router = express.Router();
const {
    getDomains,
    generateQuestion,
    evaluateAnswer,
    getHint,
    generateSummary
} = require('../controllers/aiInterview');

// Get all available domains
router.get('/domains', getDomains);

// Generate interview question
router.post('/question', generateQuestion);

// Evaluate user's answer
router.post('/evaluate', evaluateAnswer);

// Get hint for current question
router.post('/hint', getHint);

// Generate interview summary
router.post('/summary', generateSummary);

module.exports = router;
