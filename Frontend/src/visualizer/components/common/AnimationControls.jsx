import React from 'react';
import './AnimationControls.css';

/**
 * Animation Controls Component
 * Play/Pause, Step Forward/Back, Speed Control, Reset
 */
const AnimationControls = ({
  isPlaying,
  isComplete,
  currentStep,
  totalSteps,
  progress,
  speed,
  onPlay,
  onPause,
  onStepForward,
  onStepBack,
  onReset,
  onSpeedChange,
  onProgressChange
}) => {
  return (
    <div className="animation-controls">
      {/* Main Controls */}
      <div className="controls-row">
        <button 
          className="control-btn" 
          onClick={onStepBack}
          disabled={currentStep === 0}
          title="Previous Step"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
          </svg>
        </button>

        <button 
          className="control-btn play-btn" 
          onClick={isPlaying ? onPause : onPlay}
          disabled={isComplete}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>

        <button 
          className="control-btn" 
          onClick={onStepForward}
          disabled={isComplete}
          title="Next Step"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
          </svg>
        </button>

        <button 
          className="control-btn reset-btn" 
          onClick={onReset}
          title="Reset"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
          </svg>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="progress-section">
        <span className="step-counter">
          Step {currentStep + 1} / {totalSteps}
        </span>
        <input
          type="range"
          className="progress-slider"
          min="0"
          max={totalSteps - 1}
          value={currentStep}
          onChange={(e) => onProgressChange && onProgressChange(parseInt(e.target.value))}
        />
      </div>

      {/* Speed Control */}
      <div className="speed-section">
        <span className="speed-label">Speed: {speed}x</span>
        <div className="speed-buttons">
          {[0.5, 1, 1.5, 2, 3].map((s) => (
            <button
              key={s}
              className={`speed-btn ${speed === s ? 'active' : ''}`}
              onClick={() => onSpeedChange(s)}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnimationControls;
