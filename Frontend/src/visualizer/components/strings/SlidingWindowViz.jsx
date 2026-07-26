import React, { useState, useMemo } from 'react';
import { Link } from 'react-router';
import useAnimation from '../../hooks/useAnimation';
import { generateSlidingWindowSteps, slidingWindowCode } from '../../algorithms/strings';
import AnimationControls from '../common/AnimationControls';
import CodePanel from '../common/CodePanel';
import StatePanel from '../common/StatePanel';
import './StringsViz.css';

/**
 * Sliding Window Visualizer
 * Find maximum sum subarray of size k
 */
const SlidingWindowViz = () => {
  const [inputArray, setInputArray] = useState([2, 1, 5, 1, 3, 2]);
  const [inputText, setInputText] = useState('2, 1, 5, 1, 3, 2');
  const [windowSize, setWindowSize] = useState(3);

  // Generate animation steps
  const steps = useMemo(() => {
    return generateSlidingWindowSteps(inputArray, windowSize);
  }, [inputArray, windowSize]);

  // Use animation hook
  const animation = useAnimation(steps, 1);
  const currentState = animation.currentState || {};

  const handleVisualize = () => {
    const newArray = inputText
      .split(',')
      .map(n => parseInt(n.trim()))
      .filter(n => !isNaN(n));
    
    if (newArray.length >= 2 && windowSize > 0 && windowSize <= newArray.length) {
      setInputArray(newArray);
      setTimeout(() => {
        animation.reset();
        animation.play();
      }, 100);
    } else {
      alert('Please enter valid array and window size');
    }
  };

  const handleRandom = () => {
    const size = Math.floor(Math.random() * 5) + 6;
    const newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 9) + 1);
    const newK = Math.min(3, Math.floor(size / 2));
    setInputArray(newArray);
    setInputText(newArray.join(', '));
    setWindowSize(newK);
    setTimeout(() => {
      animation.reset();
      animation.play();
    }, 100);
  };

  const { windowStart, windowEnd, removing, adding, windowSum, maxSum } = currentState;

  return (
    <div className="string-viz-page">
      <div className="viz-header">
        <Link to="/visualizer/strings" className="back-btn">← Back</Link>
        <div className="viz-title-section">
          <h1 className="viz-title">Sliding Window</h1>
          <span className="viz-tag">String Algorithm</span>
        </div>
      </div>

      <div className="viz-content">
        <div className="viz-main">
          <div className="input-section">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter numbers..."
              className="input-field"
            />
            <input
              type="number"
              value={windowSize}
              onChange={(e) => setWindowSize(parseInt(e.target.value) || 1)}
              min="1"
              max={inputArray.length}
              className="input-field input-small"
              placeholder="k"
            />
            <button onClick={handleVisualize} className="btn-visualize">Visualize</button>
            <button onClick={handleRandom} className="btn-random">Random</button>
          </div>

          <div className="message-display">
            <span className="message-text">{currentState.message || 'Click Visualize to start'}</span>
          </div>

          <div className="char-container">
            {(currentState.array || inputArray).map((num, idx) => {
              const isInWindow = windowStart !== null && idx >= windowStart && idx <= windowEnd;
              const isRemoving = removing === idx;
              const isAdding = adding === idx;
              
              return (
                <div
                  key={idx}
                  className={`num-box ${isInWindow ? 'window' : ''} ${isRemoving ? 'mismatch' : ''} ${isAdding ? 'match' : ''}`}
                >
                  {num}
                </div>
              );
            })}
          </div>

          <div className="index-row">
            {(currentState.array || inputArray).map((_, idx) => (
              <div key={idx} className="index-label">{idx}</div>
            ))}
          </div>

          <div className="hash-display">
            <div className="hash-item">
              <div className="hash-label">Window Sum</div>
              <div className="hash-value">{windowSum ?? '-'}</div>
            </div>
            <div className="hash-item">
              <div className="hash-label">Max Sum</div>
              <div className="hash-value match">{maxSum ?? '-'}</div>
            </div>
          </div>

          <AnimationControls
            isPlaying={animation.isPlaying}
            isComplete={animation.isComplete}
            currentStep={animation.currentStep}
            totalSteps={animation.totalSteps}
            progress={animation.progress}
            speed={animation.speed}
            onPlay={animation.play}
            onPause={animation.pause}
            onStepForward={animation.stepForward}
            onStepBack={animation.stepBack}
            onReset={animation.reset}
            onSpeedChange={animation.changeSpeed}
            onProgressChange={animation.goToStep}
          />
        </div>

        <div className="viz-sidebar">
          <CodePanel code={slidingWindowCode} currentLine={currentState.codeLine} title="Sliding Window" />
          <StatePanel state={{ windowStart, windowEnd, windowSum, maxSum, k: windowSize }} title="Variables" />
        </div>
      </div>

      <div className="viz-info">
        <h3>About Sliding Window</h3>
        <p>
          The sliding window technique is used to find subarrays or substrings with specific properties.
          Instead of recalculating the sum for each window, we slide by removing one element and adding another.
        </p>
        <div className="complexity-badges">
          <span className="badge time">Time: O(n)</span>
          <span className="badge space">Space: O(1)</span>
        </div>
      </div>
    </div>
  );
};

export default SlidingWindowViz;
