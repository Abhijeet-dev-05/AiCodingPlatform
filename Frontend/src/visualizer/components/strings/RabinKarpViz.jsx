import React, { useState, useMemo } from 'react';
import { Link } from 'react-router';
import useAnimation from '../../hooks/useAnimation';
import { generateRabinKarpSteps, rabinKarpCode } from '../../algorithms/strings';
import AnimationControls from '../common/AnimationControls';
import CodePanel from '../common/CodePanel';
import StatePanel from '../common/StatePanel';
import './StringsViz.css';

/**
 * Rabin-Karp Pattern Matching Visualizer
 * Rolling hash based pattern matching
 */
const RabinKarpViz = () => {
  const [text, setText] = useState('abracadabra');
  const [pattern, setPattern] = useState('abra');

  // Generate animation steps
  const steps = useMemo(() => {
    return generateRabinKarpSteps(text, pattern);
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
      { text: 'abracadabra', pattern: 'abra' },
      { text: 'aabaacaadaabaaba', pattern: 'aaba' },
      { text: 'hello world', pattern: 'wor' },
      { text: 'testingtesting', pattern: 'test' }
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
    windowStart, 
    windowEnd,
    patternHash, 
    textHash, 
    matches,
    matchFound,
    spuriousHit,
    rolling
  } = currentState;

  const displayText = textArr || text.split('');
  const displayPattern = patternArr || pattern.split('');

  return (
    <div className="string-viz-page">
      <div className="viz-header">
        <Link to="/visualizer/strings" className="back-btn">← Back</Link>
        <div className="viz-title-section">
          <h1 className="viz-title">Rabin-Karp</h1>
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
            <span className="message-text">{currentState.message || 'Click Visualize to start Rabin-Karp search'}</span>
          </div>

          {/* Text Display */}
          <div className="pattern-label">Text:</div>
          <div className="char-container">
            {displayText.map((char, idx) => {
              const isInWindow = windowStart !== null && idx >= windowStart && idx <= windowEnd;
              const isMatch = matchFound !== undefined && idx >= matchFound && idx < matchFound + pattern.length;
              
              return (
                <div
                  key={idx}
                  className={`char-box ${isInWindow ? 'window' : ''} ${isMatch ? 'match' : ''} ${spuriousHit && isInWindow ? 'mismatch' : ''}`}
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
            <div className="pattern-label">Pattern:</div>
            <div className="char-container">
              {displayPattern.map((char, idx) => (
                <div key={idx} className="char-box">{char}</div>
              ))}
            </div>
          </div>

          {/* Hash Display */}
          <div className="hash-display">
            <div className="hash-item">
              <div className="hash-label">Pattern Hash</div>
              <div className="hash-value">{patternHash ?? '-'}</div>
            </div>
            <div className="hash-item">
              <div className="hash-label">Window Hash</div>
              <div className={`hash-value ${patternHash === textHash ? 'match' : ''}`}>
                {textHash ?? '-'}
              </div>
            </div>
            <div className="hash-item">
              <div className="hash-label">Status</div>
              <div className="hash-value" style={{ fontSize: '1rem' }}>
                {rolling ? '🔄 Rolling' : patternHash === textHash ? '✓ Hash Match' : '—'}
              </div>
            </div>
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
          <CodePanel code={rabinKarpCode} currentLine={currentState.codeLine} title="Rabin-Karp" />
          <StatePanel state={{ windowStart, patternHash, textHash, matches: matches?.join(',') }} title="Variables" />
        </div>
      </div>

      <div className="viz-info">
        <h3>About Rabin-Karp</h3>
        <p>
          Rabin-Karp uses a rolling hash function to quickly filter out positions that don't match.
          When hashes match, it verifies character by character to avoid false positives (spurious hits).
        </p>
        <div className="complexity-badges">
          <span className="badge time">Time: O(n×m) avg O(n+m)</span>
          <span className="badge space">Space: O(1)</span>
        </div>
      </div>
    </div>
  );
};

export default RabinKarpViz;
