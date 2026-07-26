const User = require("../models/user");
const validate = require("../utils/validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const redisClient = require("../config/redis");
const Submissions = require("../models/submission");

const register = async (req, res) => {
  try {
    //validate the data
    validate(req.body);
    const { firstName, emailId, password } = req.body;

    req.body.password = await bcrypt.hash(password, 10);

    req.body.role = 'user';


    const user = await User.create(req.body);


    const reply = {
      firstName: user.firstName,
      emailId: user.emailId,
      _id: user._id,
      role: user.role
    }

    const token = jwt.sign(
      { _id: user._id, role: user.role, emailId: emailId },
      process.env.JWT_KEY,
      {
        expiresIn: 60 * 60,
      }
    );

    res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
    res.status(201).json({
      user: reply,
      message: "User Registered Sucessfully"
    });
  } catch (err) {
    res.status(400).send("Erro:" + err);
  }
};

const login = async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!emailId) {
      throw new Error("Invalid Credentials");
    }
    if (!password) {
      throw new Error("Invalid Credentials");
    }
    const user = await User.findOne({ emailId });
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new Error("Invalid credentials");
    }

    const reply = {
      firstName: user.firstName,
      emailId: user.emailId,
      _id: user._id,
      role: user.role
    }


    const token = jwt.sign(
      { _id: user._id, role: user.role, emailId: emailId },
      process.env.JWT_KEY,
      {
        expiresIn: 60 * 60,
      }
    );

    res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
    res.status(200).json({
      user: reply,
      message: "Logged In Successfully"
    });
  } catch (error) {
    res.status(401).send("Invalid credentials");
  }
};


const logout = async (req, res) => {
  try {
    const { token } = req.cookies;
    const payload = jwt.decode(token);
    await redisClient.set(`token:${token}`, "Blocked");
    await redisClient.expireAt(`token:${token}`, payload.exp);
    res.cookie('token', null, { expires: new Date(Date.now()) });
    res.send("Logged Out Sucessfully");
    //validate the token
    //token add kar dunga Redis ke blocklist me
    //cookie ko clear karde...

  }
  catch (err) {
    res.status(503).send("Error logging out");
  }
}

const adminRegister = async (req, res) => {
  try {
    //validate the data
    validate(req.body);
    const { firstName, emailId, password } = req.body;

    req.body.password = await bcrypt.hash(password, 10);



    const user = await User.create(req.body);

    const token = jwt.sign(
      { _id: user._id, role: user.role, emailId: emailId },
      process.env.JWT_KEY,
      {
        expiresIn: 60 * 60,
      }
    );

    res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
    res.status(201).send("Admin Registered Sucessfully");
  } catch (err) {
    res.status(400).send("Erro:" + err);
  }
}

const deleteProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    await User.findByIdAndDelete(userId);
    await Submissions.deleteMany({ userId });
    res.status(200).send("Profile Deleted Sucessfully");
  } catch (err) {
    res.status(503).send("Error deleting profile");
  }
}

module.exports = {
  register,
  login,
  logout,
  adminRegister,
  deleteProfile
}
