import { useState, useEffect } from 'react';
import axiosClient from '../utils/axiosClient';
import './CodeReview.css';

const CodeReview = ({ problemId, code, language, latestSubmissionId }) => {
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedOpt, setExpandedOpt] = useState(null);

  // Try to load existing review for this submission
  useEffect(() => {
    if (latestSubmissionId) {
      fetchExistingReview();
    }
  }, [latestSubmissionId]);

  const fetchExistingReview = async () => {
    try {
      const { data } = await axiosClient.get(`/code-review/submission/${latestSubmissionId}`);
      if (data.success) {
        setReview(data.data);
      }
    } catch {
      // No existing review — that's fine
    }
  };

  const handleReviewCode = async () => {
    if (!latestSubmissionId) {
      setError('Please submit your code first before requesting a review.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data } = await axiosClient.post(`/code-review/review/${latestSubmissionId}`);
      if (data.success) {
        setReview(data.data);
      } else {
        setError(data.message || 'Failed to generate review');
      }
    } catch (err) {
      if (err.response?.status === 429) {
        setError('Rate limit exceeded. Please wait a moment and try again.');
      } else {
        setError(err.response?.data?.message || 'Failed to generate review. Try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#f59e0b';
    if (score >= 40) return '#f97316';
    return '#ef4444';
  };

  const getScoreLabel = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Good';
    if (score >= 60) return 'Fair';
    if (score >= 40) return 'Needs Work';
    return 'Poor';
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical': return '🔴';
      case 'warning': return '🟡';
      default: return '🔵';
    }
  };

  const getImpactBadge = (impact) => {
    switch (impact) {
      case 'high': return { text: 'High Impact', class: 'impact-high' };
      case 'medium': return { text: 'Medium Impact', class: 'impact-medium' };
      default: return { text: 'Low Impact', class: 'impact-low' };
    }
  };

  const getComplexityColor = (complexity) => {
    if (!complexity) return '#8b8b9a';
    const c = complexity.toLowerCase();
    if (c.includes('log') && !c.includes('n²') && !c.includes('n^2')) return '#22c55e';
    if (c.includes('n)') || c.includes('n log')) return '#22c55e';
    if (c.includes('n²') || c.includes('n^2')) return '#f59e0b';
    if (c.includes('2^n') || c.includes('n!')) return '#ef4444';
    return '#3b82f6';
  };

  // Score Ring component
  const ScoreRing = ({ score, label, size = 90 }) => {
    const radius = (size - 10) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    const color = getScoreColor(score);

    return (
      <div className="cr-score-ring-wrapper">
        <svg width={size} height={size} className="cr-score-ring-svg">
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5"
          />
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke={color} strokeWidth="5"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="cr-score-ring-progress"
          />
        </svg>
        <div className="cr-score-ring-value" style={{ color }}>
          {score}
        </div>
        <div className="cr-score-ring-label">{label}</div>
      </div>
    );
  };

  if (!review && !loading) {
    return (
      <div className="cr-container">
        <div className="cr-empty-state">
          <div className="cr-empty-icon">🔍</div>
          <h3 className="cr-empty-title">AI Code Review</h3>
          <p className="cr-empty-text">
            Get detailed analysis of your code quality, complexity, and optimization opportunities powered by AI.
          </p>
          <button
            className="cr-review-btn"
            onClick={handleReviewCode}
            disabled={loading || !latestSubmissionId}
          >
            {!latestSubmissionId ? '📝 Submit Code First' : '🔍 Review My Code'}
          </button>
          {error && <div className="cr-error">{error}</div>}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="cr-container">
        <div className="cr-loading-state">
          <div className="cr-loading-spinner">
            <div className="cr-spinner-ring"></div>
            <div className="cr-spinner-ring"></div>
            <div className="cr-spinner-ring"></div>
          </div>
          <h3 className="cr-loading-title">Analyzing Your Code...</h3>
          <p className="cr-loading-text">Our AI is reviewing complexity, patterns, and optimizations</p>
          <div className="cr-loading-steps">
            <div className="cr-step active">📊 Complexity Analysis</div>
            <div className="cr-step">🔎 Code Smells Detection</div>
            <div className="cr-step">⚡ Optimization Suggestions</div>
            <div className="cr-step">📈 Quality Scoring</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cr-container">
      {/* Header */}
      <div className="cr-header">
        <div className="cr-header-left">
          <h3 className="cr-title">🔍 AI Code Review</h3>
          <span className="cr-badge">{review.language}</span>
        </div>
        <button className="cr-refresh-btn" onClick={handleReviewCode} title="Re-analyze">
          ↻ Re-analyze
        </button>
      </div>

      {/* Overall Score */}
      <div className="cr-scores-section">
        <div className="cr-overall-score">
          <ScoreRing score={review.scores.overall} label="Overall" size={110} />
          <div className="cr-overall-label" style={{ color: getScoreColor(review.scores.overall) }}>
            {getScoreLabel(review.scores.overall)}
          </div>
        </div>
        <div className="cr-sub-scores">
          <ScoreRing score={review.scores.readability} label="Readability" size={80} />
          <ScoreRing score={review.scores.efficiency} label="Efficiency" size={80} />
          <ScoreRing score={review.scores.bestPractices} label="Best Practices" size={80} />
        </div>
      </div>

      {/* Complexity */}
      <div className="cr-section">
        <h4 className="cr-section-title">⏱️ Complexity Analysis</h4>
        <div className="cr-complexity-badges">
          <div className="cr-complexity-badge">
            <span className="cr-complexity-label">Time</span>
            <span
              className="cr-complexity-value"
              style={{ color: getComplexityColor(review.complexityAnalysis.timeComplexity) }}
            >
              {review.complexityAnalysis.timeComplexity}
            </span>
          </div>
          <div className="cr-complexity-badge">
            <span className="cr-complexity-label">Space</span>
            <span
              className="cr-complexity-value"
              style={{ color: getComplexityColor(review.complexityAnalysis.spaceComplexity) }}
            >
              {review.complexityAnalysis.spaceComplexity}
            </span>
          </div>
        </div>
        {review.complexityAnalysis.explanation && (
          <p className="cr-complexity-explanation">{review.complexityAnalysis.explanation}</p>
        )}
      </div>

      {/* Comparison with Optimal */}
      {review.comparisonWithOptimal?.gap && (
        <div className={`cr-section cr-comparison ${review.comparisonWithOptimal.isOptimal ? 'optimal' : 'suboptimal'}`}>
          <h4 className="cr-section-title">
            {review.comparisonWithOptimal.isOptimal ? '🏆 Optimal Solution!' : '📊 vs Optimal Solution'}
          </h4>
          {!review.comparisonWithOptimal.isOptimal && (
            <div className="cr-comparison-gap">
              <span className="cr-gap-label">Gap:</span>
              <span className="cr-gap-value">{review.comparisonWithOptimal.gap}</span>
            </div>
          )}
          {review.comparisonWithOptimal.explanation && (
            <p className="cr-comparison-explanation">{review.comparisonWithOptimal.explanation}</p>
          )}
        </div>
      )}

      {/* Code Smells */}
      {review.codeSmells?.length > 0 && (
        <div className="cr-section">
          <h4 className="cr-section-title">🔎 Code Smells ({review.codeSmells.length})</h4>
          <div className="cr-smells-list">
            {review.codeSmells.map((smell, idx) => (
              <div key={idx} className={`cr-smell-card cr-severity-${smell.severity}`}>
                <div className="cr-smell-header">
                  <span className="cr-smell-icon">{getSeverityIcon(smell.severity)}</span>
                  <span className="cr-smell-type">{smell.type.replace(/-/g, ' ')}</span>
                  <span className={`cr-severity-badge ${smell.severity}`}>{smell.severity}</span>
                  {smell.line > 0 && <span className="cr-smell-line">Line {smell.line}</span>}
                </div>
                <p className="cr-smell-desc">{smell.description}</p>
                {smell.suggestion && (
                  <div className="cr-smell-suggestion">
                    <span className="cr-suggestion-label">💡 Fix:</span>
                    <span>{smell.suggestion}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Optimizations */}
      {review.optimizations?.length > 0 && (
        <div className="cr-section">
          <h4 className="cr-section-title">⚡ Optimizations ({review.optimizations.length})</h4>
          <div className="cr-optimizations-list">
            {review.optimizations.map((opt, idx) => {
              const impact = getImpactBadge(opt.impact);
              return (
                <div key={idx} className="cr-opt-card">
                  <div
                    className="cr-opt-header"
                    onClick={() => setExpandedOpt(expandedOpt === idx ? null : idx)}
                  >
                    <div className="cr-opt-title-row">
                      <span className="cr-opt-icon">💡</span>
                      <span className="cr-opt-title">{opt.title}</span>
                      <span className={`cr-impact-badge ${impact.class}`}>{impact.text}</span>
                    </div>
                    <span className={`cr-opt-arrow ${expandedOpt === idx ? 'expanded' : ''}`}>▸</span>
                  </div>
                  <p className="cr-opt-desc">{opt.description}</p>
                  {expandedOpt === idx && opt.suggestedCode && (
                    <div className="cr-opt-code">
                      <pre><code>{opt.suggestedCode}</code></pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {error && <div className="cr-error">{error}</div>}
    </div>
  );
};

export default CodeReview;
