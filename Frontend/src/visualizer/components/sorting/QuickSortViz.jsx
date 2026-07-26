import React, { useState, useMemo } from 'react';
import { Link } from 'react-router';
import useAnimation from '../../hooks/useAnimation';
import { generateQuickSortSteps, quickSortCode } from '../../algorithms/sorting';
import ArrayBars from './ArrayBars';
import AnimationControls from '../common/AnimationControls';
import CodePanel from '../common/CodePanel';
import StatePanel from '../common/StatePanel';
import AskTutorButton from '../common/AskTutorButton';
import './BubbleSortViz.css'; // Reuse same styles

/**
 * Quick Sort Visualizer
 */
const QuickSortViz = () => {
  const [inputArray, setInputArray] = useState([64, 34, 25, 12, 22, 11, 90]);
  const [inputText, setInputText] = useState('64, 34, 25, 12, 22, 11, 90');

  // Generate animation steps
  const steps = useMemo(() => {
    return generateQuickSortSteps(inputArray);
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
    const size = Math.floor(Math.random() * 6) + 5;
    const newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
    setInputArray(newArray);
    setInputText(newArray.join(', '));
    setTimeout(() => {
      animation.reset();
      animation.play();
    }, 100);
  };

  return (
    <div className="visualizer-page">
      {/* Header */}
      <div className="viz-header">
        <Link to="/visualizer/sorting" className="back-btn">
          ← Back
        </Link>
        <div className="viz-title-section">
          <h1 className="viz-title">Quick Sort</h1>
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
            pivot={currentState.pivot}
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
          <AskTutorButton topic="Quick Sort" />
          <CodePanel
            code={quickSortCode}
            currentLine={currentState.codeLine}
            title="Quick Sort"
          />
          <StatePanel
            state={currentState}
            title="Current State"
          />
        </div>
      </div>

      {/* Algorithm Info */}
      <div className="viz-info">
        <h3>About Quick Sort</h3>
        <p>
          Quick Sort picks a pivot element and partitions the array around it.
          Elements smaller than pivot go left, larger go right. Then recursively
          sorts the sub-arrays. It's one of the fastest sorting algorithms.
        </p>
        <div className="complexity-badges">
          <span className="badge time">Time: O(n log n)</span>
          <span className="badge space">Space: O(log n)</span>
          <span className="badge stable">Stable: No</span>
        </div>
      </div>
    </div>
  );
};

export default QuickSortViz;
