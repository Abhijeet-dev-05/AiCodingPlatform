const User = require('../models/user');
const Problem = require('../models/problem');
const Submission = require('../models/submission');

// Get overview stats
const getOverviewStats = async (req, res) => {
    try {
        const [totalUsers, totalProblems, totalSubmissions, acceptedSubmissions] = await Promise.all([
            User.countDocuments(),
            Problem.countDocuments(),
            Submission.countDocuments(),
            Submission.countDocuments({ status: 'accepted' })
        ]);

        // Get today's submissions
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const submissionsToday = await Submission.countDocuments({
            createdAt: { $gte: today }
        });

        // Get new users this week
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const newUsersThisWeek = await User.countDocuments({
            createdAt: { $gte: weekAgo }
        });

        const acceptanceRate = totalSubmissions > 0
            ? Math.round((acceptedSubmissions / totalSubmissions) * 100)
            : 0;

        res.json({
            success: true,
            data: {
                totalUsers,
                totalProblems,
                totalSubmissions,
                submissionsToday,
                acceptanceRate,
                newUsersThisWeek
            }
        });
    } catch (error) {
        console.error('Error fetching overview stats:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch stats' });
    }
};

// Get problem analytics
const getProblemStats = async (req, res) => {
    try {
        // Problems by difficulty
        const difficultyStats = await Problem.aggregate([
            { $group: { _id: '$difficulty', count: { $sum: 1 } } }
        ]);

        // Problems by tags (top 10)
        const tagStats = await Problem.aggregate([
            { $group: { _id: '$tags', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        // Most solved problems
        const mostSolved = await User.aggregate([
            { $unwind: '$problemSolved' },
            { $group: { _id: '$problemSolved', solveCount: { $sum: 1 } } },
            { $sort: { solveCount: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'problems',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'problem'
                }
            },
            { $unwind: '$problem' },
            {
                $project: {
                    _id: 1,
                    solveCount: 1,
                    title: '$problem.title',
                    difficulty: '$problem.difficulty'
                }
            }
        ]);

        // Format difficulty stats
        const difficultyMap = { easy: 0, medium: 0, hard: 0 };
        difficultyStats.forEach(item => {
            if (item._id) difficultyMap[item._id] = item.count;
        });

        res.json({
            success: true,
            data: {
                byDifficulty: difficultyMap,
                byTags: tagStats.map(t => ({ tag: t._id, count: t.count })),
                mostSolved
            }
        });
    } catch (error) {
        console.error('Error fetching problem stats:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch problem stats' });
    }
};

// Get submission analytics
const getSubmissionStats = async (req, res) => {
    try {
        // Submissions by status
        const statusStats = await Submission.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        // Submissions by language
        const languageStats = await Submission.aggregate([
            { $group: { _id: '$language', count: { $sum: 1 } } }
        ]);

        // Submissions over last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const dailySubmissions = await Submission.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Average runtime for accepted submissions
        const runtimeStats = await Submission.aggregate([
            { $match: { status: 'accepted', runtime: { $gt: 0 } } },
            { $group: { _id: null, avgRuntime: { $avg: '$runtime' } } }
        ]);

        const avgRuntime = runtimeStats.length > 0
            ? Math.round(runtimeStats[0].avgRuntime)
            : 0;

        // Format status stats
        const statusMap = { pending: 0, accepted: 0, wrong: 0, error: 0 };
        statusStats.forEach(item => {
            if (item._id) statusMap[item._id] = item.count;
        });

        // Format language stats
        const languageMap = {};
        languageStats.forEach(item => {
            if (item._id) languageMap[item._id] = item.count;
        });

        res.json({
            success: true,
            data: {
                byStatus: statusMap,
                byLanguage: languageMap,
                dailySubmissions: dailySubmissions.map(d => ({
                    date: d._id,
                    count: d.count
                })),
                avgRuntime
            }
        });
    } catch (error) {
        console.error('Error fetching submission stats:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch submission stats' });
    }
};

// Get user analytics
const getUserStats = async (req, res) => {
    try {
        // Top performers (by problems solved)
        const topPerformers = await User.aggregate([
            { $match: { role: 'user' } },
            {
                $project: {
                    firstName: 1,
                    lastName: 1,
                    emailId: 1,
                    problemsSolved: { $size: { $ifNull: ['$problemSolved', []] } }
                }
            },
            { $sort: { problemsSolved: -1 } },
            { $limit: 10 }
        ]);

        // Active users (submitted in last 7 days)
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);

        const activeUsers = await Submission.aggregate([
            { $match: { createdAt: { $gte: weekAgo } } },
            { $group: { _id: '$userId' } },
            { $count: 'activeCount' }
        ]);

        // User registrations over last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        thirtyDaysAgo.setHours(0, 0, 0, 0);

        const userGrowth = await User.aggregate([
            { $match: { createdAt: { $gte: thirtyDaysAgo } } },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Users by role
        const roleStats = await User.aggregate([
            { $group: { _id: '$role', count: { $sum: 1 } } }
        ]);

        const roleMap = { user: 0, admin: 0 };
        roleStats.forEach(item => {
            if (item._id) roleMap[item._id] = item.count;
        });

        res.json({
            success: true,
            data: {
                topPerformers,
                activeUsersCount: activeUsers.length > 0 ? activeUsers[0].activeCount : 0,
                userGrowth: userGrowth.map(d => ({ date: d._id, count: d.count })),
                byRole: roleMap
            }
        });
    } catch (error) {
        console.error('Error fetching user stats:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch user stats' });
    }
};

// Get recent activity
const getRecentActivity = async (req, res) => {
    try {
        // Recent submissions (last 10) using aggregation to avoid populate issues
        const recentSubmissions = await Submission.aggregate([
            { $sort: { createdAt: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userInfo'
                }
            },
            {
                $lookup: {
                    from: 'problems',
                    localField: 'problemId',
                    foreignField: '_id',
                    as: 'problemInfo'
                }
            },
            {
                $project: {
                    _id: 1,
                    status: 1,
                    language: 1,
                    createdAt: 1,
                    user: {
                        $concat: [
                            { $ifNull: [{ $arrayElemAt: ['$userInfo.firstName', 0] }, 'Unknown'] },
                            ' ',
                            { $ifNull: [{ $arrayElemAt: ['$userInfo.lastName', 0] }, ''] }
                        ]
                    },
                    problem: { $ifNull: [{ $arrayElemAt: ['$problemInfo.title', 0] }, 'Unknown'] },
                    difficulty: { $ifNull: [{ $arrayElemAt: ['$problemInfo.difficulty', 0] }, 'unknown'] }
                }
            }
        ]);

        // Recent users (last 5)
        const recentUsers = await User.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('firstName lastName emailId createdAt')
            .lean();

        // Recent problems (last 5)
        const recentProblems = await Problem.find()
            .sort({ _id: -1 })
            .limit(5)
            .select('title difficulty tags')
            .lean();

        res.json({
            success: true,
            data: {
                recentSubmissions: recentSubmissions.map(s => ({
                    _id: s._id,
                    user: s.user?.trim() || 'Unknown',
                    problem: s.problem,
                    difficulty: s.difficulty,
                    status: s.status,
                    language: s.language,
                    createdAt: s.createdAt
                })),
                recentUsers: recentUsers.map(u => ({
                    _id: u._id,
                    name: `${u.firstName} ${u.lastName || ''}`.trim(),
                    email: u.emailId,
                    joinedAt: u.createdAt
                })),
                recentProblems
            }
        });
    } catch (error) {
        console.error('Error fetching recent activity:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch recent activity' });
    }
};

module.exports = {
    getOverviewStats,
    getProblemStats,
    getSubmissionStats,
    getUserStats,
    getRecentActivity
};
