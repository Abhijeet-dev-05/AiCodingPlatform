import React, { useState, useMemo } from 'react';
import { Link } from 'react-router';
import useAnimation from '../../hooks/useAnimation';
import { generateKMPSteps, kmpCode } from '../../algorithms/strings';
import AnimationControls from '../common/AnimationControls';
import CodePanel from '../common/CodePanel';
import StatePanel from '../common/StatePanel';
import './StringsViz.css';

/**
 * KMP Pattern Matching Visualizer
 */
const KMPViz = () => {
  const [text, setText] = useState('ababcabcabababd');
  const [pattern, setPattern] = useState('ababd');

  // Generate animation steps
  const steps = useMemo(() => {
    return generateKMPSteps(text, pattern);
  }, [text, pattern]);

  // Use animation hook
  const animation = useAnimation(steps, 1);
  const currentState = animation.currentState || {};

  const handleVisualize = () => {
    if (text.length >= 1 && pattern.length >= 1) {
      animation.reset();
      setTimeout(() => animation.play(), 100);
    }
  };

  const handleRandom = () => {
    const examples = [
      { text: 'ababcabcabababd', pattern: 'ababd' },
      { text: 'aaaaab', pattern: 'aaab' },
      { text: 'abcxabcdabcdabcy', pattern: 'abcdabcy' },
      { text: 'AABAACAADAABAABA', pattern: 'AABA' }
    ];
    const ex = examples[Math.floor(Math.random() * examples.length)];
    setText(ex.text);
    setPattern(ex.pattern);
    setTimeout(() => {
      animation.reset();
      animation.play();
    }, 100);
  };

  const { 
    text: textArr, 
    pattern: patternArr, 
    lps, 
    textIndex, 
    patternIndex, 
    patternOffset,
    comparing,
    matches,
    matchFound,
    buildingLPS
  } = currentState;

  const displayText = textArr || text.split('');
  const displayPattern = patternArr || pattern.split('');
  const displayLPS = lps || [];

  return (
    <div className="string-viz-page">
      <div className="viz-header">
        <Link to="/visualizer/strings" className="back-btn">← Back</Link>
        <div className="viz-title-section">
          <h1 className="viz-title">KMP Pattern Matching</h1>
          <span className="viz-tag">String Algorithm</span>
        </div>
      </div>

      <div className="viz-content">
        <div className="viz-main">
          <div className="input-section">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text..."
              className="input-field"
            />
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="Pattern..."
              className="input-field"
              style={{ maxWidth: '150px' }}
            />
            <button onClick={handleVisualize} className="btn-visualize">Visualize</button>
            <button onClick={handleRandom} className="btn-random">Random</button>
          </div>

          <div className="message-display">
            <span className="message-text">{currentState.message || 'Click Visualize to start KMP search'}</span>
          </div>

          {/* Text Display */}
          <div className="pattern-label">Text:</div>
          <div className="char-container">
            {displayText.map((char, idx) => {
              const isComparing = comparing?.includes(idx);
              const isMatch = matches?.includes(idx - (pattern.length - 1)) && 
                             idx >= matches[matches.length - 1] && 
                             idx < matches[matches.length - 1] + pattern.length;
              
              return (
                <div
                  key={idx}
                  className={`char-box ${isComparing ? 'comparing highlight' : ''} ${matchFound !== undefined && idx >= matchFound && idx < matchFound + pattern.length ? 'match' : ''}`}
                >
                  {char}
                </div>
              );
            })}
          </div>

          <div className="index-row">
            {displayText.map((_, idx) => (
              <div key={idx} className="index-label">{idx}</div>
            ))}
          </div>

          {/* Pattern Display */}
          <div className="pattern-section">
            <div className="pattern-label">Pattern {buildingLPS ? '(Building LPS)' : ''}:</div>
            <div className="char-container">
              {displayPattern.map((char, idx) => {
                const isCurrentPatternIdx = patternIndex === idx;
                return (
                  <div
                    key={idx}
                    className={`char-box ${isCurrentPatternIdx ? 'highlight' : ''}`}
                  >
                    {char}
                  </div>
                );
              })}
            </div>

            {/* LPS Array */}
            {displayLPS.length > 0 && (
              <>
                <div className="pattern-label" style={{ marginTop: '1rem' }}>LPS (Failure Function):</div>
                <div className="value-row">
                  {displayLPS.map((val, idx) => (
                    <div key={idx} className="value-box">{val}</div>
                  ))}
                </div>
              </>
            )}
          </div>

          {matches && matches.length > 0 && (
            <div className="result-display">
              <div className="result-label">Matches Found</div>
              <div className="result-value success">
                {matches.length} match(es) at indices: [{matches.join(', ')}]
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
          <CodePanel code={kmpCode} currentLine={currentState.codeLine} title="KMP Algorithm" />
          <StatePanel state={{ textIndex, patternIndex, lps: displayLPS.join(','), matches: matches?.join(',') }} title="Variables" />
        </div>
      </div>

      <div className="viz-info">
        <h3>About KMP (Knuth-Morris-Pratt)</h3>
        <p>
          KMP is an efficient pattern matching algorithm that uses a failure function (LPS array) 
          to skip unnecessary comparisons. It never goes backward in the text.
        </p>
        <div className="complexity-badges">
          <span className="badge time">Time: O(n + m)</span>
          <span className="badge space">Space: O(m)</span>
        </div>
      </div>
    </div>
  );
};

export default KMPViz;
