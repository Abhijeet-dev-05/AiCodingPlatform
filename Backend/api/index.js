const serverless = require('serverless-http');
const { app, initializeConnections } = require('../src/index');

// Initialize DB/Redis once on cold start
initializeConnections().catch(err => console.error('DB init error', err));

module.exports = serverless(app);
