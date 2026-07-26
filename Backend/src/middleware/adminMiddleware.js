const jwt = require('jsonwebtoken');
const redisClient = require("../config/redis");
const User = require("../models/user");

const adminMiddleware = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            throw new Error("Token is not present");
        }
        const payload = jwt.verify(token, process.env.JWT_KEY);
        const { _id } = payload;
        if (!_id) {
            throw new Error("Invalid token");
        }
        const result = await User.findById(_id);
        if (!result) {
            throw new Error("User not found");
        }
        //reddis ke blocklist mein present to nahi hai?

        if (payload.role != 'admin') {
            throw new Error("User is not admin");
        }

        const IsBlocked = await redisClient.exists(`token:${token}`);
        if (IsBlocked) {
            throw new Error("Admin is blocked");
        }
        req.user = result;
        next();

    }
    catch (err) {
        res.status(401).send("Error in userMiddleware");
    }
}

module.exports = adminMiddleware;
