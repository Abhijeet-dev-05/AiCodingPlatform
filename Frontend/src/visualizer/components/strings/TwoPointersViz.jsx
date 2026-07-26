import React, { useState, useMemo } from 'react';
import { Link } from 'react-router';
import useAnimation from '../../hooks/useAnimation';
import { generateTwoPointersSteps, twoPointersCode } from '../../algorithms/strings';
import AnimationControls from '../common/AnimationControls';
import CodePanel from '../common/CodePanel';
import StatePanel from '../common/StatePanel';
import './StringsViz.css';

/**
 * Two Pointers Visualizer
 * Check if string is palindrome
 */
const TwoPointersViz = () => {
  const [inputStr, setInputStr] = useState('racecar');

  // Generate animation steps
  const steps = useMemo(() => {
    return generateTwoPointersSteps(inputStr);
  }, [inputStr]);

  // Use animation hook
  const animation = useAnimation(steps, 1);
  const currentState = animation.currentState || {};

  const handleVisualize = () => {
    if (inputStr.length >= 1) {
      animation.reset();
      setTimeout(() => animation.play(), 100);
    }
  };

  const handleRandom = () => {
    const palindromes = ['racecar', 'level', 'deified', 'civic', 'radar', 'refer', 'rotor'];
    const nonPalindromes = ['hello', 'world', 'algorithm', 'coding', 'javascript'];
    const all = [...palindromes, ...nonPalindromes];
    const newStr = all[Math.floor(Math.random() * all.length)];
    setInputStr(newStr);
    setTimeout(() => {
      animation.reset();
      animation.play();
    }, 100);
  };

  const { chars, left, right, comparing, matched, mismatch, isPalindrome } = currentState;
  const displayChars = chars || inputStr.toLowerCase().replace(/[^a-z0-9]/g, '').split('');

  return (
    <div className="string-viz-page">
      <div className="viz-header">
        <Link to="/visualizer/strings" className="back-btn">← Back</Link>
        <div className="viz-title-section">
          <h1 className="viz-title">Two Pointers</h1>
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
              placeholder="Enter string to check..."
              className="input-field"
            />
            <button onClick={handleVisualize} className="btn-visualize">Visualize</button>
            <button onClick={handleRandom} className="btn-random">Random</button>
          </div>

          <div className="message-display">
            <span className="message-text">{currentState.message || 'Click Visualize to check palindrome'}</span>
          </div>

          <div className="char-container">
            {displayChars.map((char, idx) => {
              const isLeft = left === idx;
              const isRight = right === idx;
              const isComparing = comparing?.includes(idx);
              const isMatched = matched?.includes(idx);
              const isMismatch = mismatch?.includes(idx);
              
              return (
                <div
                  key={idx}
                  className={`char-box 
                    ${isLeft ? 'left-pointer' : ''} 
                    ${isRight ? 'right-pointer' : ''} 
                    ${isComparing ? 'comparing highlight' : ''} 
                    ${isMatched ? 'match' : ''} 
                    ${isMismatch ? 'mismatch' : ''}`}
                >
                  {char}
                </div>
              );
            })}
          </div>

          <div className="index-row">
            {displayChars.map((_, idx) => (
              <div key={idx} className="index-label">{idx}</div>
            ))}
          </div>

          {isPalindrome !== null && (
            <div className="result-display">
              <div className="result-label">Result</div>
              <div className={`result-value ${isPalindrome ? 'success' : 'failure'}`}>
                {isPalindrome ? '✓ Is Palindrome' : '✗ Not Palindrome'}
              </div>
            </div>
          )}

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
          <CodePanel code={twoPointersCode} currentLine={currentState.codeLine} title="Two Pointers" />
          <StatePanel state={{ left, right, isPalindrome }} title="Variables" />
        </div>
      </div>

      <div className="viz-info">
        <h3>About Two Pointers</h3>
        <p>
          The two pointers technique uses two indices that traverse from opposite ends toward the center.
          It's commonly used for palindrome checking, pair finding, and partition problems.
        </p>
        <div className="complexity-badges">
          <span className="badge time">Time: O(n)</span>
          <span className="badge space">Space: O(1)</span>
        </div>
      </div>
    </div>
  );
};

export default TwoPointersViz;
