import { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import axiosClient from '../utils/axiosClient';
import '../pages/Admin.css';

const AdminDelete = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get('/problem/getAllProblems');
      setProblems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to fetch problems');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this problem?')) return;

    try {
      await axiosClient.delete(`/problem/delete/${id}`);
      setProblems(problems.filter(problem => problem._id !== id));
    } catch (err) {
      setError('Failed to delete problem');
      console.error(err);
    }
  };

  const getDifficultyClass = (difficulty) => {
    const d = difficulty?.toLowerCase();
    if (d === 'easy') return 'badge-easy';
    if (d === 'medium') return 'badge-medium';
    return 'badge-hard';
  };

  if (loading) {
    return (
      <div className="admin-table-page">
        <div className="admin-loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-table-page">
      <div className="admin-table-container">
        <NavLink to="/admin" className="admin-back-btn">← Back to Admin</NavLink>

        <div className="admin-table-header">
          <h1>🗑️ Delete Problems</h1>
        </div>

        {error && <div className="admin-error">{error}</div>}

        {problems.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty-icon">📭</div>
            <p>No problems found</p>
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Difficulty</th>
                  <th>Tag</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {problems.map((problem, index) => (
                  <tr key={problem._id}>
                    <td>{index + 1}</td>
                    <td>{problem.title}</td>
                    <td>
                      <span className={getDifficultyClass(problem.difficulty)}>
                        {problem.difficulty}
                      </span>
                    </td>
                    <td>
                      <span className="badge-tag">{problem.tags}</span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(problem._id)}
                        className="btn-action delete"
                      >
                        Delete
                      </button>
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

export default AdminDelete;