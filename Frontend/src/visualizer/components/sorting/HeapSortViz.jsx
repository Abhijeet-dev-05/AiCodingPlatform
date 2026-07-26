import React, { useState, useMemo } from 'react';
import { Link } from 'react-router';
import useAnimation from '../../hooks/useAnimation';
import { generateHeapSortSteps, heapSortCode } from '../../algorithms/sorting';
import ArrayBars from './ArrayBars';
import AnimationControls from '../common/AnimationControls';
import CodePanel from '../common/CodePanel';
import StatePanel from '../common/StatePanel';
import AskTutorButton from '../common/AskTutorButton';
import './BubbleSortViz.css';

/**
 * Heap Sort Visualizer
 */
const HeapSortViz = () => {
  const [inputArray, setInputArray] = useState([64, 34, 25, 12, 22, 11, 90]);
  const [inputText, setInputText] = useState('64, 34, 25, 12, 22, 11, 90');

  const steps = useMemo(() => generateHeapSortSteps(inputArray), [inputArray]);
  const animation = useAnimation(steps, 0.8);
  const currentState = animation.currentState || {};

  const handleInputChange = (e) => setInputText(e.target.value);

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

  const handleRandom = () => {
    const size = Math.floor(Math.random() * 5) + 5;
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
      <div className="viz-header">
        <Link to="/visualizer/sorting" className="back-btn">← Back</Link>
        <div className="viz-title-section">
          <h1 className="viz-title">Heap Sort</h1>
          <span className="viz-tag">Heap-based Sorting</span>
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

          <ArrayBars
            array={currentState.array || inputArray}
            comparing={currentState.comparing || []}
            swapped={currentState.swapped || []}
            sorted={currentState.sorted || []}
          />

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
          <AskTutorButton topic="Heap Sort" />
          <CodePanel code={heapSortCode} currentLine={currentState.codeLine} title="Heap Sort" />
          <StatePanel state={currentState} title="Current State" />
        </div>
      </div>

      <div className="viz-info">
        <h3>About Heap Sort</h3>
        <p>
          Heap Sort builds a max heap from the array, then repeatedly extracts the maximum
          element and places it at the end. It uses the heap data structure for efficient
          sorting with O(n log n) time complexity.
        </p>
        <div className="complexity-badges">
          <span className="badge time">Time: O(n log n)</span>
          <span className="badge space">Space: O(1)</span>
          <span className="badge stable">Stable: No</span>
        </div>
      </div>
    </div>
  );
};

export default HeapSortViz;
