import React, { useState, useMemo } from 'react';
import { Link } from 'react-router';
import useAnimation from '../../hooks/useAnimation';
import { generateManacherSteps, manacherCode } from '../../algorithms/strings';
import AnimationControls from '../common/AnimationControls';
import CodePanel from '../common/CodePanel';
import StatePanel from '../common/StatePanel';
import './StringsViz.css';

/**
 * Manacher's Algorithm Visualizer
 * Find longest palindromic substring
 */
const ManacherViz = () => {
  const [inputStr, setInputStr] = useState('babad');

  // Generate animation steps
  const steps = useMemo(() => {
    return generateManacherSteps(inputStr);
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
    const examples = ['babad', 'cbbd', 'racecar', 'abacdfgdcaba', 'abaaba', 'forgeeksskeegfor'];
    const newStr = examples[Math.floor(Math.random() * examples.length)];
    setInputStr(newStr);
    setTimeout(() => {
      animation.reset();
      animation.play();
    }, 100);
  };

  const { 
    original, 
    processed, 
    p, 
    center, 
    right, 
    i, 
    mirror,
    expanding,
    palindromeRange,
    longestPalindrome,
    maxLen,
    resultStart,
    resultEnd
  } = currentState;

  const displayProcessed = processed || ('#' + inputStr.split('').join('#') + '#').split('');
  const displayP = p || new Array(displayProcessed.length).fill(0);

  return (
    <div className="string-viz-page">
      <div className="viz-header">
        <Link to="/visualizer/strings" className="back-btn">← Back</Link>
        <div className="viz-title-section">
          <h1 className="viz-title">Manacher's Algorithm</h1>
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
            <span className="message-text">{currentState.message || 'Click Visualize to find longest palindrome'}</span>
          </div>

          {/* Original String Display */}
          <div className="pattern-label">Original String:</div>
          <div className="char-container">
            {(original || inputStr).split('').map((char, idx) => {
              const isInPalindrome = longestPalindrome && 
                                     idx >= resultStart && 
                                     idx <= resultEnd;
              return (
                <div 
                  key={idx} 
                  className={`char-box ${isInPalindrome ? 'match' : ''}`}
                >
                  {char}
                </div>
              );
            })}
          </div>

          {/* Processed String Display */}
          <div className="pattern-section">
            <div className="pattern-label">Preprocessed String (with # separators):</div>
            <div className="char-container">
              {displayProcessed.map((char, idx) => {
                const isCurrentI = i === idx;
                const isCenter = center === idx;
                const isRight = right === idx;
                const isMirror = mirror === idx;
                const isInPalindromeRange = palindromeRange && 
                                            idx >= palindromeRange.start && 
                                            idx <= palindromeRange.end;
                
                return (
                  <div
                    key={idx}
                    className={`char-box 
                      ${isCurrentI ? 'comparing highlight' : ''} 
                      ${isCenter ? 'left-pointer' : ''} 
                      ${isRight ? 'right-pointer' : ''}
                      ${isMirror ? 'window' : ''}
                      ${isInPalindromeRange ? 'match' : ''}
                      ${expanding && isCurrentI ? 'highlight' : ''}`}
                    style={{ 
                      width: '32px', 
                      height: '40px', 
                      fontSize: '0.9rem',
                      opacity: char === '#' ? 0.5 : 1
                    }}
                  >
                    {char}
                  </div>
                );
              })}
            </div>

            <div className="index-row">
              {displayProcessed.map((_, idx) => (
                <div key={idx} className="index-label" style={{ width: '32px' }}>{idx}</div>
              ))}
            </div>

            {/* P Array */}
            <div className="pattern-label" style={{ marginTop: '1rem' }}>P Array (palindrome radius at each center):</div>
            <div className="value-row">
              {displayP.map((val, idx) => (
                <div 
                  key={idx} 
                  className="value-box"
                  style={{ 
                    width: '32px',
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
              <div className="hash-label">Center</div>
              <div className="hash-value">{center ?? '-'}</div>
            </div>
            <div className="hash-item">
              <div className="hash-label">Right</div>
              <div className="hash-value">{right ?? '-'}</div>
            </div>
          </div>

          {longestPalindrome && (
            <div className="result-display">
              <div className="result-label">Longest Palindromic Substring</div>
              <div className="result-value success">
                "{longestPalindrome}" (length {maxLen})
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
          <CodePanel code={manacherCode} currentLine={currentState.codeLine} title="Manacher's" />
          <StatePanel state={{ i, center, right, longestPalindrome }} title="Variables" />
        </div>
      </div>

      <div className="viz-info">
        <h3>About Manacher's Algorithm</h3>
        <p>
          Manacher's algorithm finds the longest palindromic substring in linear time by using
          previously computed information. It preprocesses the string with separators to handle
          both odd and even length palindromes uniformly.
        </p>
        <div className="complexity-badges">
          <span className="badge time">Time: O(n)</span>
          <span className="badge space">Space: O(n)</span>
        </div>
      </div>
    </div>
  );
};

export default ManacherViz;
