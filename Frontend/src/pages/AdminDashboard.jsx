import { useState, useEffect } from 'react';
import { NavLink } from 'react-router';
import axiosClient from '../utils/axiosClient';
import './AdminDashboard.css';

function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [overview, setOverview] = useState(null);
  const [problemStats, setProblemStats] = useState(null);
  const [submissionStats, setSubmissionStats] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState(null);

  useEffect(() => {
    fetchAllStats();
  }, []);

  const fetchAllStats = async () => {
    try {
      setLoading(true);
      const [overviewRes, problemRes, submissionRes, userRes, activityRes] = await Promise.all([
        axiosClient.get('/admin/stats/overview'),
        axiosClient.get('/admin/stats/problems'),
        axiosClient.get('/admin/stats/submissions'),
        axiosClient.get('/admin/stats/users'),
        axiosClient.get('/admin/stats/recent-activity')
      ]);

      setOverview(overviewRes.data.data);
      setProblemStats(problemRes.data.data);
      setSubmissionStats(submissionRes.data.data);
      setUserStats(userRes.data.data);
      setRecentActivity(activityRes.data.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Animated counter component
  const AnimatedCounter = ({ value, duration = 1000 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      let startTime;
      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        setCount(Math.floor(progress * value));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, [value, duration]);

    return <span>{count.toLocaleString()}</span>;
  };

  // Donut chart component
  const DonutChart = ({ data, colors, size = 120 }) => {
    const entries = Object.entries(data).filter(([_, value]) => value > 0);
    const total = entries.reduce((a, [_, b]) => a + b, 0);
    
    if (total === 0) return <div className="empty-chart">No data</div>;

    const radius = size / 2 - 10;
    const cx = size / 2;
    const cy = size / 2;

    // If only one segment with 100%, draw a full circle
    if (entries.length === 1) {
      const [key] = entries[0];
      const colorIndex = Object.keys(data).indexOf(key);
      return (
        <svg width={size} height={size} className="donut-chart">
          <circle 
            cx={cx} 
            cy={cy} 
            r={radius} 
            fill={colors[colorIndex % colors.length]}
            className="donut-segment"
          />
          <circle cx={cx} cy={cy} r={size / 4} fill="var(--bg-secondary)" />
        </svg>
      );
    }

    let cumulativePercent = 0;
    const segments = entries.map(([key, value]) => {
      const colorIndex = Object.keys(data).indexOf(key);
      const percent = (value / total) * 100;
      
      // Skip segments with 0%
      if (percent === 0) return null;
      
      const startAngle = cumulativePercent * 3.6;
      cumulativePercent += percent;
      const endAngle = cumulativePercent * 3.6;

      // Handle near-100% case
      const actualEndAngle = percent >= 99.9 ? 359.9 : endAngle;

      const startRad = (startAngle - 90) * (Math.PI / 180);
      const endRad = (actualEndAngle - 90) * (Math.PI / 180);

      const x1 = cx + radius * Math.cos(startRad);
      const y1 = cy + radius * Math.sin(startRad);
      const x2 = cx + radius * Math.cos(endRad);
      const y2 = cy + radius * Math.sin(endRad);

      const largeArc = percent > 50 ? 1 : 0;

      return (
        <path
          key={key}
          d={`M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`}
          fill={colors[colorIndex % colors.length]}
          className="donut-segment"
        />
      );
    }).filter(Boolean);

    return (
      <svg width={size} height={size} className="donut-chart">
        {segments}
        <circle cx={cx} cy={cy} r={size / 4} fill="var(--bg-secondary)" />
      </svg>
    );
  };

  // Bar chart component
  const BarChart = ({ data, maxValue }) => {
    const max = maxValue || Math.max(...data.map(d => d.count), 1);
    return (
      <div className="bar-chart">
        {data.slice(0, 6).map((item, index) => (
          <div key={index} className="bar-item">
            <div className="bar-label">{item.tag || item.date}</div>
            <div className="bar-wrapper">
              <div
                className="bar-fill"
                style={{ width: `${(item.count / max) * 100}%` }}
              />
            </div>
            <div className="bar-value">{item.count}</div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="admin-dashboard-page">
        <div className="dashboard-loading">
          <div className="loading-spinner" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard-page">
        <div className="dashboard-error">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
          <button onClick={fetchAllStats} className="retry-btn">Retry</button>
        </div>
      </div>
    );
  }

  const difficultyColors = ['#22c55e', '#f59e0b', '#ef4444'];
  const statusColors = ['#6b7280', '#22c55e', '#ef4444', '#f59e0b'];
  const languageColors = ['#3b82f6', '#f59e0b', '#22c55e'];

  return (
    <div className="admin-dashboard-page">
      {/* Sticky Header – matches AI Interview design */}
      <header className="dashboard-header">
        <div className="header-inner">
          <NavLink to="/admin" className="dashboard-back-link">← Back to Admin</NavLink>
          <div className="header-content">
            <h1 className="dashboard-title">
              <span className="title-icon">📊</span>
              Platform Analytics
            </h1>
            <p className="dashboard-subtitle">Real-time insights into your CodeArena platform</p>
          </div>
          <button onClick={fetchAllStats} className="refresh-btn">
            🔄 Refresh
          </button>
        </div>
      </header>

      <div className="dashboard-container">

        {/* Overview Stats */}
        <section className="stats-section">
          <h2 className="section-title">Overview</h2>
          <div className="stats-grid">
            <div className="stat-card users">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <div className="stat-value">
                  <AnimatedCounter value={overview?.totalUsers || 0} />
                </div>
                <div className="stat-label">Total Users</div>
                <div className="stat-sub">+{overview?.newUsersThisWeek || 0} this week</div>
              </div>
            </div>

            <div className="stat-card problems">
              <div className="stat-icon">📝</div>
              <div className="stat-content">
                <div className="stat-value">
                  <AnimatedCounter value={overview?.totalProblems || 0} />
                </div>
                <div className="stat-label">Total Problems</div>
              </div>
            </div>

            <div className="stat-card submissions">
              <div className="stat-icon">🚀</div>
              <div className="stat-content">
                <div className="stat-value">
                  <AnimatedCounter value={overview?.totalSubmissions || 0} />
                </div>
                <div className="stat-label">Total Submissions</div>
                <div className="stat-sub">{overview?.submissionsToday || 0} today</div>
              </div>
            </div>

            <div className="stat-card acceptance">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <div className="stat-value">
                  <AnimatedCounter value={overview?.acceptanceRate || 0} />%
                </div>
                <div className="stat-label">Acceptance Rate</div>
              </div>
            </div>
          </div>
        </section>

        {/* Charts Row */}
        <div className="charts-row">
          {/* Problem Distribution */}
          <section className="chart-card">
            <h3 className="chart-title">Problem Distribution</h3>
            <p className="chart-subtitle">By difficulty level</p>
            <div className="chart-content">
              <DonutChart data={problemStats?.byDifficulty || {}} colors={difficultyColors} />
              <div className="chart-legend">
                <div className="legend-item">
                  <span className="legend-dot easy" />
                  Easy: {problemStats?.byDifficulty?.easy || 0}
                </div>
                <div className="legend-item">
                  <span className="legend-dot medium" />
                  Medium: {problemStats?.byDifficulty?.medium || 0}
                </div>
                <div className="legend-item">
                  <span className="legend-dot hard" />
                  Hard: {problemStats?.byDifficulty?.hard || 0}
                </div>
              </div>
            </div>
          </section>

          {/* Submission Status */}
          <section className="chart-card">
            <h3 className="chart-title">Submission Status</h3>
            <p className="chart-subtitle">All-time breakdown</p>
            <div className="chart-content">
              <DonutChart data={submissionStats?.byStatus || {}} colors={statusColors} />
              <div className="chart-legend">
                <div className="legend-item">
                  <span className="legend-dot pending" />
                  Pending: {submissionStats?.byStatus?.pending || 0}
                </div>
                <div className="legend-item">
                  <span className="legend-dot accepted" />
                  Accepted: {submissionStats?.byStatus?.accepted || 0}
                </div>
                <div className="legend-item">
                  <span className="legend-dot wrong" />
                  Wrong: {submissionStats?.byStatus?.wrong || 0}
                </div>
                <div className="legend-item">
                  <span className="legend-dot error" />
                  Error: {submissionStats?.byStatus?.error || 0}
                </div>
              </div>
            </div>
          </section>

          {/* Language Distribution */}
          <section className="chart-card">
            <h3 className="chart-title">Languages Used</h3>
            <p className="chart-subtitle">Submission languages</p>
            <div className="chart-content">
              <DonutChart data={submissionStats?.byLanguage || {}} colors={languageColors} />
              <div className="chart-legend">
                {Object.entries(submissionStats?.byLanguage || {}).map(([lang, count], i) => (
                  <div key={lang} className="legend-item">
                    <span className="legend-dot" style={{ background: languageColors[i % languageColors.length] }} />
                    {lang}: {count}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Tags & Daily Submissions */}
        <div className="charts-row">
          <section className="chart-card wide">
            <h3 className="chart-title">Top Problem Tags</h3>
            <p className="chart-subtitle">Most common categories</p>
            <BarChart data={problemStats?.byTags || []} />
          </section>

          <section className="chart-card wide">
            <h3 className="chart-title">Daily Submissions</h3>
            <p className="chart-subtitle">Last 7 days</p>
            <BarChart data={submissionStats?.dailySubmissions || []} />
          </section>
        </div>

        {/* Leaderboard & Activity */}
        <div className="tables-row">
          {/* Top Performers */}
          <section className="table-card">
            <h3 className="table-title">🏆 Top Performers</h3>
            <div className="leaderboard">
              {(userStats?.topPerformers || []).map((user, index) => (
                <div key={user._id} className={`leaderboard-item rank-${index + 1}`}>
                  <div className="rank">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                  </div>
                  <div className="user-info">
                    <div className="user-name">{user.firstName} {user.lastName || ''}</div>
                    <div className="user-email">{user.emailId}</div>
                  </div>
                  <div className="solved-count">{user.problemsSolved} solved</div>
                </div>
              ))}
              {(!userStats?.topPerformers || userStats.topPerformers.length === 0) && (
                <div className="empty-state">No data available</div>
              )}
            </div>
          </section>

          {/* Recent Activity */}
          <section className="table-card">
            <h3 className="table-title">⚡ Recent Submissions</h3>
            <div className="activity-feed">
              {(recentActivity?.recentSubmissions || []).slice(0, 8).map((sub) => (
                <div key={sub._id} className="activity-item">
                  <div className={`status-badge ${sub.status}`}>
                    {sub.status === 'accepted' ? '✓' : sub.status === 'wrong' ? '✗' : '○'}
                  </div>
                  <div className="activity-content">
                    <div className="activity-user">{sub.user}</div>
                    <div className="activity-problem">{sub.problem}</div>
                  </div>
                  <div className="activity-meta">
                    <span className={`difficulty-badge ${sub.difficulty}`}>{sub.difficulty}</span>
                    <span className="language-tag">{sub.language}</span>
                  </div>
                </div>
              ))}
              {(!recentActivity?.recentSubmissions || recentActivity.recentSubmissions.length === 0) && (
                <div className="empty-state">No recent submissions</div>
              )}
            </div>
          </section>
        </div>

        {/* Most Solved Problems */}
        <section className="full-width-card">
          <h3 className="table-title">🔥 Most Solved Problems</h3>
          <div className="problems-grid">
            {(problemStats?.mostSolved || []).map((problem, index) => (
              <div key={problem._id} className="problem-card">
                <div className="problem-rank">#{index + 1}</div>
                <div className="problem-info">
                  <div className="problem-title">{problem.title}</div>
                  <span className={`difficulty-badge ${problem.difficulty}`}>{problem.difficulty}</span>
                </div>
                <div className="solve-count">{problem.solveCount} solves</div>
              </div>
            ))}
            {(!problemStats?.mostSolved || problemStats.mostSolved.length === 0) && (
              <div className="empty-state">No solved problems yet</div>
            )}
          </div>
        </section>

        {/* Recent Users */}
        <section className="full-width-card">
          <h3 className="table-title">👋 Recent Users</h3>
          <div className="users-grid">
            {(recentActivity?.recentUsers || []).map((user) => (
              <div key={user._id} className="user-card">
                <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
                <div className="user-details">
                  <div className="user-name">{user.name}</div>
                  <div className="user-email">{user.email}</div>
                  <div className="user-joined">
                    Joined {new Date(user.joinedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
            {(!recentActivity?.recentUsers || recentActivity.recentUsers.length === 0) && (
              <div className="empty-state">No recent users</div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminDashboard;
