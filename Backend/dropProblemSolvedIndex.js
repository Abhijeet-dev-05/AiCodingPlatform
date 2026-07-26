const mongoose = require('mongoose');
const User = require('./src/models/user');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/leetcode')
    .then(async () => {
        console.log('Connected to MongoDB');

        try {
            // Drop the problematic index
            await User.collection.dropIndex('problemSolved_1');
            console.log('✅ Successfully dropped problemSolved_1 index');
        } catch (error) {
            if (error.code === 27) {
                console.log('ℹ️ Index problemSolved_1 does not exist (already dropped or never created)');
            } else {
                console.error('❌ Error dropping index:', error.message);
            }
        }

        // List all indexes to verify
        const indexes = await User.collection.indexes();
        console.log('\nCurrent indexes on users collection:');
        indexes.forEach(index => {
            console.log(`  - ${index.name}:`, Object.keys(index.key).join(', '));
        });

        await mongoose.connection.close();
        console.log('\nMongoDB connection closed');
        process.exit(0);
    })
    .catch(error => {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1);
    });
