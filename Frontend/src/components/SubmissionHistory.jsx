import { useState, useEffect } from 'react';
import axiosClient from '../utils/axiosClient';
import './SubmissionHistory.css';

const SubmissionHistory = ({ problemId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get(`/problem/submittedProblem/${problemId}`);
        setSubmissions(Array.isArray(response.data) ? response.data : []);
        setError(null);
      } catch (err) {
        setError('Failed to fetch submissions');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (problemId) fetchSubmissions();
  }, [problemId]);

  const formatMemory = (memory) => {
    if (!memory) return '-';
    if (memory < 1024) return `${memory} KB`;
    return `${(memory / 1024).toFixed(2)} MB`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="sh-loading">
        <div className="sh-spinner"></div>
      </div>
    );
  }

  if (error) {
    return <div className="sh-error">{error}</div>;
  }

  return (
    <div className="sh-container">
      <div className="sh-header">
        <h3>My Submissions</h3>
      </div>

      <h2 className="sh-title">Submission History</h2>

      {submissions.length === 0 ? (
        <div className="sh-empty">
          <p>No submissions yet</p>
        </div>
      ) : (
        <>
          <div className="sh-table-wrapper">
            <table className="sh-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Language</th>
                  <th>Status</th>
                  <th>Runtime</th>
                  <th>Memory</th>
                  <th>Test Cases</th>
                  <th>Submitted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub, index) => (
                  <tr key={sub._id || index}>
                    <td>{index + 1}</td>
                    <td className="lang-cell">{sub.language}</td>
                    <td>
                      <span className={`status-pill ${sub.status === 'accepted' ? 'accepted' : 'rejected'}`}>
                        {sub.status === 'accepted' ? 'Accepted' : sub.status}
                      </span>
                    </td>
                    <td className="mono">{sub.runtime || '0.00'}sec</td>
                    <td className="mono">{formatMemory(sub.memory)}</td>
                    <td className="mono">{sub.testCasesPassed || 0}/{sub.testCasesTotal || 0}</td>
                    <td className="date-cell">{formatDate(sub.createdAt)}</td>
                    <td>
                      <button 
                        className="code-btn"
                        onClick={() => setSelectedSubmission(sub)}
                      >
                        Code
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="sh-count">Showing {submissions.length} submission{submissions.length !== 1 ? 's' : ''}</p>
        </>
      )}

      {/* Code Modal */}
      {selectedSubmission && (
        <div className="sh-modal-overlay" onClick={() => setSelectedSubmission(null)}>
          <div className="sh-modal" onClick={(e) => e.stopPropagation()}>
            <div className="sh-modal-header">
              <h4>Submission Details: {selectedSubmission.language}</h4>
              <button className="sh-modal-close" onClick={() => setSelectedSubmission(null)}>×</button>
            </div>
            
            <div className="sh-modal-badges">
              <span className={`status-pill ${selectedSubmission.status === 'accepted' ? 'accepted' : 'rejected'}`}>
                {selectedSubmission.status}
              </span>
              <span className="info-pill">Runtime: {selectedSubmission.runtime}s</span>
              <span className="info-pill">Memory: {formatMemory(selectedSubmission.memory)}</span>
              <span className="info-pill">Passed: {selectedSubmission.testCasesPassed}/{selectedSubmission.testCasesTotal}</span>
            </div>

            <div className="sh-modal-code">
              <pre><code>{selectedSubmission.code}</code></pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionHistory;