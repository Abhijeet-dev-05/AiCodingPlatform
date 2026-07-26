const express = require('express');
const careerRouter = express.Router();
const userMiddleware = require("../middleware/userMiddleware");
const { careerGuidance, generateRoadmap, getMotivationalQuote } = require('../controllers/careerGuidance');

// Career guidance chat
careerRouter.post('/chat', userMiddleware, careerGuidance);



// Generate learning roadmap
careerRouter.post('/roadmap', userMiddleware, generateRoadmap);

// Get motivational quote
careerRouter.post('/quote', userMiddleware, getMotivationalQuote);

module.exports = careerRouter;
