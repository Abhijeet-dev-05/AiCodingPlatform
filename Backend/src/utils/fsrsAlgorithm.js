/**
 * FSRS v4 (Free Spaced Repetition Scheduler) Algorithm
 * 
 * A modern spaced repetition algorithm with 19 optimized parameters.
 * Based on the open-source FSRS research by Jarrett Ye.
 * 
 * Rating scale: 1=Again, 2=Hard, 3=Good, 4=Easy
 */

// Optimized default weights (FSRS v4)
const W = [
  0.4072, 1.1829, 3.1262, 15.4722,   // w0-w3: initial stability for ratings 1-4
  7.2102,                               // w4: initial difficulty mean
  0.5316,                               // w5: initial difficulty modifier
  1.0651,                               // w6: difficulty reversion to mean
  0.0046,                               // w7: stability penalty for hard
  1.5418,                               // w8: stability reward for good
  0.1466,                               // w9: stability reward for easy
  1.0014,                               // w10: stability after recall factor
  1.9395,                               // w11: stability growth decay
  0.1082,                               // w12: stability after forgetting factor
  0.2803,                               // w13: stability after forgetting difficulty factor
  2.2671,                               // w14: stability after forgetting stability factor
  0.2055,                               // w15: minimum stability difficulty interaction
  0.3423,                               // w16: hard penalty
  1.4648,                               // w17: easy bonus
  0.2,                                   // w18: mean reversion weight
];

const DECAY = -0.5;
const FACTOR = Math.pow(0.9, 1 / DECAY) - 1; // ≈ 19/81
const REQUEST_RETENTION = 0.9; // Target 90% retention

/**
 * Creates a new FSRS card with default parameters
 */
function initializeCard() {
  return {
    stability: 0,
    difficulty: 5,
    elapsedDays: 0,
    scheduledDays: 0,
    reps: 0,
    lapses: 0,
    state: "new",
    nextReviewDate: new Date(),
    lastReviewDate: null,
    retentionRate: 1.0,
  };
}

/**
 * Calculate the initial stability for a given rating (first review)
 */
function initStability(rating) {
  return Math.max(W[rating - 1], 0.1);
}

/**
 * Calculate the initial difficulty for a given rating (first review)
 */
function initDifficulty(rating) {
  return constrainDifficulty(W[4] - Math.exp(W[5] * (rating - 1)) + 1);
}

/**
 * Constrain difficulty to [1, 10] range
 */
function constrainDifficulty(d) {
  return Math.min(Math.max(d, 1), 10);
}

/**
 * Calculate new difficulty after a review
 */
function nextDifficulty(d, rating) {
  const newD = d - W[6] * (rating - 3);
  // Mean reversion
  return constrainDifficulty(W[18] * initDifficulty(4) + (1 - W[18]) * newD);
}

/**
 * Calculate the retrievability (probability of recall) at a given elapsed time
 */
function getRetrievability(stability, elapsedDays) {
  if (stability <= 0) return 0;
  return Math.pow(1 + FACTOR * elapsedDays / stability, DECAY);
}

/**
 * Calculate the next interval from stability
 */
function nextInterval(stability) {
  const interval = (stability / FACTOR) * (Math.pow(REQUEST_RETENTION, 1 / DECAY) - 1);
  return Math.max(Math.round(interval), 1);
}

/**
 * Calculate the next stability after a successful recall
 */
function nextRecallStability(d, s, r, rating) {
  const hardPenalty = (rating === 2) ? W[16] : 1;
  const easyBonus = (rating === 4) ? W[17] : 1;

  return s * (
    1 +
    Math.exp(W[8]) *
    (11 - d) *
    Math.pow(s, -W[9]) *
    (Math.exp((1 - r) * W[10]) - 1) *
    hardPenalty *
    easyBonus
  );
}

/**
 * Calculate the next stability after forgetting (lapse)
 */
function nextForgetStability(d, s, r) {
  return Math.max(
    W[11] *
    Math.pow(d, -W[12]) *
    (Math.pow(s + 1, W[13]) - 1) *
    Math.exp((1 - r) * W[14]),
    0.1
  );
}

/**
 * Main scheduling function: takes current card state and rating,
 * returns the updated card parameters and scheduled intervals for all ratings
 */
function scheduleCard(card, rating, reviewDuration = 0) {
  const now = new Date();
  let elapsedDays = 0;

  if (card.lastReviewDate) {
    elapsedDays = Math.max(
      (now.getTime() - new Date(card.lastReviewDate).getTime()) / (1000 * 60 * 60 * 24),
      0
    );
  }

  let newStability, newDifficulty, newState, newLapses, newReps;

  if (card.state === "new") {
    // First review
    newStability = initStability(rating);
    newDifficulty = initDifficulty(rating);
    newReps = 1;
    newLapses = 0;

    if (rating === 1) {
      newState = "learning";
    } else if (rating === 2) {
      newState = "learning";
    } else {
      newState = "review";
    }
  } else {
    // Subsequent reviews
    const r = getRetrievability(card.stability, elapsedDays);
    newDifficulty = nextDifficulty(card.difficulty, rating);
    newReps = card.reps + 1;

    if (rating === 1) {
      // Forgot — lapse
      newStability = nextForgetStability(newDifficulty, card.stability, r);
      newLapses = card.lapses + 1;
      newState = "relearning";
    } else {
      // Recalled successfully
      newStability = nextRecallStability(newDifficulty, card.stability, r, rating);
      newLapses = card.lapses;
      newState = "review";
    }
  }

  const scheduledDays = (newState === "learning" || newState === "relearning")
    ? (rating === 1 ? 0 : 1)  // Again=same day, Hard=next day for learning
    : nextInterval(newStability);

  const nextReviewDate = new Date(now);
  nextReviewDate.setDate(nextReviewDate.getDate() + scheduledDays);

  // Current retention estimate
  const retentionRate = getRetrievability(newStability, 0);

  return {
    stability: Math.round(newStability * 100) / 100,
    difficulty: Math.round(newDifficulty * 100) / 100,
    elapsedDays: Math.round(elapsedDays * 100) / 100,
    scheduledDays,
    reps: newReps,
    lapses: newLapses,
    state: newState,
    nextReviewDate,
    lastReviewDate: now,
    retentionRate: Math.round(retentionRate * 1000) / 1000,
    totalReviewTime: (card.totalReviewTime || 0) + reviewDuration,
  };
}

/**
 * Preview intervals for all 4 rating options without actually updating the card
 */
function getReviewIntervals(card) {
  const intervals = {};
  const labels = { 1: "again", 2: "hard", 3: "good", 4: "easy" };

  for (let rating = 1; rating <= 4; rating++) {
    const result = scheduleCard(card, rating);
    intervals[labels[rating]] = {
      days: result.scheduledDays,
      label: formatInterval(result.scheduledDays),
    };
  }

  return intervals;
}

/**
 * Format interval into a human-readable string
 */
function formatInterval(days) {
  if (days === 0) return "< 1 day";
  if (days === 1) return "1 day";
  if (days < 30) return `${days} days`;
  if (days < 365) {
    const months = Math.round(days / 30);
    return months === 1 ? "1 month" : `${months} months`;
  }
  const years = Math.round(days / 365 * 10) / 10;
  return years === 1 ? "1 year" : `${years} years`;
}

module.exports = {
  initializeCard,
  scheduleCard,
  getReviewIntervals,
  getRetrievability,
  formatInterval,
};
