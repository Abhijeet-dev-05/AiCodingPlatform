const OpenAI = require("openai");
const CodeReview = require("../models/codeReview");
const Submission = require("../models/submission");
const Problem = require("../models/problem");

/**
 * Review code using Groq AI (Llama 3.3 70B)
 * POST /code-review/review/:submissionId
 */
const reviewCode = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const userId = req.user._id;

    // Check if review already exists
    const existingReview = await CodeReview.findOne({ submissionId });
    if (existingReview) {
      return res.status(200).json({
        success: true,
        data: existingReview,
        cached: true,
      });
    }

    // Fetch submission and problem
    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ success: false, message: "Submission not found" });
    }

    const problem = await Problem.findById(submission.problemId);
    if (!problem) {
      return res.status(404).json({ success: false, message: "Problem not found" });
    }

    // Get reference solution for comparison
    const referenceSolution = problem.referenceSolution?.find(
      (sol) => sol.language?.toLowerCase() === submission.language?.toLowerCase()
    ) || problem.referenceSolution?.[0];

    const client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });

    const systemPrompt = `You are an expert code reviewer specializing in Data Structures and Algorithms. 
You MUST respond with ONLY valid JSON — no markdown, no code fences, no explanation text outside the JSON.

Analyze the submitted code and return a JSON object with this EXACT structure:
{
  "complexityAnalysis": {
    "timeComplexity": "O(...)",
    "spaceComplexity": "O(...)",
    "explanation": "Brief explanation of how you derived these complexities"
  },
  "codeSmells": [
    {
      "type": "smell-type-name",
      "severity": "info|warning|critical",
      "line": 0,
      "description": "What the issue is",
      "suggestion": "How to fix it"
    }
  ],
  "optimizations": [
    {
      "title": "Optimization name",
      "description": "What to improve and why",
      "impact": "low|medium|high",
      "suggestedCode": "Brief code snippet or pseudocode"
    }
  ],
  "scores": {
    "readability": 75,
    "efficiency": 80,
    "bestPractices": 70,
    "overall": 75
  },
  "comparisonWithOptimal": {
    "isOptimal": false,
    "optimalComplexity": "O(...)",
    "gap": "Description of how user's solution compares to optimal",
    "explanation": "Detailed comparison"
  }
}

SCORING GUIDELINES:
- readability (0-100): Variable naming, code structure, comments, formatting
- efficiency (0-100): Time/space complexity relative to optimal, unnecessary operations
- bestPractices (0-100): Language idioms, error handling, edge cases, clean code principles
- overall (0-100): Weighted average (readability 25%, efficiency 45%, bestPractices 30%)

IMPORTANT: 
- Return 0-5 code smells maximum
- Return 1-3 optimizations maximum
- Scores should be realistic, not always high
- If code is near-optimal, acknowledge it
- Line numbers should reference the submitted code`;

    const userPrompt = `
PROBLEM: ${problem.title}
DESCRIPTION: ${problem.description}
DIFFICULTY: ${problem.difficulty}
TAGS: ${problem.tags}

SUBMITTED CODE (${submission.language}):
\`\`\`
${submission.code}
\`\`\`

${referenceSolution ? `REFERENCE SOLUTION (${referenceSolution.language}):
\`\`\`
${referenceSolution.completeCode}
\`\`\`` : "No reference solution available."}

SUBMISSION STATUS: ${submission.status}
RUNTIME: ${submission.runtime}ms
MEMORY: ${submission.memory}KB

Analyze this code and respond with ONLY the JSON object.`;

    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    let responseText = completion.choices[0].message.content.trim();

    // Strip markdown code fences if present
    if (responseText.startsWith("```")) {
      responseText = responseText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    let analysis;
    try {
      analysis = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse AI response:", responseText);
      return res.status(500).json({
        success: false,
        message: "AI returned invalid response format",
      });
    }

    // Validate and clamp scores
    const clampScore = (val) => Math.min(Math.max(Math.round(Number(val) || 0), 0), 100);

    const reviewData = {
      userId,
      problemId: submission.problemId,
      submissionId,
      code: submission.code,
      language: submission.language,
      complexityAnalysis: {
        timeComplexity: analysis.complexityAnalysis?.timeComplexity || "Unknown",
        spaceComplexity: analysis.complexityAnalysis?.spaceComplexity || "Unknown",
        explanation: analysis.complexityAnalysis?.explanation || "",
      },
      codeSmells: (analysis.codeSmells || []).slice(0, 5).map((smell) => ({
        type: smell.type || "general",
        severity: ["info", "warning", "critical"].includes(smell.severity) ? smell.severity : "info",
        line: Number(smell.line) || 0,
        description: smell.description || "",
        suggestion: smell.suggestion || "",
      })),
      optimizations: (analysis.optimizations || []).slice(0, 3).map((opt) => ({
        title: opt.title || "",
        description: opt.description || "",
        impact: ["low", "medium", "high"].includes(opt.impact) ? opt.impact : "medium",
        suggestedCode: opt.suggestedCode || "",
      })),
      scores: {
        readability: clampScore(analysis.scores?.readability),
        efficiency: clampScore(analysis.scores?.efficiency),
        bestPractices: clampScore(analysis.scores?.bestPractices),
        overall: clampScore(analysis.scores?.overall),
      },
      comparisonWithOptimal: {
        isOptimal: Boolean(analysis.comparisonWithOptimal?.isOptimal),
        optimalComplexity: analysis.comparisonWithOptimal?.optimalComplexity || "",
        gap: analysis.comparisonWithOptimal?.gap || "",
        explanation: analysis.comparisonWithOptimal?.explanation || "",
      },
    };

    const review = await CodeReview.create(reviewData);

    res.status(201).json({
      success: true,
      data: review,
      cached: false,
    });

  } catch (err) {
    console.error("Code review error:", err.message);

    if (err.message && err.message.includes("429")) {
      return res.status(429).json({
        success: false,
        message: "Rate limit exceeded. Please wait and try again.",
        retryAfter: 60,
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

/**
 * Get review history for the authenticated user with quality trends
 * GET /code-review/history
 */
const getReviewHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    const reviews = await CodeReview.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("problemId", "title difficulty tags");

    // Calculate quality trend data
    const trendData = reviews
      .slice()
      .reverse()
      .map((r) => ({
        date: r.createdAt,
        overall: r.scores.overall,
        readability: r.scores.readability,
        efficiency: r.scores.efficiency,
        bestPractices: r.scores.bestPractices,
        problemTitle: r.problemId?.title || "Unknown",
      }));

    // Most common code smells
    const smellCounts = {};
    reviews.forEach((r) => {
      r.codeSmells.forEach((smell) => {
        smellCounts[smell.type] = (smellCounts[smell.type] || 0) + 1;
      });
    });

    const commonSmells = Object.entries(smellCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([type, count]) => ({ type, count }));

    // Average scores
    const avgScores = {
      readability: 0,
      efficiency: 0,
      bestPractices: 0,
      overall: 0,
    };

    if (reviews.length > 0) {
      reviews.forEach((r) => {
        avgScores.readability += r.scores.readability;
        avgScores.efficiency += r.scores.efficiency;
        avgScores.bestPractices += r.scores.bestPractices;
        avgScores.overall += r.scores.overall;
      });
      Object.keys(avgScores).forEach((key) => {
        avgScores[key] = Math.round(avgScores[key] / reviews.length);
      });
    }

    res.status(200).json({
      success: true,
      data: {
        reviews,
        trendData,
        commonSmells,
        avgScores,
        totalReviews: reviews.length,
      },
    });

  } catch (err) {
    console.error("Review history error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * Get review for a specific submission
 * GET /code-review/submission/:submissionId
 */
const getReviewBySubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;

    const review = await CodeReview.findOne({ submissionId })
      .populate("problemId", "title difficulty tags");

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "No review found for this submission",
      });
    }

    res.status(200).json({
      success: true,
      data: review,
    });

  } catch (err) {
    console.error("Get review error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { reviewCode, getReviewHistory, getReviewBySubmission };
