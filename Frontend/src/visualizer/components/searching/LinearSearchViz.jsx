import React, { useState, useMemo } from 'react';
import { Link } from 'react-router';
import useAnimation from '../../hooks/useAnimation';
import { generateLinearSearchSteps, linearSearchCode } from '../../algorithms/searching';
import AnimationControls from '../common/AnimationControls';
import CodePanel from '../common/CodePanel';
import AskTutorButton from '../common/AskTutorButton';
import './LinearSearchViz.css';

/**
 * Linear Search Visualizer
 */
const LinearSearchViz = () => {
  const [inputArray, setInputArray] = useState([34, 12, 78, 45, 23, 56, 89, 67, 11, 90]);
  const [inputText, setInputText] = useState('34, 12, 78, 45, 23, 56, 89, 67, 11, 90');
  const [target, setTarget] = useState(56);
  const [targetText, setTargetText] = useState('56');

  // Generate animation steps
  const steps = useMemo(() => {
    return generateLinearSearchSteps(inputArray, target);
  }, [inputArray, target]);

  // Use animation hook
  const animation = useAnimation(steps, 0.6);
  const currentState = animation.currentState || {};

  // Handle input change
  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleTargetChange = (e) => {
    setTargetText(e.target.value);
  };

  // Handle visualize button
  const handleVisualize = () => {
    const newArray = inputText
      .split(',')
      .map(n => parseInt(n.trim()))
      .filter(n => !isNaN(n) && n > 0 && n <= 999);
    
    const newTarget = parseInt(targetText.trim());
    
    if (newArray.length >= 2 && newArray.length <= 20 && !isNaN(newTarget)) {
      setInputArray(newArray);
      setTarget(newTarget);
      setTimeout(() => {
        animation.reset();
        animation.play();
      }, 100);
    } else {
      alert('Please enter 2-20 numbers and a valid target');
    }
  };

  // Generate random array
  const handleRandom = () => {
    const size = Math.floor(Math.random() * 8) + 5;
    const newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
    const newTarget = newArray[Math.floor(Math.random() * newArray.length)];
    
    setInputArray(newArray);
    setInputText(newArray.join(', '));
    setTarget(newTarget);
    setTargetText(String(newTarget));
    
    setTimeout(() => {
      animation.reset();
      animation.play();
    }, 100);
  };

  const array = currentState.array || inputArray;

  return (
    <div className="visualizer-page linear-search-page">
      {/* Header */}
      <div className="viz-header">
        <Link to="/visualizer/searching" className="back-btn">
          ← Back
        </Link>
        <div className="viz-title-section">
          <h1 className="viz-title">Linear Search</h1>
          <span className="viz-tag">O(n) Search</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="viz-content">
        {/* Left: Visualization */}
        <div className="viz-main">
          {/* Input Section */}
          <div className="input-section">
            <input
              type="text"
              value={inputText}
              onChange={handleInputChange}
              placeholder="Enter numbers..."
              className="input-field"
            />
            <input
              type="number"
              value={targetText}
              onChange={handleTargetChange}
              placeholder="Target"
              className="input-field target-input"
            />
            <button onClick={handleVisualize} className="btn-visualize">
              Search
            </button>
            <button onClick={handleRandom} className="btn-random">
              Random
            </button>
          </div>

          {/* Array Visualization */}
          <div className="linear-visualization">
            <div className="search-target">
              Looking for: <span className="target-value">{currentState.target || target}</span>
            </div>
            
            <div className="linear-array-container">
              {array.map((value, index) => {
                const isCurrent = currentState.currentIndex === index;
                const isFound = currentState.found && currentState.foundIndex === index;
                const isChecked = currentState.currentIndex !== null && index < currentState.currentIndex;
                
                return (
                  <div
                    key={index}
                    className={`linear-element 
                      ${isCurrent ? 'current' : ''} 
                      ${isFound ? 'found' : ''}
                      ${isChecked ? 'checked' : ''}
                      ${currentState.comparing && isCurrent ? 'comparing' : ''}
                    `}
                  >
                    <span className="element-value">{value}</span>
                    <span className="element-index">{index}</span>
                    {isCurrent && !isFound && (
                      <div className="scan-pointer">▲</div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Progress Bar */}
            <div className="scan-progress">
              <div 
                className="scan-progress-bar"
                style={{ 
                  width: `${((currentState.currentIndex ?? -1) + 1) / array.length * 100}%` 
                }}
              ></div>
            </div>

            {/* Legend */}
            <div className="linear-legend">
              <div className="legend-item"><span className="dot current"></span> Current Element</div>
              <div className="legend-item"><span className="dot checked"></span> Already Checked</div>
              <div className="legend-item"><span className="dot found"></span> Found!</div>
            </div>
          </div>

          {/* Message */}
          <div className="step-message">
            {currentState.message || 'Click Search to start'}
          </div>

          {/* Controls */}
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

        {/* Right: Code & State */}
        <div className="viz-sidebar">
          <AskTutorButton topic="Linear Search" />
          <CodePanel
            code={linearSearchCode}
            currentLine={currentState.codeLine}
            title="Linear Search"
          />
        </div>
      </div>

      {/* Algorithm Info */}
      <div className="viz-info">
        <h3>About Linear Search</h3>
        <p>
          Linear Search is the simplest searching algorithm. It sequentially checks each 
          element until a match is found or all elements have been checked. Works on 
          both sorted and unsorted arrays.
        </p>
        <div className="complexity-badges">
          <span className="badge time">Time: O(n)</span>
          <span className="badge space">Space: O(1)</span>
          <span className="badge stable">Works on: Any Array</span>
        </div>
      </div>
    </div>
  );
};

export default LinearSearchViz;
