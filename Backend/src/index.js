const express = require("express");
const app = express();
require("dotenv").config({ path: __dirname + "/../.env" });
const main = require("./config/db");
const redisClient = require("./config/redis");
const cookieParser = require("cookie-parser");


const authRouter = require("./routes/userAuth");
const problemRouter = require("./routes/problemCreator");
const submitRouter = require("./routes/submit");
const aiRouter = require("./routes/aiChatting");
const careerRouter = require("./routes/careerRoutes");
const interviewRouter = require("./routes/interviewRoutes");
const voiceInterviewRouter = require("./routes/voiceInterview");
const adminRouter = require("./routes/adminRoutes");
const videoRouter = require("./routes/videoCreator");
const userDashboardRouter = require("./routes/userDashboard");
const codeReviewRouter = require("./routes/codeReviewRoutes");
const spacedRepetitionRouter = require("./routes/spacedRepetitionRoutes");


const cors = require("cors");
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/user", authRouter);
app.use("/problem", problemRouter);
app.use("/submission", submitRouter);
app.use("/ai", aiRouter);
app.use("/career", careerRouter);
app.use("/interview", interviewRouter);
app.use("/interview/voice", voiceInterviewRouter);
app.use("/admin", adminRouter);
app.use("/video", videoRouter);
app.use("/dashboard", userDashboardRouter);
app.use("/code-review", codeReviewRouter);
app.use("/review", spacedRepetitionRouter);

const initializeConnections = async () => {
  try {
    await Promise.all([main(), redisClient.connect()]);
    console.log("DB Connected");
  } catch (error) {
    console.log("Error occurred :" + error);
    throw error;
  }
};

module.exports = { app, initializeConnections };

if (require.main === module) {
  (async () => {
    await initializeConnections();
    app.listen(process.env.PORT || 3000, () => {
      console.log("Server started on port", process.env.PORT || 3000);
    });
  })();
}


