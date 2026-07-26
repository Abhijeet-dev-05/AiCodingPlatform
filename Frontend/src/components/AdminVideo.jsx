import { useEffect, useState } from 'react';
import { NavLink, Link } from 'react-router';
import axiosClient from '../utils/axiosClient';
import { Video, Film, Clock, CheckCircle, XCircle, Upload, Trash2, TrendingUp } from 'lucide-react';
import './AdminVideo.css';

const AdminVideo = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [videoStats, setVideoStats] = useState(null);
  const [problemsWithVideos, setProblemsWithVideos] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch problems and video stats in parallel
      const [problemsRes, statsRes] = await Promise.all([
        axiosClient.get('/problem/getAllProblems'),
        axiosClient.get('/video/stats').catch(() => ({ data: null }))
      ]);

      setProblems(Array.isArray(problemsRes.data) ? problemsRes.data : []);

      if (statsRes.data) {
        setVideoStats(statsRes.data.stats);
        setProblemsWithVideos(statsRes.data.problemIdsWithVideos || []);
      }
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete the video for "${title}"?`)) return;

    setDeleteLoading(id);
    setError(null);
    try {
      await axiosClient.delete(`/video/delete/${id}`);
      alert('Video deleted successfully!');
      // Refresh data after deletion to update stats in real-time
      fetchData();
    } catch (err) {
      if (err.response?.status === 404) {
        alert('No video found for this problem!');
      } else {
        setError(err.response?.data?.error || 'Failed to delete video');
      }
      console.error(err);
    } finally {
      setDeleteLoading(null);
    }
  };

  const getDifficultyClass = (difficulty) => {
    const d = difficulty?.toLowerCase();
    if (d === 'easy') return 'easy';
    if (d === 'medium') return 'medium';
    return 'hard';
  };

  const formatTotalDuration = (seconds) => {
    if (!seconds) return '0 min';
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins} min`;
  };

  const hasVideo = (problemId) => {
    return problemsWithVideos.includes(problemId);
  };

  if (loading) {
    return (
      <div className="admin-video-page">
        <div className="admin-video-loading">
          <div className="admin-video-spinner"></div>
          <p>Loading video dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-video-page">
      <div className="admin-video-container">
        {/* Header */}
        <div className="admin-video-header">
          <NavLink to="/admin" className="admin-video-back-btn">
            ← Back to Admin
          </NavLink>
          <div className="admin-video-title">
            <span>🎬</span>
            <h1>Video Editorial Dashboard</h1>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="video-stats-grid">
          <div className="video-stat-card">
            <div className="stat-icon-wrapper purple">
              <Video size={24} />
            </div>
            <div className="stat-content">
              <h3>{videoStats?.totalVideos || 0}</h3>
              <p>Total Videos</p>
            </div>
          </div>

          <div className="video-stat-card">
            <div className="stat-icon-wrapper blue">
              <Film size={24} />
            </div>
            <div className="stat-content">
              <h3>{videoStats?.totalProblems || problems.length}</h3>
              <p>Total Problems</p>
            </div>
          </div>

          <div className="video-stat-card">
            <div className="stat-icon-wrapper green">
              <CheckCircle size={24} />
            </div>
            <div className="stat-content">
              <h3>{videoStats?.problemsWithVideos || 0}</h3>
              <p>With Videos</p>
            </div>
          </div>

          <div className="video-stat-card">
            <div className="stat-icon-wrapper orange">
              <XCircle size={24} />
            </div>
            <div className="stat-content">
              <h3>{videoStats?.problemsWithoutVideos || problems.length}</h3>
              <p>Need Videos</p>
            </div>
          </div>

          <div className="video-stat-card">
            <div className="stat-icon-wrapper cyan">
              <Clock size={24} />
            </div>
            <div className="stat-content">
              <h3>{formatTotalDuration(videoStats?.totalDuration)}</h3>
              <p>Total Duration</p>
            </div>
          </div>

          <div className="video-stat-card coverage-card">
            <div className="stat-icon-wrapper teal">
              <TrendingUp size={24} />
            </div>
            <div className="stat-content">
              <h3>{videoStats?.coveragePercentage || 0}%</h3>
              <p>Coverage</p>
            </div>
            <div className="coverage-bar">
              <div
                className="coverage-fill"
                style={{ width: `${videoStats?.coveragePercentage || 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        {error && (
          <div className="admin-video-error">
            <XCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Problems Table */}
        {problems.length === 0 ? (
          <div className="admin-video-empty">
            <div className="admin-video-empty-icon">📭</div>
            <h3>No Problems Found</h3>
            <p>Add some problems first to upload video editorials</p>
          </div>
        ) : (
          <div className="admin-video-table-container">
            <div className="table-header-bar">
              <h2>📋 Problem Video Status</h2>
              <span className="table-count">{problems.length} problems</span>
            </div>
            <table className="admin-video-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Problem Title</th>
                  <th>Difficulty</th>
                  <th>Tag</th>
                  <th>Video Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {problems.map((problem, index) => (
                  <tr key={problem._id} className={hasVideo(problem._id) ? 'has-video' : ''}>
                    <td className="row-number">{index + 1}</td>
                    <td className="problem-title-cell">
                      <span className="problem-name">{problem.title}</span>
                    </td>
                    <td>
                      <span className={`difficulty-badge ${getDifficultyClass(problem.difficulty)}`}>
                        {problem.difficulty}
                      </span>
                    </td>
                    <td>
                      <span className="tag-badge">{problem.tags}</span>
                    </td>
                    <td>
                      {hasVideo(problem._id) ? (
                        <div className="video-status uploaded">
                          <CheckCircle size={16} />
                          <span>Uploaded</span>
                        </div>
                      ) : (
                        <div className="video-status pending">
                          <XCircle size={16} />
                          <span>Not Available</span>
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <Link
                          to={`/admin/upload/${problem._id}`}
                          className="action-btn upload-btn"
                          title="Upload Video"
                        >
                          <Upload size={16} />
                          <span>Upload</span>
                        </Link>
                        {hasVideo(problem._id) && (
                          <button
                            onClick={() => handleDelete(problem._id, problem.title)}
                            className="action-btn delete-btn"
                            disabled={deleteLoading === problem._id}
                            title="Delete Video"
                          >
                            <Trash2 size={16} />
                            <span>{deleteLoading === problem._id ? '...' : 'Delete'}</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminVideo;
