import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, Clock, Flame, Brain, Calendar, ChevronRight } from 'lucide-react';
import axiosClient from '../utils/axiosClient';
import './SpacedRepetition.css';

const SpacedRepetition = () => {
  const [stats, setStats] = useState(null);
  const [dailyData, setDailyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showProblem, setShowProblem] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  // Timer effect when a problem is shown
  useEffect(() => {
    let interval;
    if (showProblem && currentCard && !submitting) {
      if (!startTime) setStartTime(Date.now());
      
      interval = setInterval(() => {
        setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showProblem, submitting, startTime]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, dailyRes] = await Promise.all([
        axiosClient.get('/review/stats'),
        axiosClient.get('/review/daily')
      ]);
      setStats(statsRes.data.data);
      setDailyData(dailyRes.data.data);
    } catch (err) {
      console.error('Error fetching review data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReveal = () => {
    setShowProblem(true);
    setStartTime(Date.now());
    setTimeSpent(0);
  };

  const handleRate = async (rating) => {
    if (!currentCard || submitting) return;
    
    setSubmitting(true);
    try {
      await axiosClient.post(`/review/submit/${currentCard._id}`, {
        rating,
        timeSpent
      });
      
      // Move to next card
      setShowProblem(false);
      setStartTime(null);
      setTimeSpent(0);
      
      // If we finished the queue
      if (currentCardIndex >= dailyData.queue.length - 1) {
        // Refresh data to see if any relearning cards popped up
        await fetchData();
        setCurrentCardIndex(0);
      } else {
        setCurrentCardIndex(prev => prev + 1);
      }
    } catch (err) {
      console.error('Error submitting rating:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (loading) {
    return (
      <div className="sr-page sr-loading-container">
        <div className="sr-loading-spinner" />
        <p>Loading your review queue...</p>
      </div>
    );
  }

  const queue = dailyData?.queue || [];
  const currentCard = queue[currentCardIndex];
  const isComplete = queue.length === 0;

  return (
    <div className="sr-page">
      {/* Header */}
      <header className="sr-header">
        <div className="sr-header-left">
          <Link to="/" className="sr-back-btn">
            <ArrowLeft size={18} />
          </Link>
          <div className="sr-title-container">
            <h1>Spaced Repetition</h1>
            <span className="sr-subtitle">Optimize your long-term memory</span>
          </div>
        </div>
        
        {stats && (
          <div className="sr-header-stats">
            <div className="sr-stat-badge">
              <Flame size={16} color="#f59e0b" />
              <span>{stats.reviewStreak} Day Streak</span>
            </div>
            <div className="sr-stat-badge">
              <Brain size={16} color="#8b5cf6" />
              <span>{stats.avgRetention}% Retention</span>
            </div>
            <div className="sr-stat-badge">
              <Calendar size={16} color="#3b82f6" />
              <span>{stats.dueToday} Due Today</span>
            </div>
          </div>
        )}
      </header>

      <div className="sr-content">
        {/* Main Review Area */}
        <div className="sr-main-area">
          {isComplete ? (
            <div className="sr-complete-state">
              <div className="sr-complete-icon">🎉</div>
              <h2>All Caught Up!</h2>
              <p>You've completed all your reviews for today. Your memory is getting stronger!</p>
              
              <div className="sr-stats-summary">
                <div className="sr-summary-box">
                  <span className="sr-summary-value">{stats?.totalReviews || 0}</span>
                  <span className="sr-summary-label">Total Reviews</span>
                </div>
                <div className="sr-summary-box">
                  <span className="sr-summary-value">{stats?.learningCards || 0}</span>
                  <span className="sr-summary-label">Learning</span>
                </div>
                <div className="sr-summary-box">
                  <span className="sr-summary-value">{stats?.reviewCards || 0}</span>
                  <span className="sr-summary-label">Graduated</span>
                </div>
              </div>
              
              <Link to="/" className="sr-primary-btn">Practice New Problems</Link>
            </div>
          ) : (
            <div className="sr-review-card">
              <div className="sr-card-header">
                <div className="sr-progress">
                  Card {currentCardIndex + 1} of {queue.length}
                </div>
                <div className={`sr-state-badge sr-state-${currentCard.state}`}>
                  {currentCard.state.charAt(0).toUpperCase() + currentCard.state.slice(1)}
                </div>
              </div>

              <div className="sr-problem-info">
                <h2 className="sr-problem-title">{currentCard.problemId.title}</h2>
                <div className="sr-problem-meta">
                  <span className={`difficulty-badge ${currentCard.problemId.difficulty.toLowerCase()}`}>
                    {currentCard.problemId.difficulty}
                  </span>
                  <span className="tag-badge">{currentCard.problemId.tags}</span>
                </div>
              </div>

              {!showProblem ? (
                <div className="sr-reveal-area">
                  <button className="sr-reveal-btn" onClick={handleReveal}>
                    Show Problem Description
                  </button>
                  <p className="sr-reveal-hint">Try to recall the approach before revealing</p>
                </div>
              ) : (
                <div className="sr-problem-details slide-down">
                  <div className="sr-description">
                    {currentCard.problemId.description}
                  </div>
                  
                  {currentCard.problemId.visibleTestCases?.[0] && (
                    <div className="sr-example">
                      <strong>Example:</strong>
                      <div className="sr-example-box">
                        <div><strong>Input:</strong> {currentCard.problemId.visibleTestCases[0].input}</div>
                        <div><strong>Output:</strong> {currentCard.problemId.visibleTestCases[0].output}</div>
                      </div>
                    </div>
                  )}

                  <div className="sr-actions-area">
                    <div className="sr-timer-container">
                      <Clock size={16} />
                      <span>{formatTime(timeSpent)}</span>
                    </div>

                    <Link 
                      to={`/problem/${currentCard.problemId._id}`} 
                      target="_blank" 
                      className="sr-solve-link"
                    >
                      Solve in Editor <ChevronRight size={16} />
                    </Link>

                    <h3 className="sr-rating-title">How well did you remember this?</h3>
                    <div className="sr-rating-buttons">
                      <button 
                        className="sr-rate-btn sr-rate-again" 
                        onClick={() => handleRate(1)}
                        disabled={submitting}
                      >
                        <span className="sr-rate-label">Again</span>
                        <span className="sr-rate-interval">{currentCard.intervals.again.label}</span>
                      </button>
                      <button 
                        className="sr-rate-btn sr-rate-hard" 
                        onClick={() => handleRate(2)}
                        disabled={submitting}
                      >
                        <span className="sr-rate-label">Hard</span>
                        <span className="sr-rate-interval">{currentCard.intervals.hard.label}</span>
                      </button>
                      <button 
                        className="sr-rate-btn sr-rate-good" 
                        onClick={() => handleRate(3)}
                        disabled={submitting}
                      >
                        <span className="sr-rate-label">Good</span>
                        <span className="sr-rate-interval">{currentCard.intervals.good.label}</span>
                      </button>
                      <button 
                        className="sr-rate-btn sr-rate-easy" 
                        onClick={() => handleRate(4)}
                        disabled={submitting}
                      >
                        <span className="sr-rate-label">Easy</span>
                        <span className="sr-rate-interval">{currentCard.intervals.easy.label}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="sr-sidebar">
          <div className="sr-widget">
            <h3>How it works</h3>
            <p className="sr-help-text">
              We use the <strong>FSRS</strong> algorithm to predict when you are likely to forget a problem and schedule it for review just before that happens.
            </p>
            <ul className="sr-help-list">
              <li><span style={{color: '#ef4444'}}>Again:</span> Forgot completely</li>
              <li><span style={{color: '#f59e0b'}}>Hard:</span> Remembered with major effort</li>
              <li><span style={{color: '#22c55e'}}>Good:</span> Remembered with some effort</li>
              <li><span style={{color: '#3b82f6'}}>Easy:</span> Remembered instantly</li>
            </ul>
          </div>
          
          <div className="sr-widget">
            <h3>Queue Overview</h3>
            <div className="sr-queue-stats">
              <div className="sr-queue-row">
                <div className="sr-queue-dot new"></div>
                <span>New</span>
                <span className="sr-queue-val">{stats?.newCards || 0}</span>
              </div>
              <div className="sr-queue-row">
                <div className="sr-queue-dot learning"></div>
                <span>Learning</span>
                <span className="sr-queue-val">{stats?.learningCards || 0}</span>
              </div>
              <div className="sr-queue-row">
                <div className="sr-queue-dot review"></div>
                <span>To Review</span>
                <span className="sr-queue-val">{stats?.reviewCards || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpacedRepetition;
