const mongoose = require('mongoose');

async function main() {
    const uri = process.env.DB_CONNECT_STRING || process.env.MONGODB_URI;
    if (!uri || typeof uri !== 'string') {
        throw new Error('Missing MongoDB connection string. Set DB_CONNECT_STRING or MONGODB_URI in environment.');
    }
    await mongoose.connect(uri);
}

module.exports = main;