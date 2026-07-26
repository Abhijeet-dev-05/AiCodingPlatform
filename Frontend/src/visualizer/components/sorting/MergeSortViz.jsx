import React, { useState, useMemo } from 'react';
import { Link } from 'react-router';
import useAnimation from '../../hooks/useAnimation';
import { generateMergeSortSteps, mergeSortCode } from '../../algorithms/sorting';
import AnimationControls from '../common/AnimationControls';
import CodePanel from '../common/CodePanel';
import StatePanel from '../common/StatePanel';
import AskTutorButton from '../common/AskTutorButton';
import './BubbleSortViz.css';
import './MergeSortViz.css';

/**
 * Merge Sort Visualizer
 * Shows divide and conquer with sub-array highlighting
 */
const MergeSortViz = () => {
  const [inputArray, setInputArray] = useState([64, 34, 25, 12, 22, 11, 90]);
  const [inputText, setInputText] = useState('64, 34, 25, 12, 22, 11, 90');

  const steps = useMemo(() => generateMergeSortSteps(inputArray), [inputArray]);
  const animation = useAnimation(steps, 0.8);
  const currentState = animation.currentState || {};

  const handleInputChange = (e) => setInputText(e.target.value);

  const handleVisualize = () => {
    const newArray = inputText
      .split(',')
      .map(n => parseInt(n.trim()))
      .filter(n => !isNaN(n) && n > 0 && n <= 100);
    
    if (newArray.length >= 2 && newArray.length <= 12) {
      setInputArray(newArray);
      setTimeout(() => {
        animation.reset();
        animation.play();
      }, 100);
    } else {
      alert('Please enter 2-12 numbers between 1-100, separated by commas');
    }
  };

  const handleRandom = () => {
    const size = Math.floor(Math.random() * 4) + 5; // 5-8 elements
    const newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
    setInputArray(newArray);
    setInputText(newArray.join(', '));
    setTimeout(() => {
      animation.reset();
      animation.play();
    }, 100);
  };

  // Get bar color based on state
  const getBarColor = (index) => {
    if (currentState.sorted?.includes(index)) return 'sorted';
    if (currentState.merged) {
      const { start, end } = currentState.merged;
      if (index >= start && index <= end) return 'merged';
    }
    if (currentState.dividing) {
      const { left, mid, right } = currentState.dividing;
      if (index >= left && index <= mid) return 'left-part';
      if (index > mid && index <= right) return 'right-part';
    }
    if (currentState.ranges) {
      for (const range of currentState.ranges) {
        if (index >= range.start && index <= range.end) {
          return range.type === 'left' ? 'left-part' : 'right-part';
        }
      }
    }
    return 'default';
  };

  const array = currentState.array || inputArray;
  const max = Math.max(...array, 1);

  return (
    <div className="visualizer-page">
      <div className="viz-header">
        <Link to="/visualizer/sorting" className="back-btn">← Back</Link>
        <div className="viz-title-section">
          <h1 className="viz-title">Merge Sort</h1>
          <span className="viz-tag">Divide & Conquer</span>
        </div>
      </div>

      <div className="viz-content">
        <div className="viz-main">
          <div className="input-section">
            <input
              type="text"
              value={inputText}
              onChange={handleInputChange}
              placeholder="Enter numbers separated by commas..."
              className="input-field"
            />
            <button onClick={handleVisualize} className="btn-visualize">Visualize</button>
            <button onClick={handleRandom} className="btn-random">Random</button>
          </div>

          {/* Custom Merge Sort Visualization */}
          <div className="merge-sort-canvas">
            <div className="merge-bars">
              {array.map((value, index) => (
                <div
                  key={index}
                  className="merge-bar-wrapper"
                  style={{ width: `${100 / array.length}%` }}
                >
                  <div
                    className={`merge-bar ${getBarColor(index)}`}
                    style={{ height: `${(value / max) * 100}%` }}
                  >
                    <span className="bar-value">{value}</span>
                  </div>
                  <span className="bar-index">{index}</span>
                </div>
              ))}
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
          <AskTutorButton topic="Merge Sort" />
          <CodePanel code={mergeSortCode} currentLine={currentState.codeLine} title="Merge Sort" />
          <StatePanel state={currentState} title="Current State" />
        </div>
      </div>

      <div className="viz-info">
        <h3>About Merge Sort</h3>
        <p>
          Merge Sort is a divide-and-conquer algorithm. It divides the array into halves,
          recursively sorts them, and merges the sorted halves. It's stable and guarantees
          O(n log n) time complexity.
        </p>
        <div className="complexity-badges">
          <span className="badge time">Time: O(n log n)</span>
          <span className="badge space">Space: O(n)</span>
          <span className="badge stable">Stable: Yes</span>
        </div>
      </div>
    </div>
  );
};

export default MergeSortViz;
