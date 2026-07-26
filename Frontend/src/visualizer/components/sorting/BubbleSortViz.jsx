import React, { useState, useMemo } from 'react';
import { Link } from 'react-router';
import useAnimation from '../../hooks/useAnimation';
import { generateBubbleSortSteps, bubbleSortCode } from '../../algorithms/sorting';
import ArrayBars from './ArrayBars';
import AnimationControls from '../common/AnimationControls';
import CodePanel from '../common/CodePanel';
import StatePanel from '../common/StatePanel';
import AskTutorButton from '../common/AskTutorButton';
import './BubbleSortViz.css';

/**
 * Bubble Sort Visualizer
 * Complete interactive visualization with controls, code, and state
 */
const BubbleSortViz = () => {
  const [inputArray, setInputArray] = useState([64, 34, 25, 12, 22, 11, 90]);
  const [inputText, setInputText] = useState('64, 34, 25, 12, 22, 11, 90');

  // Generate animation steps
  const steps = useMemo(() => {
    return generateBubbleSortSteps(inputArray);
  }, [inputArray]);

  // Use animation hook
  const animation = useAnimation(steps, 1);
  const currentState = animation.currentState || {};

  // Handle input change
  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  // Handle visualize button - reset and auto-play
  const handleVisualize = () => {
    const newArray = inputText
      .split(',')
      .map(n => parseInt(n.trim()))
      .filter(n => !isNaN(n) && n > 0 && n <= 100);
    
    if (newArray.length >= 2 && newArray.length <= 15) {
      setInputArray(newArray);
      // Auto-play after a short delay to let the steps regenerate
      setTimeout(() => {
        animation.reset();
        animation.play();
      }, 100);
    } else {
      alert('Please enter 2-15 numbers between 1-100, separated by commas');
    }
  };

  // Generate random array and auto-play
  const handleRandom = () => {
    const size = Math.floor(Math.random() * 6) + 5; // 5-10 elements
    const newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
    setInputArray(newArray);
    setInputText(newArray.join(', '));
    // Auto-play after a short delay
    setTimeout(() => {
      animation.reset();
      animation.play();
    }, 100);
  };

  return (
    <div className="visualizer-page">
      {/* Header */}
      <div className="viz-header">
        <Link to="/visualizer" className="back-btn">
          ← Back
        </Link>
        <div className="viz-title-section">
          <h1 className="viz-title">Bubble Sort</h1>
          <span className="viz-tag">Sorting Algorithm</span>
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
              placeholder="Enter numbers separated by commas..."
              className="input-field"
            />
            <button onClick={handleVisualize} className="btn-visualize">
              Visualize
            </button>
            <button onClick={handleRandom} className="btn-random">
              Random
            </button>
          </div>

          {/* Array Visualization */}
          <ArrayBars
            array={currentState.array || inputArray}
            comparing={currentState.comparing || []}
            swapped={currentState.swapped || []}
            sorted={currentState.sorted || []}
          />

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
          <AskTutorButton topic="Bubble Sort" />
          <CodePanel
            code={bubbleSortCode}
            currentLine={currentState.codeLine}
            title="Bubble Sort"
          />
          <StatePanel
            state={currentState}
            title="Current State"
          />
        </div>
      </div>

      {/* Algorithm Info */}
      <div className="viz-info">
        <h3>About Bubble Sort</h3>
        <p>
          Bubble Sort repeatedly steps through the list, compares adjacent elements, 
          and swaps them if they are in the wrong order. The pass through the list is 
          repeated until the list is sorted.
        </p>
        <div className="complexity-badges">
          <span className="badge time">Time: O(n²)</span>
          <span className="badge space">Space: O(1)</span>
          <span className="badge stable">Stable: Yes</span>
        </div>
      </div>
    </div>
  );
};

export default BubbleSortViz;
