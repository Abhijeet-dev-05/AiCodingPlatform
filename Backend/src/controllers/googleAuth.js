const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const axios = require("axios");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const verifyGoogleToken = async (token) => {
  try {
    // First try as an ID token (from GoogleLogin component)
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    return ticket.getPayload();
  } catch (idTokenErr) {
    // If that fails, try as an access token (from useGoogleLogin hook)
    try {
      const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (accessTokenErr) {
      throw new Error("Invalid Google token");
    }
  }
};

const googleAuth = async (req, res) => {
  try {
    const { googleToken } = req.body;

    if (!googleToken) {
      return res.status(400).json({ message: "Google token is required" });
    }

    // Verify the Google token
    const payload = await verifyGoogleToken(googleToken);

    const { sub: googleId, email: emailId, name: firstName, picture: profilePicture } = payload;

    // Check if user exists
    let user = await User.findOne({
      $or: [{ googleId }, { emailId }],
    });

    if (user) {
      // If user exists but doesn't have googleId, update it
      if (!user.googleId) {
        user.googleId = googleId;
        user.authProvider = "google";
        if (!user.profilePicture && profilePicture) {
          user.profilePicture = profilePicture;
        }
        await user.save();
      }
    } else {
      // Create new user
      user = await User.create({
        firstName,
        emailId,
        googleId,
        profilePicture,
        authProvider: "google",
        role: "user",
      });
    }

    // Generate JWT token
    const jwtToken = jwt.sign(
      { _id: user._id, role: user.role, emailId: user.emailId },
      process.env.JWT_KEY,
      { expiresIn: 60 * 60 }
    );

    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("token", jwtToken, { 
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction
    });

    const reply = {
      firstName: user.firstName,
      emailId: user.emailId,
      _id: user._id,
      role: user.role,
      profilePicture: user.profilePicture,
    };

    res.status(200).json({
      user: reply,
      message: "Google authentication successful",
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(401).json({ message: error.message || "Authentication failed" });
  }
};

module.exports = {
  googleAuth,
  verifyGoogleToken,
};
