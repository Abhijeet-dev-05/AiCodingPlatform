const SpacedRepetition = require("../models/spacedRepetition");
const Problem = require("../models/problem");
const { initializeCard, scheduleCard, getReviewIntervals, getRetrievability } = require("../utils/fsrsAlgorithm");

/**
 * Add a solved problem to the user's review queue
 * POST /review/add/:problemId
 */
const addToReviewQueue = async (req, res) => {
  try {
    const userId = req.user._id;
    const { problemId } = req.params;

    // Check if card already exists
    const existing = await SpacedRepetition.findOne({ userId, problemId });
    if (existing) {
      return res.status(200).json({
        success: true,
        message: "Problem already in review queue",
        data: existing,
      });
    }

    // Verify problem exists
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ success: false, message: "Problem not found" });
    }

    // Create new FSRS card
    const cardDefaults = initializeCard();
    const card = await SpacedRepetition.create({
      userId,
      problemId,
      ...cardDefaults,
    });

    res.status(201).json({
      success: true,
      message: "Problem added to review queue",
      data: card,
    });

  } catch (err) {
    // Handle duplicate key error (race condition)
    if (err.code === 11000) {
      return res.status(200).json({
        success: true,
        message: "Problem already in review queue",
      });
    }
    console.error("Add to review error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * Get today's review queue — problems due for review
 * GET /review/daily
 */
const getDailyReview = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    // Find all cards due for review (nextReviewDate <= now)
    const dueCards = await SpacedRepetition.find({
      userId,
      nextReviewDate: { $lte: now },
    })
      .populate("problemId", "title difficulty tags description visibleTestCases")
      .sort({ nextReviewDate: 1 }); // Most overdue first

    // For each card, calculate current retention and preview intervals
    const reviewQueue = dueCards.map((card) => {
      const elapsedDays = card.lastReviewDate
        ? (now.getTime() - new Date(card.lastReviewDate).getTime()) / (1000 * 60 * 60 * 24)
        : 0;

      const currentRetention = card.state === "new"
        ? 1.0
        : getRetrievability(card.stability, elapsedDays);

      const intervals = getReviewIntervals(card.toObject());

      return {
        _id: card._id,
        problemId: card.problemId,
        state: card.state,
        reps: card.reps,
        lapses: card.lapses,
        difficulty: card.difficulty,
        stability: card.stability,
        currentRetention: Math.round(currentRetention * 100),
        lastReviewDate: card.lastReviewDate,
        nextReviewDate: card.nextReviewDate,
        intervals,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        dueCount: reviewQueue.length,
        queue: reviewQueue,
      },
    });

  } catch (err) {
    console.error("Daily review error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * Submit a review rating for a card
 * POST /review/submit/:cardId
 * Body: { rating: 1|2|3|4, timeSpent: seconds }
 */
const submitReview = async (req, res) => {
  try {
    const { cardId } = req.params;
    const { rating, timeSpent = 0 } = req.body;
    const userId = req.user._id;

    if (!rating || ![1, 2, 3, 4].includes(Number(rating))) {
      return res.status(400).json({
        success: false,
        message: "Rating must be 1 (Again), 2 (Hard), 3 (Good), or 4 (Easy)",
      });
    }

    const card = await SpacedRepetition.findOne({ _id: cardId, userId });
    if (!card) {
      return res.status(404).json({ success: false, message: "Review card not found" });
    }

    // Run FSRS algorithm
    const updatedParams = scheduleCard(card.toObject(), Number(rating), Number(timeSpent));

    // Add to review history
    card.reviewHistory.push({
      date: new Date(),
      rating: Number(rating),
      elapsedDays: updatedParams.elapsedDays,
      scheduledDays: updatedParams.scheduledDays,
      state: card.state,
    });

    // Update card with new FSRS parameters
    card.stability = updatedParams.stability;
    card.difficulty = updatedParams.difficulty;
    card.elapsedDays = updatedParams.elapsedDays;
    card.scheduledDays = updatedParams.scheduledDays;
    card.reps = updatedParams.reps;
    card.lapses = updatedParams.lapses;
    card.state = updatedParams.state;
    card.nextReviewDate = updatedParams.nextReviewDate;
    card.lastReviewDate = updatedParams.lastReviewDate;
    card.retentionRate = updatedParams.retentionRate;
    card.totalReviewTime = updatedParams.totalReviewTime;

    await card.save();

    // Get updated intervals for next review
    const intervals = getReviewIntervals(card.toObject());

    res.status(200).json({
      success: true,
      data: {
        card,
        nextReviewDate: card.nextReviewDate,
        scheduledDays: card.scheduledDays,
        intervals,
      },
    });

  } catch (err) {
    console.error("Submit review error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * Get review statistics for the user
 * GET /review/stats
 */
const getReviewStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    const allCards = await SpacedRepetition.find({ userId })
      .populate("problemId", "title difficulty tags");

    const totalCards = allCards.length;
    const dueToday = allCards.filter((c) => new Date(c.nextReviewDate) <= now).length;
    const newCards = allCards.filter((c) => c.state === "new").length;
    const learningCards = allCards.filter((c) => c.state === "learning" || c.state === "relearning").length;
    const reviewCards = allCards.filter((c) => c.state === "review").length;

    // Average retention across all review cards
    let avgRetention = 0;
    let reviewedCards = 0;
    allCards.forEach((card) => {
      if (card.state !== "new" && card.stability > 0) {
        const elapsed = card.lastReviewDate
          ? (now.getTime() - new Date(card.lastReviewDate).getTime()) / (1000 * 60 * 60 * 24)
          : 0;
        avgRetention += getRetrievability(card.stability, elapsed);
        reviewedCards++;
      }
    });
    avgRetention = reviewedCards > 0 ? Math.round((avgRetention / reviewedCards) * 100) : 100;

    // Total reviews done
    const totalReviews = allCards.reduce((sum, c) => sum + c.reps, 0);
    const totalLapses = allCards.reduce((sum, c) => sum + c.lapses, 0);

    // Review streak (consecutive days with reviews)
    const reviewDates = new Set();
    allCards.forEach((card) => {
      card.reviewHistory.forEach((entry) => {
        reviewDates.add(new Date(entry.date).toISOString().split("T")[0]);
      });
    });

    const sortedDates = [...reviewDates].sort().reverse();
    let reviewStreak = 0;
    const today = now.toISOString().split("T")[0];
    const yesterday = new Date(now.getTime() - 86400000).toISOString().split("T")[0];

    if (sortedDates.includes(today) || sortedDates.includes(yesterday)) {
      let checkDate = sortedDates.includes(today) ? today : yesterday;
      reviewStreak = 1;
      for (let i = 0; i < sortedDates.length; i++) {
        const prevDate = new Date(new Date(checkDate).getTime() - 86400000).toISOString().split("T")[0];
        if (sortedDates.includes(prevDate)) {
          reviewStreak++;
          checkDate = prevDate;
        } else {
          break;
        }
      }
    }

    // Difficulty distribution
    const difficultyDist = { easy: 0, medium: 0, hard: 0 };
    allCards.forEach((card) => {
      const diff = card.problemId?.difficulty?.toLowerCase();
      if (difficultyDist[diff] !== undefined) {
        difficultyDist[diff]++;
      }
    });

    res.status(200).json({
      success: true,
      data: {
        totalCards,
        dueToday,
        newCards,
        learningCards,
        reviewCards,
        avgRetention,
        totalReviews,
        totalLapses,
        reviewStreak,
        difficultyDist,
      },
    });

  } catch (err) {
    console.error("Review stats error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * Get upcoming reviews forecast (next 7 days)
 * GET /review/upcoming
 */
const getUpcomingReviews = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    const allCards = await SpacedRepetition.find({ userId });

    // Build forecast for next 7 days
    const forecast = [];
    for (let i = 0; i < 7; i++) {
      const dayStart = new Date(now);
      dayStart.setDate(dayStart.getDate() + i);
      dayStart.setHours(0, 0, 0, 0);

      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      const dueCount = allCards.filter((card) => {
        const reviewDate = new Date(card.nextReviewDate);
        if (i === 0) {
          // Today: include overdue + due today
          return reviewDate <= dayEnd;
        }
        return reviewDate >= dayStart && reviewDate <= dayEnd;
      }).length;

      forecast.push({
        date: dayStart.toISOString().split("T")[0],
        dayLabel: i === 0 ? "Today" : i === 1 ? "Tomorrow" : dayStart.toLocaleDateString("en-US", { weekday: "short" }),
        count: dueCount,
      });
    }

    res.status(200).json({
      success: true,
      data: forecast,
    });

  } catch (err) {
    console.error("Upcoming reviews error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * Reset a review card back to "new" state
 * POST /review/reset/:cardId
 */
const resetCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const userId = req.user._id;

    const card = await SpacedRepetition.findOne({ _id: cardId, userId });
    if (!card) {
      return res.status(404).json({ success: false, message: "Card not found" });
    }

    const defaults = initializeCard();
    card.stability = defaults.stability;
    card.difficulty = defaults.difficulty;
    card.elapsedDays = defaults.elapsedDays;
    card.scheduledDays = defaults.scheduledDays;
    card.reps = defaults.reps;
    card.lapses = defaults.lapses;
    card.state = defaults.state;
    card.nextReviewDate = defaults.nextReviewDate;
    card.lastReviewDate = defaults.lastReviewDate;
    card.retentionRate = defaults.retentionRate;

    await card.save();

    res.status(200).json({
      success: true,
      message: "Card reset to new state",
      data: card,
    });

  } catch (err) {
    console.error("Reset card error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * Migrate all previously solved problems to spaced repetition
 * POST /review/migrate
 * Adds all problems from user.problemSolved that aren't already in review queue
 */
const migrateSolvedProblems = async (req, res) => {
  try {
    const userId = req.user._id;
    const User = require("../models/user");
    
    // Get user with problemSolved array
    const user = await User.findById(userId).select("problemSolved");
    if (!user || !user.problemSolved || user.problemSolved.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No problems to migrate",
        data: { migratedCount: 0, skippedCount: 0 },
      });
    }

    let migratedCount = 0;
    let skippedCount = 0;
    const errors = [];

    for (const problemId of user.problemSolved) {
      try {
        // Check if card already exists
        const existing = await SpacedRepetition.findOne({ userId, problemId });
        if (existing) {
          skippedCount++;
          continue;
        }

        // Verify problem exists
        const problem = await Problem.findById(problemId);
        if (!problem) {
          errors.push(`Problem ${problemId} not found in database`);
          continue;
        }

        // Create new FSRS card
        const cardDefaults = initializeCard();
        await SpacedRepetition.create({
          userId,
          problemId,
          ...cardDefaults,
          // Mark as already reviewed once (so it appears in review state)
          state: "review",
          reps: 1,
          lastReviewDate: new Date(),
          nextReviewDate: new Date(), // Due for review today
        });

        migratedCount++;
      } catch (err) {
        if (err.code !== 11000) { // Ignore duplicate key errors
          errors.push(`Error migrating problem ${problemId}: ${err.message}`);
        }
      }
    }

    res.status(200).json({
      success: true,
      message: `Migration completed. ${migratedCount} problems migrated, ${skippedCount} already in queue`,
      data: {
        migratedCount,
        skippedCount,
        totalProblems: user.problemSolved.length,
        errors: errors.length > 0 ? errors : undefined,
      },
    });

  } catch (err) {
    console.error("Migration error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  addToReviewQueue,
  getDailyReview,
  submitReview,
  getReviewStats,
  getUpcomingReviews,
  resetCard,
  migrateSolvedProblems,
};
