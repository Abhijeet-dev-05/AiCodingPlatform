import React, { useState, useMemo } from 'react';
import { Link } from 'react-router';
import useAnimation from '../../hooks/useAnimation';
import { generateZAlgorithmSteps, zAlgorithmCode } from '../../algorithms/strings';
import AnimationControls from '../common/AnimationControls';
import CodePanel from '../common/CodePanel';
import StatePanel from '../common/StatePanel';
import './StringsViz.css';

/**
 * Z Algorithm Visualizer
 * Compute Z-array for pattern matching
 */
const ZAlgorithmViz = () => {
  const [inputStr, setInputStr] = useState('aabxaab');

  // Generate animation steps
  const steps = useMemo(() => {
    return generateZAlgorithmSteps(inputStr);
  }, [inputStr]);

  // Use animation hook
  const animation = useAnimation(steps, 1);
  const currentState = animation.currentState || {};

  const handleVisualize = () => {
    if (inputStr.length >= 2) {
      animation.reset();
      setTimeout(() => animation.play(), 100);
    }
  };

  const handleRandom = () => {
    const examples = ['aabxaab', 'aaaa', 'abcabc', 'aabcaabxaaaz', 'ababab'];
    const newStr = examples[Math.floor(Math.random() * examples.length)];
    setInputStr(newStr);
    setTimeout(() => {
      animation.reset();
      animation.play();
    }, 100);
  };

  const { str, z, left, right, i, zBox, extending, comparing } = currentState;
  const displayStr = str || inputStr.split('');
  const displayZ = z || new Array(inputStr.length).fill(0);

  return (
    <div className="string-viz-page">
      <div className="viz-header">
        <Link to="/visualizer/strings" className="back-btn">← Back</Link>
        <div className="viz-title-section">
          <h1 className="viz-title">Z Algorithm</h1>
          <span className="viz-tag">String Algorithm</span>
        </div>
      </div>

      <div className="viz-content">
        <div className="viz-main">
          <div className="input-section">
            <input
              type="text"
              value={inputStr}
              onChange={(e) => setInputStr(e.target.value)}
              placeholder="Enter string..."
              className="input-field"
            />
            <button onClick={handleVisualize} className="btn-visualize">Visualize</button>
            <button onClick={handleRandom} className="btn-random">Random</button>
          </div>

          <div className="message-display">
            <span className="message-text">{currentState.message || 'Click Visualize to compute Z-array'}</span>
          </div>

          {/* String Display */}
          <div className="pattern-label">String:</div>
          <div className="char-container">
            {displayStr.map((char, idx) => {
              const isCurrentI = i === idx;
              const isInZBox = zBox && idx >= zBox.left && idx <= zBox.right;
              const isLeft = left === idx;
              const isRight = right === idx;
              
              return (
                <div
                  key={idx}
                  className={`char-box 
                    ${isCurrentI ? 'comparing highlight' : ''} 
                    ${isInZBox ? 'window' : ''} 
                    ${isLeft ? 'left-pointer' : ''} 
                    ${isRight ? 'right-pointer' : ''}
                    ${extending && isCurrentI ? 'match' : ''}`}
                >
                  {char}
                </div>
              );
            })}
          </div>

          <div className="index-row">
            {displayStr.map((_, idx) => (
              <div key={idx} className="index-label">{idx}</div>
            ))}
          </div>

          {/* Z-Array Display */}
          <div className="pattern-section">
            <div className="pattern-label">Z-Array (z[i] = length of longest substring starting from i that is also a prefix):</div>
            <div className="value-row">
              {displayZ.map((val, idx) => (
                <div 
                  key={idx} 
                  className="value-box"
                  style={{ 
                    background: i === idx ? 'rgba(255, 107, 157, 0.3)' : undefined,
                    borderColor: i === idx ? '#ff6b9d' : undefined
                  }}
                >
                  {val}
                </div>
              ))}
            </div>
          </div>

          <div className="hash-display">
            <div className="hash-item">
              <div className="hash-label">Current i</div>
              <div className="hash-value">{i ?? '-'}</div>
            </div>
            <div className="hash-item">
              <div className="hash-label">Z-Box Left</div>
              <div className="hash-value">{left ?? '-'}</div>
            </div>
            <div className="hash-item">
              <div className="hash-label">Z-Box Right</div>
              <div className="hash-value">{right ?? '-'}</div>
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
          <CodePanel code={zAlgorithmCode} currentLine={currentState.codeLine} title="Z Algorithm" />
          <StatePanel state={{ i, left, right, z: displayZ.join(',') }} title="Variables" />
        </div>
      </div>

      <div className="viz-info">
        <h3>About Z Algorithm</h3>
        <p>
          The Z algorithm computes an array where z[i] represents the length of the longest substring
          starting at position i that matches a prefix of the string. It uses a "Z-box" to avoid
          redundant comparisons.
        </p>
        <div className="complexity-badges">
          <span className="badge time">Time: O(n)</span>
          <span className="badge space">Space: O(n)</span>
        </div>
      </div>
    </div>
  );
};

export default ZAlgorithmViz;
