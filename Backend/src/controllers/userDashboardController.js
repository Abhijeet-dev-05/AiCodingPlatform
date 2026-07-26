const User = require('../models/user');
const Submission = require('../models/submission');
const Problem = require('../models/problem');

// Get user dashboard statistics
const getUserStats = async (req, res) => {
    try {
        const userId = req.user._id;

        // Get all submissions for this user
        const submissions = await Submission.find({ userId });

        // Get unique solved problems
        const acceptedSubmissions = submissions.filter(s => s.status === 'accepted');
        const solvedProblemIds = [...new Set(acceptedSubmissions.map(s => s.problemId?.toString()).filter(Boolean))];

        // Get problem details for solved problems
        const solvedProblems = await Problem.find({ _id: { $in: solvedProblemIds } });

        // Calculate difficulty distribution
        const difficultyCount = { easy: 0, medium: 0, hard: 0 };
        solvedProblems.forEach(p => {
            const diff = p.difficulty?.toLowerCase();
            if (difficultyCount[diff] !== undefined) {
                difficultyCount[diff]++;
            }
        });

        // Calculate acceptance rate
        const totalSubmissions = submissions.length;
        const acceptedCount = acceptedSubmissions.length;
        const acceptanceRate = totalSubmissions > 0 ? Math.round((acceptedCount / totalSubmissions) * 100) : 0;

        // Calculate streaks
        const streakData = calculateStreaks(submissions);

        // Language distribution
        const languageCount = {};
        submissions.forEach(s => {
            const lang = s.language || 'unknown';
            languageCount[lang] = (languageCount[lang] || 0) + 1;
        });

        // Tag distribution
        const tagCount = {};
        solvedProblems.forEach(p => {
            const tag = p.tags || 'other';
            tagCount[tag] = (tagCount[tag] || 0) + 1;
        });

        // Total problems count
        const totalProblems = await Problem.countDocuments();

        res.status(200).json({
            success: true,
            data: {
                totalSolved: solvedProblemIds.length,
                totalProblems,
                acceptanceRate,
                totalSubmissions,
                difficultyCount,
                languageCount,
                tagCount,
                currentStreak: streakData.currentStreak,
                longestStreak: streakData.longestStreak,
                badges: calculateBadges(solvedProblemIds.length, streakData.longestStreak, totalSubmissions)
            }
        });

    } catch (error) {
        console.error('User stats error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get contribution heatmap data (last 365 days)
const getHeatmapData = async (req, res) => {
    try {
        const userId = req.user._id;

        // Get submissions from last 365 days
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

        const submissions = await Submission.find({
            userId,
            createdAt: { $gte: oneYearAgo }
        }).select('createdAt status');

        // Group by date
        const dateMap = {};
        submissions.forEach(s => {
            const date = new Date(s.createdAt).toISOString().split('T')[0];
            if (!dateMap[date]) {
                dateMap[date] = { count: 0, accepted: 0 };
            }
            dateMap[date].count++;
            if (s.status === 'accepted') {
                dateMap[date].accepted++;
            }
        });

        // Convert to array format for heatmap
        const heatmapData = Object.entries(dateMap).map(([date, data]) => ({
            date,
            count: data.count,
            accepted: data.accepted
        }));

        res.status(200).json({
            success: true,
            data: heatmapData
        });

    } catch (error) {
        console.error('Heatmap data error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get recent submissions
const getRecentSubmissions = async (req, res) => {
    try {
        const userId = req.user._id;

        const submissions = await Submission.find({ userId })
            .sort({ createdAt: -1 })
            .limit(15)
            .populate('problemId', 'title difficulty');

        const formattedSubmissions = submissions.map(s => ({
            id: s._id,
            problemTitle: s.problemId?.title || 'Unknown Problem',
            difficulty: s.problemId?.difficulty || 'Unknown',
            status: s.status,
            language: s.language,
            runtime: s.runtime,
            memory: s.memory,
            createdAt: s.createdAt
        }));

        res.status(200).json({
            success: true,
            data: formattedSubmissions
        });

    } catch (error) {
        console.error('Recent submissions error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Helper function to calculate streaks
function calculateStreaks(submissions) {
    if (!submissions.length) return { currentStreak: 0, longestStreak: 0 };

    // Get unique dates with submissions
    const dates = [...new Set(
        submissions.map(s => new Date(s.createdAt).toISOString().split('T')[0])
    )].sort();

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;

    // Check if today or yesterday has submission for current streak
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    const hasToday = dates.includes(today);
    const hasYesterday = dates.includes(yesterday);

    // Calculate longest streak
    for (let i = 1; i < dates.length; i++) {
        const prevDate = new Date(dates[i - 1]);
        const currDate = new Date(dates[i]);
        const diffDays = (currDate - prevDate) / (1000 * 60 * 60 * 24);

        if (diffDays === 1) {
            tempStreak++;
        } else {
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 1;
        }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    // Calculate current streak
    if (hasToday || hasYesterday) {
        let checkDate = hasToday ? today : yesterday;
        currentStreak = 1;

        for (let i = dates.length - 1; i >= 0; i--) {
            if (dates[i] === checkDate) {
                const prevDateStr = new Date(new Date(checkDate).getTime() - 86400000).toISOString().split('T')[0];
                if (dates.includes(prevDateStr)) {
                    currentStreak++;
                    checkDate = prevDateStr;
                } else {
                    break;
                }
            }
        }
    }

    return { currentStreak, longestStreak };
}

// Helper function to calculate badges
function calculateBadges(solvedCount, longestStreak, totalSubmissions) {
    const badges = [];

    // Problem solving badges
    if (solvedCount >= 1) badges.push({ id: 'first_solve', name: 'First Blood', icon: '🩸', description: 'Solved first problem' });
    if (solvedCount >= 10) badges.push({ id: 'solver_10', name: 'Problem Hunter', icon: '🎯', description: 'Solved 10 problems' });
    if (solvedCount >= 25) badges.push({ id: 'solver_25', name: 'Rising Star', icon: '⭐', description: 'Solved 25 problems' });
    if (solvedCount >= 50) badges.push({ id: 'solver_50', name: 'Coding Warrior', icon: '⚔️', description: 'Solved 50 problems' });
    if (solvedCount >= 100) badges.push({ id: 'solver_100', name: 'Century Maker', icon: '💯', description: 'Solved 100 problems' });

    // Streak badges
    if (longestStreak >= 3) badges.push({ id: 'streak_3', name: 'On Fire', icon: '🔥', description: '3 day streak' });
    if (longestStreak >= 7) badges.push({ id: 'streak_7', name: 'Week Warrior', icon: '📅', description: '7 day streak' });
    if (longestStreak >= 30) badges.push({ id: 'streak_30', name: 'Dedicated', icon: '💪', description: '30 day streak' });

    // Submission badges
    if (totalSubmissions >= 50) badges.push({ id: 'submit_50', name: 'Persistent', icon: '🔄', description: '50 submissions' });
    if (totalSubmissions >= 100) badges.push({ id: 'submit_100', name: 'Never Give Up', icon: '💎', description: '100 submissions' });

    return badges;
}

// Get all solved problems for the user
const getSolvedProblems = async (req, res) => {
    try {
        const userId = req.user._id;

        // Get all accepted submissions
        const acceptedSubmissions = await Submission.find({ userId, status: 'accepted' })
            .populate('problemId', 'title difficulty tags');

        // Get unique problems (some might be solved multiple times)
        const solvedProblemsMap = new Map();
        acceptedSubmissions.forEach(sub => {
            if (sub.problemId && !solvedProblemsMap.has(sub.problemId._id.toString())) {
                solvedProblemsMap.set(sub.problemId._id.toString(), {
                    id: sub.problemId._id,
                    title: sub.problemId.title,
                    difficulty: sub.problemId.difficulty,
                    tags: sub.problemId.tags,
                    solvedAt: sub.createdAt
                });
            }
        });

        // Convert to array and sort by solved date (most recent first)
        const solvedProblems = Array.from(solvedProblemsMap.values())
            .sort((a, b) => new Date(b.solvedAt) - new Date(a.solvedAt));

        res.status(200).json({
            success: true,
            data: solvedProblems
        });

    } catch (error) {
        console.error('Solved problems error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    getUserStats,
    getHeatmapData,
    getRecentSubmissions,
    getSolvedProblems
};
