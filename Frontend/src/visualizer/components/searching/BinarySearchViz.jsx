import React, { useState, useMemo } from 'react';
import { Link } from 'react-router';
import useAnimation from '../../hooks/useAnimation';
import { generateBinarySearchSteps, binarySearchCode } from '../../algorithms/searching';
import AnimationControls from '../common/AnimationControls';
import CodePanel from '../common/CodePanel';
import AskTutorButton from '../common/AskTutorButton';
import './BinarySearchViz.css';

/**
 * Binary Search Visualizer
 */
const BinarySearchViz = () => {
  const [inputArray, setInputArray] = useState([5, 12, 18, 23, 31, 45, 52, 67, 78, 89]);
  const [inputText, setInputText] = useState('5, 12, 18, 23, 31, 45, 52, 67, 78, 89');
  const [target, setTarget] = useState(45);
  const [targetText, setTargetText] = useState('45');

  // Generate animation steps
  const steps = useMemo(() => {
    return generateBinarySearchSteps(inputArray, target);
  }, [inputArray, target]);

  // Use animation hook
  const animation = useAnimation(steps, 0.8);
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

  // Generate random sorted array
  const handleRandom = () => {
    const size = Math.floor(Math.random() * 8) + 5;
    const newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10)
      .sort((a, b) => a - b);
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
    <div className="visualizer-page binary-search-page">
      {/* Header */}
      <div className="viz-header">
        <Link to="/visualizer/searching" className="back-btn">
          ← Back
        </Link>
        <div className="viz-title-section">
          <h1 className="viz-title">Binary Search</h1>
          <span className="viz-tag">O(log n) Search</span>
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
              placeholder="Enter sorted numbers..."
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
          <div className="search-visualization">
            <div className="search-target">
              Target: <span className="target-value">{currentState.target || target}</span>
            </div>
            
            <div className="array-container">
              {array.map((value, index) => {
                const isLeft = currentState.left === index;
                const isRight = currentState.right === index;
                const isMid = currentState.mid === index;
                const isFound = currentState.found && currentState.foundIndex === index;
                const isInRange = index >= (currentState.left ?? 0) && index <= (currentState.right ?? array.length - 1);
                const isOutOfRange = !isInRange && currentState.left !== undefined;
                
                return (
                  <div
                    key={index}
                    className={`search-element 
                      ${isMid ? 'mid' : ''} 
                      ${isLeft ? 'left-ptr' : ''} 
                      ${isRight ? 'right-ptr' : ''}
                      ${isFound ? 'found' : ''}
                      ${isOutOfRange ? 'out-of-range' : ''}
                      ${currentState.comparing && isMid ? 'comparing' : ''}
                    `}
                  >
                    <span className="element-value">{value}</span>
                    <span className="element-index">{index}</span>
                    {isLeft && <span className="pointer-label left-label">L</span>}
                    {isRight && <span className="pointer-label right-label">R</span>}
                    {isMid && <span className="pointer-label mid-label">M</span>}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="search-legend">
              <div className="legend-item"><span className="dot left"></span> Left Pointer</div>
              <div className="legend-item"><span className="dot right"></span> Right Pointer</div>
              <div className="legend-item"><span className="dot mid"></span> Mid Element</div>
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
          <AskTutorButton topic="Binary Search" />
          <CodePanel
            code={binarySearchCode}
            currentLine={currentState.codeLine}
            title="Binary Search"
          />
        </div>
      </div>

      {/* Algorithm Info */}
      <div className="viz-info">
        <h3>About Binary Search</h3>
        <p>
          Binary Search is an efficient algorithm that finds an element in a sorted array 
          by repeatedly dividing the search interval in half. It's much faster than linear 
          search for large datasets.
        </p>
        <div className="complexity-badges">
          <span className="badge time">Time: O(log n)</span>
          <span className="badge space">Space: O(1)</span>
          <span className="badge stable">Requires: Sorted Array</span>
        </div>
      </div>
    </div>
  );
};

export default BinarySearchViz;
