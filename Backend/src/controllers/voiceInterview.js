const Groq = require("groq-sdk");

// Initialize Groq client — used for both STT (Whisper) only
// TTS is handled by the browser's Web Speech API (free, no key needed)
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Convert speech to text (User's voice answer transcription)
 * POST /interview/voice/speech-to-text
 * Body: multipart/form-data with audio file field named "audio"
 */
exports.speechToText = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Audio file is required",
      });
    }

    // Groq Whisper needs a File-like object — Node 20+ has File globally,
    // for older Node versions we polyfill with a Buffer + name trick
    const audioFile = new File(
      [req.file.buffer],
      req.file.originalname || "recording.webm",
      { type: req.file.mimetype || "audio/webm" }
    );

    const transcription = await groq.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-large-v3",
      language: "en",
      response_format: "json",
      temperature: 0.0,
    });

    return res.status(200).json({
      success: true,
      transcription: transcription.text,
    });
  } catch (error) {
    console.error("Speech-to-text error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to transcribe audio",
      error: error.message,
    });
  }
};

/**
 * Get voice settings (browser TTS voices are client-side only)
 * GET /interview/voice/settings
 */
exports.getVoiceSettings = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      settings: {
        tts: "browser", // handled client-side via Web Speech API
        sttProvider: "groq-whisper-large-v3",
        maxAudioDurationSeconds: 120,
        audioFormat: "webm",
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
