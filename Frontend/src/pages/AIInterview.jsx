import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router";
import axiosClient from "../utils/axiosClient";
import ReactMarkdown from "react-markdown";
import {
  ArrowLeft, Play, Clock, Target, Zap, Trophy, Brain,
  ChevronRight, Lightbulb, CheckCircle, XCircle, Loader2,
  RotateCcw, Award, TrendingUp, Sparkles, Timer, Send, RefreshCw,
  Mic, MicOff, Volume2, VolumeX
} from "lucide-react";
import "./AIInterview.css";

const MODES = [
  { id: "quick",    name: "Quick",    questions: 5,  icon: "⚡", desc: "5 minute warmup" },
  { id: "standard", name: "Standard", questions: 10, icon: "🎯", desc: "Full interview" },
  { id: "marathon", name: "Marathon", questions: 20, icon: "🏆", desc: "Deep dive" },
];

const DIFFICULTIES = [
  { id: "beginner",     name: "Beginner",     color: "#22c55e", desc: "Freshers & Students" },
  { id: "intermediate", name: "Intermediate", color: "#fbbf24", desc: "1-3 years exp" },
  { id: "expert",       name: "Expert",       color: "#ef4444", desc: "Senior roles" },
];

const FALLBACK_DOMAINS = {
  "Languages": [
    { id: "javascript", name: "JavaScript", icon: "🟨" },
    { id: "python",     name: "Python",     icon: "🐍" },
    { id: "java",       name: "Java",       icon: "☕" },
    { id: "cpp",        name: "C++",        icon: "⚡" },
    { id: "typescript", name: "TypeScript", icon: "🔷" },
    { id: "go",         name: "Go",         icon: "🐹" },
  ],
  "Frontend": [
    { id: "react",    name: "React",    icon: "⚛️" },
    { id: "angular",  name: "Angular",  icon: "🅰️" },
    { id: "vue",      name: "Vue.js",   icon: "💚" },
    { id: "html_css", name: "HTML/CSS", icon: "🎨" },
  ],
  "Backend": [
    { id: "nodejs",  name: "Node.js",      icon: "💚" },
    { id: "express", name: "Express.js",   icon: "🚂" },
    { id: "django",  name: "Django",       icon: "🐍" },
    { id: "spring",  name: "Spring Boot",  icon: "🌱" },
  ],
  "Database": [
    { id: "sql",        name: "SQL",        icon: "🗄️" },
    { id: "mongodb",    name: "MongoDB",    icon: "🍃" },
    { id: "postgresql", name: "PostgreSQL", icon: "🐘" },
    { id: "redis",      name: "Redis",      icon: "🔴" },
  ],
  "DevOps": [
    { id: "docker",     name: "Docker",     icon: "🐳" },
    { id: "kubernetes", name: "Kubernetes", icon: "☸️" },
    { id: "aws",        name: "AWS",        icon: "☁️" },
    { id: "git",        name: "Git",        icon: "📚" },
  ],
  "Concepts": [
    { id: "dsa",           name: "Data Structures & Algo", icon: "🧮" },
    { id: "system_design", name: "System Design",          icon: "🏗️" },
    { id: "oop",           name: "OOP",                    icon: "📦" },
    { id: "dbms",          name: "DBMS",                   icon: "🗃️" },
  ],
  "Job Roles": [
    { id: "frontend_developer", name: "Frontend Dev",   icon: "🖥️" },
    { id: "backend_developer",  name: "Backend Dev",    icon: "⚙️" },
    { id: "fullstack_developer",name: "Full Stack Dev", icon: "🔗" },
    { id: "devops_engineer",    name: "DevOps Engineer",icon: "🔧" },
  ],
};

function AIInterview() {
  /* ── core state ───────────────────────────────────────────── */
  const [phase, setPhase] = useState("setup"); // setup | interview | results
  const [domains, setDomains] = useState({});
  const [selectedDomain,     setSelectedDomain]     = useState(null);
  const [selectedMode,       setSelectedMode]       = useState(MODES[1]);
  const [selectedDifficulty, setSelectedDifficulty] = useState(DIFFICULTIES[1]);

  /* ── interview state ─────────────────────────────────────── */
  const [currentQuestion,   setCurrentQuestion]   = useState(null);
  const [questionNumber,    setQuestionNumber]     = useState(0);
  const [userAnswer,        setUserAnswer]         = useState("");
  const [results,           setResults]            = useState([]);
  const [previousQuestions, setPreviousQuestions]  = useState([]);
  const [totalScore,        setTotalScore]         = useState(0);
  const [streak,            setStreak]             = useState(0);
  const [hintsUsed,         setHintsUsed]          = useState(0);

  /* ── UI state ────────────────────────────────────────────── */
  const [isLoading,      setIsLoading]      = useState(false);
  const [showHint,       setShowHint]       = useState(false);
  const [currentHint,    setCurrentHint]    = useState("");
  const [evaluation,     setEvaluation]     = useState(null);
  const [timer,          setTimer]          = useState(120);
  const [isTimerActive,  setIsTimerActive]  = useState(false);
  const [summary,        setSummary]        = useState(null);
  const [startTime,      setStartTime]      = useState(null);

  const answerRef = useRef(null);
  const timerRef  = useRef(null);

  /* ── voice state ─────────────────────────────────────────── */
  const [voiceMode,        setVoiceMode]        = useState(false);
  const [isRecording,      setIsRecording]      = useState(false);
  const [isPlayingAudio,   setIsPlayingAudio]   = useState(false);
  const [isTranscribing,   setIsTranscribing]   = useState(false);
  const [mediaRecorderRef] = useState({ current: null });
  const mediaStreamRef     = useRef(null);
  const chunksRef          = useRef([]);

  /* ── load browser TTS voices on mount ───────────────────── */
  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    const load = () => window.speechSynthesis.getVoices(); // prime the list
    load();
    window.speechSynthesis.onvoiceschanged = load;
  }, []);

  /* ── fetch domains on mount ──────────────────────────────── */
  useEffect(() => { fetchDomains(); }, []);

  /* ── countdown timer ─────────────────────────────────────── */
  useEffect(() => {
    if (isTimerActive && timer > 0) {
      timerRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleSubmitAnswer();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isTimerActive]); // eslint-disable-line

  /* ── auto-play question when voice mode is on ───────────── */
  useEffect(() => {
    if (voiceMode && currentQuestion && !evaluation) {
      // small delay so voices finish loading
      const t = setTimeout(() => speakText(currentQuestion.question), 400);
      return () => clearTimeout(t);
    }
  }, [voiceMode, currentQuestion, evaluation]); // eslint-disable-line

  /* ── cleanup on unmount ──────────────────────────────────── */
  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      stopMicStream();
    };
  }, []); // eslint-disable-line

  /* ═══════════════════════════════════════════════════════════
     DATA FUNCTIONS
  ═══════════════════════════════════════════════════════════ */

  const fetchDomains = async () => {
    try {
      const res = await axiosClient.get("/interview/domains");
      if (res.data.success && Object.keys(res.data.domains).length > 0) {
        setDomains(res.data.domains);
      } else {
        setDomains(FALLBACK_DOMAINS);
      }
    } catch {
      setDomains(FALLBACK_DOMAINS);
    }
  };

  const startInterview = async () => {
    setPhase("interview");
    setStartTime(Date.now());
    setQuestionNumber(1);
    await fetchQuestion(1);
  };

  const fetchQuestion = async (qNum) => {
    setIsLoading(true);
    setEvaluation(null);
    setUserAnswer("");
    setShowHint(false);
    setCurrentHint("");

    try {
      const res = await axiosClient.post("/interview/question", {
        domain:            selectedDomain.id,
        difficulty:        selectedDifficulty.id,
        questionNumber:    qNum,
        totalQuestions:    selectedMode.questions,
        previousQuestions,
      });
      if (res.data.success) {
        setCurrentQuestion(res.data.data);
        setPreviousQuestions(prev => [...prev, res.data.data.question]);
        setTimer(120);
        setIsTimerActive(true);
        setTimeout(() => answerRef.current?.focus(), 100);
      }
    } catch (err) {
      console.error("Error fetching question:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim() && timer > 0) return;
    setIsTimerActive(false);
    setIsLoading(true);

    // Stop any TTS before evaluating
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();

    try {
      const res = await axiosClient.post("/interview/evaluate", {
        question:        currentQuestion.question,
        userAnswer:      userAnswer || "(No answer provided)",
        expectedAnswer:  currentQuestion.expectedAnswer,
        keyPoints:       currentQuestion.keyPoints,
        domain:          selectedDomain.name,
      });
      if (res.data.success) {
        const evalData = { ...res.data.data };
        if (hintsUsed > 0) evalData.score = Math.max(0, evalData.score - 3);

        setEvaluation(evalData);
        setTotalScore(prev => prev + evalData.score);
        setStreak(prev => evalData.isCorrect ? prev + 1 : 0);
        setResults(prev => [...prev, {
          question: currentQuestion.question,
          userAnswer,
          ...evalData,
          topic: currentQuestion.topic,
          hintsUsed: showHint ? 1 : 0,
        }]);
      }
    } catch (err) {
      console.error("Error evaluating:", err);
    } finally {
      setIsLoading(false);
      setHintsUsed(0);
    }
  };

  const handleNextQuestion = async () => {
    // Stop any ongoing speech
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();

    if (questionNumber >= selectedMode.questions) {
      await generateSummary();
      setPhase("results");
    } else {
      const next = questionNumber + 1;
      setQuestionNumber(next);
      await fetchQuestion(next);
    }
  };

  const handleGetHint = async () => {
    setHintsUsed(prev => prev + 1);
    setShowHint(true);
    try {
      const res = await axiosClient.post("/interview/hint", {
        question: currentQuestion.question,
        hint:     currentQuestion.hint,
        domain:   selectedDomain.name,
      });
      setCurrentHint(res.data.hint || currentQuestion.hint);
    } catch {
      setCurrentHint(currentQuestion.hint);
    }
  };

  const generateSummary = async () => {
    setIsLoading(true);
    try {
      const endTime = Date.now();
      const res = await axiosClient.post("/interview/summary", {
        domain:         selectedDomain.name,
        difficulty:     selectedDifficulty.id,
        results,
        totalTime:      (endTime - startTime) / 1000,
        totalQuestions: selectedMode.questions,
      });
      if (res.data.success) setSummary(res.data.summary);
    } catch (err) {
      console.error("Error generating summary:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const restartInterview = () => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setPhase("setup");
    setCurrentQuestion(null);
    setQuestionNumber(0);
    setUserAnswer("");
    setResults([]);
    setPreviousQuestions([]);
    setTotalScore(0);
    setStreak(0);
    setEvaluation(null);
    setSummary(null);
    setVoiceMode(false);
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  /* ═══════════════════════════════════════════════════════════
     VOICE FUNCTIONS
  ═══════════════════════════════════════════════════════════ */

  /** Browser TTS — speaks any text aloud */
  const speakText = useCallback((text) => {
    if (!text || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate   = 0.92;
    utterance.pitch  = 1.0;
    utterance.volume = 1.0;

    // Prefer a clear English voice
    const voices = window.speechSynthesis.getVoices();
    const preferred =
      voices.find(v => v.lang === "en-US" && v.name.toLowerCase().includes("google")) ||
      voices.find(v => v.lang === "en-US") ||
      voices.find(v => v.lang.startsWith("en"));
    if (preferred) utterance.voice = preferred;

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend   = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  }, []);

  /** Stop TTS immediately */
  const stopSpeaking = () => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setIsPlayingAudio(false);
  };

  /** Release microphone stream */
  const stopMicStream = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }
  };

  /** Start recording user's voice */
  const startRecording = async () => {
    // Stop AI speech before recording so we don't capture it
    stopSpeaking();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      chunksRef.current = [];

      // Prefer audio/webm; fall back to whatever the browser supports
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "";

      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : {});

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stopMicStream();
        const blob = new Blob(chunksRef.current, { type: mimeType || "audio/webm" });
        chunksRef.current = [];
        await transcribeAudio(blob);
      };

      recorder.start(250); // collect data every 250 ms
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone error:", err);
      alert("Could not access microphone. Please allow microphone permission in your browser.");
    }
  };

  /** Stop recording — triggers onstop → transcribeAudio */
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  /**
   * Send audio blob to Groq Whisper via backend.
   * Populates the answer textarea for review — user submits manually.
   */
  const transcribeAudio = async (audioBlob) => {
    setIsTranscribing(true);
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");

      const res = await axiosClient.post(
        "/interview/voice/speech-to-text",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data.success && res.data.transcription) {
        // Show transcription in the textarea so user can review / edit
        setUserAnswer(res.data.transcription);
      } else {
        alert("Transcription returned empty. Please try speaking again.");
      }
    } catch (err) {
      console.error("Transcription error:", err);
      alert("Could not transcribe audio. Check your connection and try again.");
    } finally {
      setIsTranscribing(false);
    }
  };

  /** Toggle voice mode on/off */
  const toggleVoiceMode = () => {
    const next = !voiceMode;
    setVoiceMode(next);
    if (!next) {
      stopSpeaking();
      stopMicStream();
      setIsRecording(false);
    } else if (currentQuestion && !evaluation) {
      // Speak current question immediately on enable
      setTimeout(() => speakText(currentQuestion.question), 300);
    }
  };

  /* ═══════════════════════════════════════════════════════════
     RENDER — SETUP PHASE
  ═══════════════════════════════════════════════════════════ */
  if (phase === "setup") {
    return (
      <div className="interview-page">
        <div className="setup-container">
          <div className="interview-page-header">
            <Link to="/" className="interview-back-link">← Back to Home</Link>
            <div className="interview-hero-title-block">
              <h1 className="interview-dashboard-title">
                <span className="interview-title-icon">🎯</span>
                AI Mock Interview
              </h1>
              <p className="interview-dashboard-subtitle">Sharpen your skills with AI-powered practice</p>
            </div>
          </div>

          {/* Mode */}
          <section className="setup-section">
            <h2><Zap size={20} /> Select Interview Mode</h2>
            <div className="mode-cards">
              {MODES.map(mode => (
                <button key={mode.id}
                  className={`mode-card ${selectedMode.id === mode.id ? "active" : ""}`}
                  onClick={() => setSelectedMode(mode)}>
                  <span className="mode-icon">{mode.icon}</span>
                  <span className="mode-name">{mode.name}</span>
                  <span className="mode-questions">{mode.questions} Questions</span>
                  <span className="mode-desc">{mode.desc}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Difficulty */}
          <section className="setup-section">
            <h2><Target size={20} /> Select Difficulty</h2>
            <div className="difficulty-cards">
              {DIFFICULTIES.map(diff => (
                <button key={diff.id}
                  className={`difficulty-card ${selectedDifficulty.id === diff.id ? "active" : ""}`}
                  onClick={() => setSelectedDifficulty(diff)}
                  style={{ "--diff-color": diff.color }}>
                  <span className="diff-name">{diff.name}</span>
                  <span className="diff-desc">{diff.desc}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Domain */}
          <section className="setup-section domain-section">
            <h2><Brain size={20} /> Select Domain</h2>
            <div className="domain-categories">
              {Object.entries(domains).map(([category, items]) => (
                <div key={category} className="domain-category">
                  <h3>{category}</h3>
                  <div className="domain-grid">
                    {items.map(domain => (
                      <button key={domain.id}
                        className={`domain-btn ${selectedDomain?.id === domain.id ? "active" : ""}`}
                        onClick={() => setSelectedDomain(domain)}>
                        <span className="domain-icon">{domain.icon}</span>
                        <span className="domain-name">{domain.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Start */}
          <div className="start-section">
            <button className="start-btn" onClick={startInterview} disabled={!selectedDomain}>
              <Play size={22} /> Start Interview <ChevronRight size={20} />
            </button>
            {selectedDomain && (
              <p className="start-info">
                {selectedMode.questions} {selectedDifficulty.name} questions on {selectedDomain.name}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════════
     RENDER — INTERVIEW PHASE
  ═══════════════════════════════════════════════════════════ */
  if (phase === "interview") {
    return (
      <div className="interview-page">
        {/* Top Bar */}
        <div className="interview-topbar">
          <div className="topbar-left">
            <span className="domain-badge">{selectedDomain.icon} {selectedDomain.name}</span>
            <span className="difficulty-badge" style={{ "--diff-color": selectedDifficulty.color }}>
              {selectedDifficulty.name}
            </span>
          </div>
          <div className="topbar-center">
            <span className="question-counter">Question {questionNumber} / {selectedMode.questions}</span>
            <div className="progress-dots">
              {Array.from({ length: selectedMode.questions }, (_, i) => {
                const r = results[i];
                let cls = "progress-dot";
                if (r)                  cls += r.isCorrect ? " correct" : " incorrect";
                else if (i === questionNumber - 1) cls += " current";
                return <span key={i} className={cls} />;
              })}
            </div>
          </div>
          <div className="topbar-right">
            <div className="score-display"><Trophy size={18} /><span>{totalScore} pts</span></div>
            {streak >= 2 && <div className="streak-display">🔥 {streak} streak!</div>}
          </div>
        </div>

        <div className="interview-main">
          {isLoading && !evaluation ? (
            <div className="loading-state">
              <Loader2 size={48} className="spin" />
              <p>Generating question...</p>
            </div>
          ) : (
            <>
              {/* Timer */}
              <div className={`timer-bar ${timer <= 30 ? "warning" : ""} ${timer <= 10 ? "danger" : ""}`}>
                <Timer size={20} />
                <span>{formatTime(timer)}</span>
                <div className="timer-progress" style={{ width: `${(timer / 120) * 100}%` }} />
              </div>

              {/* Question Card */}
              <div className="question-card">
                {currentQuestion?.topic && <span className="topic-tag">{currentQuestion.topic}</span>}
                <h2 className="question-text">{currentQuestion?.question}</h2>

                {/* Replay / Stop TTS button shown inside the question card */}
                {voiceMode && (
                  <div className="voice-question-controls">
                    {isPlayingAudio ? (
                      <button className="voice-replay-btn speaking" onClick={stopSpeaking}>
                        <VolumeX size={15} /> Stop Speaking
                      </button>
                    ) : (
                      <button className="voice-replay-btn"
                        onClick={() => speakText(currentQuestion?.question)}>
                        <Volume2 size={15} /> Replay Question
                      </button>
                    )}
                  </div>
                )}

                {currentQuestion?.companyRelevance && (
                  <p className="company-relevance">💼 {currentQuestion.companyRelevance}</p>
                )}
              </div>

              {/* ── Answer Section ── */}
              {!evaluation ? (
                <div className="answer-section">

                  {/* Voice Mode Toggle Bar */}
                  <div className="voice-mode-toggle">
                    <button
                      className={`voice-toggle-btn ${voiceMode ? "active" : ""}`}
                      onClick={toggleVoiceMode}>
                      {voiceMode ? <Volume2 size={16} /> : <VolumeX size={16} />}
                      {voiceMode ? "Voice Mode ON" : "Voice Mode OFF"}
                    </button>
                    {voiceMode && (
                      <span className="voice-mode-hint">
                        🔊 AI reads questions aloud &nbsp;·&nbsp; 🎤 Record your answer
                      </span>
                    )}
                  </div>

                  {/* AI Speaking Indicator */}
                  {voiceMode && isPlayingAudio && (
                    <div className="ai-speaking-indicator">
                      <div className="speaking-animation">
                        <span /><span /><span /><span /><span />
                      </div>
                      <p>AI is speaking…</p>
                    </div>
                  )}

                  {voiceMode ? (
                    /* ── VOICE ANSWER UI ── */
                    <div className="voice-answer-section">
                      <div className="voice-controls">
                        {isTranscribing ? (
                          <div className="transcribing-state">
                            <Loader2 size={32} className="spin" />
                            <p>Transcribing your answer…</p>
                          </div>
                        ) : !isRecording ? (
                          <button className="record-btn"
                            onClick={startRecording}
                            disabled={isLoading || isPlayingAudio}>
                            <Mic size={36} />
                            <span>Tap to Record Answer</span>
                          </button>
                        ) : (
                          <button className="recording-btn active" onClick={stopRecording}>
                            <div className="recording-pulse" />
                            <MicOff size={36} />
                            <span>Recording… Tap to Stop</span>
                          </button>
                        )}
                      </div>

                      {/* Transcription preview — editable, user submits manually */}
                      {userAnswer && !isTranscribing && (
                        <div className="transcription-preview">
                          <div className="transcription-preview-header">
                            <h4>📝 Your Answer (review &amp; edit if needed)</h4>
                          </div>
                          <textarea
                            className="transcription-edit-area"
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            rows={4}
                          />
                          <div className="transcription-actions">
                            <button className="voice-rerecord-btn" onClick={() => setUserAnswer("")}>
                              <RefreshCw size={14} /> Re-record
                            </button>
                            <button className="submit-btn"
                              onClick={handleSubmitAnswer}
                              disabled={isLoading || !userAnswer.trim()}>
                              {isLoading ? <Loader2 size={16} className="spin" /> : <Send size={16} />}
                              Submit Answer
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* ── TEXT ANSWER UI ── */
                    <>
                      <textarea
                        ref={answerRef}
                        className="answer-input"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="Type your answer here… Be detailed and explain your reasoning."
                        disabled={isLoading}
                      />
                      <div className="answer-actions">
                        <button className="hint-btn" onClick={handleGetHint}
                          disabled={showHint || isLoading}>
                          <Lightbulb size={18} />
                          {showHint ? "Hint Used (−3 pts)" : "Get Hint (−3 pts)"}
                        </button>
                        <button className="submit-btn" onClick={handleSubmitAnswer}
                          disabled={isLoading || !userAnswer.trim()}>
                          {isLoading ? <Loader2 size={18} className="spin" /> : <Send size={18} />}
                          Submit Answer
                        </button>
                      </div>
                    </>
                  )}

                  {/* Hint Card */}
                  {showHint && currentHint && (
                    <div className="hint-card">
                      <Lightbulb size={20} />
                      <p>{currentHint}</p>
                    </div>
                  )}
                </div>
              ) : (
                /* ── Evaluation Card ── */
                <div className={`evaluation-card ${evaluation.isCorrect ? "correct" : "incorrect"}`}>
                  <div className="eval-header">
                    {evaluation.isCorrect
                      ? <><CheckCircle size={32} /><span>Correct! +{evaluation.score} points</span></>
                      : <><XCircle size={32} /><span>Not quite. {evaluation.score > 0 ? `+${evaluation.score} pts` : "No points"}</span></>}
                  </div>
                  <div className="eval-content">
                    <div className="eval-section">
                      <h4>Your Answer:</h4>
                      <p>{userAnswer || "(No answer provided)"}</p>
                    </div>
                    <div className="eval-section">
                      <h4>Correct Answer:</h4>
                      <p>{evaluation.correctAnswer}</p>
                    </div>
                    <div className="eval-section">
                      <h4>Feedback:</h4>
                      <p>{evaluation.feedback}</p>
                    </div>
                    {evaluation.improvement && (
                      <div className="eval-section improvement">
                        <h4>💡 How to improve:</h4>
                        <p>{evaluation.improvement}</p>
                      </div>
                    )}
                  </div>
                  <button className="next-btn" onClick={handleNextQuestion}>
                    {questionNumber >= selectedMode.questions
                      ? <><Award size={20} /> View Results</>
                      : <>Next Question <ChevronRight size={20} /></>}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════════
     RENDER — RESULTS PHASE
  ═══════════════════════════════════════════════════════════ */
  if (phase === "results") {
    return (
      <div className="interview-page results-page">
        <div className="results-container">
          {isLoading ? (
            <div className="loading-state">
              <Loader2 size={48} className="spin" />
              <p>Generating your interview summary…</p>
            </div>
          ) : summary && (
            <>
              <div className="results-score-card">
                <div className="score-circle" style={{ "--score-pct": summary.percentage }}>
                  <span className="score-value">{summary.percentage}%</span>
                  <span className="score-grade">Grade: {summary.grade}</span>
                </div>
                <div className="score-details">
                  <h1>Interview Complete! 🎉</h1>
                  <p>{selectedDomain.icon} {selectedDomain.name} · {selectedDifficulty.name}</p>
                  <div className="score-stats">
                    <div className="stat">
                      <span className="stat-value">{summary.totalScore}/{summary.maxScore}</span>
                      <span className="stat-label">Points</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">{summary.correctCount}/{summary.totalQuestions}</span>
                      <span className="stat-label">Correct</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">{Math.round(summary.totalTime / 60)}m</span>
                      <span className="stat-label">Time</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="advice-card">
                <h3><Sparkles size={20} /> AI Feedback</h3>
                <ReactMarkdown>{summary.advice}</ReactMarkdown>
              </div>

              {summary.weakTopics?.length > 0 && (
                <div className="weak-topics-card">
                  <h3><TrendingUp size={20} /> Areas to Improve</h3>
                  <div className="topic-tags">
                    {summary.weakTopics.map((t, i) => (
                      <span key={i} className="weak-topic">{t}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="questions-review">
                <h3>📝 Question Review</h3>
                {results.map((result, idx) => (
                  <div key={idx} className={`review-item ${result.isCorrect ? "correct" : "incorrect"}`}>
                    <div className="review-header">
                      <span className="review-num">Q{idx + 1}</span>
                      <span className="review-score">+{result.score} pts</span>
                      {result.isCorrect ? <CheckCircle size={18} /> : <XCircle size={18} />}
                    </div>
                    <p className="review-question">{result.question}</p>
                  </div>
                ))}
              </div>

              <div className="results-actions">
                <button className="retry-btn" onClick={restartInterview}>
                  <RotateCcw size={20} /> Try Again
                </button>
                <Link to="/" className="home-btn">Back to Home</Link>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return null;
}

export default AIInterview;
