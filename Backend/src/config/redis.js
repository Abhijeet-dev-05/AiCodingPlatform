const { createClient } = require("redis");

const redisClient = createClient({    
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'quiet-ruddy-turbocool-70767.db.redis.io',
        port: process.env.REDIS_PORT
    }
});

module.exports = redisClient;
