const express = require("express");
const router = express.Router();
const multer = require("multer");
const voiceController = require("../controllers/voiceInterview");
// Note: middleware exports default (not named), so import accordingly
const userMiddleware = require("../middleware/userMiddleware");

// Memory storage — no disk writes needed for audio transcription
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024, // 20 MB max
  },
  fileFilter: (_req, file, cb) => {
    // Accept any audio or video/webm (Chrome records as video/webm)
    if (
      file.mimetype.startsWith("audio/") ||
      file.mimetype === "video/webm"
    ) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}`));
    }
  },
});

// POST /interview/voice/speech-to-text
router.post(
  "/speech-to-text",
  userMiddleware,
  upload.single("audio"),
  voiceController.speechToText
);

// GET /interview/voice/settings
router.get("/settings", userMiddleware, voiceController.getVoiceSettings);

module.exports = router;
