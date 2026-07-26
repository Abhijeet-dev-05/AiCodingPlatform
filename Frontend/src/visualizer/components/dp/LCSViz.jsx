import React, { useState, useMemo } from 'react';
import { Link } from 'react-router';
import useAnimation from '../../hooks/useAnimation';
import { generateLCSSteps, lcsCode, defaultLCS } from '../../algorithms/dp';
import AnimationControls from '../common/AnimationControls';
import CodePanel from '../common/CodePanel';
import StatePanel from '../common/StatePanel';
import AskTutorButton from '../common/AskTutorButton';
import './DPViz.css';

/**
 * Longest Common Subsequence Visualizer
 */
const LCSViz = () => {
  const [text1, setText1] = useState(defaultLCS.text1);
  const [text2, setText2] = useState(defaultLCS.text2);
  const [inputText1, setInputText1] = useState(defaultLCS.text1);
  const [inputText2, setInputText2] = useState(defaultLCS.text2);

  const steps = useMemo(() => {
    return generateLCSSteps(text1, text2);
  }, [text1, text2]);

  const animation = useAnimation(steps, 1);
  const currentState = animation.currentState || {};

  const handleVisualize = () => {
    if (inputText1.length > 0 && inputText2.length > 0 && 
        inputText1.length <= 10 && inputText2.length <= 10) {
      setText1(inputText1.toUpperCase());
      setText2(inputText2.toUpperCase());
      setTimeout(() => {
        animation.reset();
        animation.play();
      }, 100);
    } else {
      alert('Please enter strings (1-10 characters each)');
    }
  };

  const handlePreset = (preset) => {
    const presets = {
      simple: { text1: 'ABCD', text2: 'AEBD' },
      medium: { text1: 'AGGTAB', text2: 'GXTXAYB' },
      hard: { text1: 'ABCBDAB', text2: 'BDCABA' }
    };
    const p = presets[preset];
    setText1(p.text1);
    setText2(p.text2);
    setInputText1(p.text1);
    setInputText2(p.text2);
    setTimeout(() => {
      animation.reset();
      animation.play();
    }, 100);
  };

  const renderStrings = () => {
    const i = currentState.i || 0;
    const j = currentState.j || 0;
    const path = currentState.path || [];
    
    return (
      <div className="string-comparison">
        <div className="string-box">
          <label>String 1</label>
          <div className="string-display">
            {text1.split('').map((char, idx) => {
              const isHighlight = idx === i - 1;
              const isMatch = path.some(p => p[0] === idx + 1);
              return (
                <div key={idx} className={`char-box ${isHighlight ? 'highlight' : ''} ${isMatch ? 'match' : ''}`}>
                  {char}
                </div>
              );
            })}
          </div>
        </div>
        <div className="string-box">
          <label>String 2</label>
          <div className="string-display">
            {text2.split('').map((char, idx) => {
              const isHighlight = idx === j - 1;
              const isMatch = path.some(p => p[1] === idx + 1);
              return (
                <div key={idx} className={`char-box ${isHighlight ? 'highlight' : ''} ${isMatch ? 'match' : ''}`}>
                  {char}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderDPTable = () => {
    const dp = currentState.dp || [];
    const currentCell = currentState.currentCell;
    const comparing = currentState.comparing || [];
    const path = currentState.path || [];

    if (dp.length === 0) return null;

    return (
      <div className="dp-table-container">
        <table className="dp-table">
          <thead>
            <tr>
              <th className="corner-cell"></th>
              <th className="header-cell">ε</th>
              {text2.split('').map((char, i) => (
                <th key={i} className="header-cell">{char}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dp.map((row, i) => (
              <tr key={i}>
                <th className="row-header">{i === 0 ? 'ε' : text1[i - 1]}</th>
                {row.map((cell, j) => {
                  const isCurrent = currentCell && currentCell[0] === i && currentCell[1] === j;
                  const isComparing = comparing.some(c => c[0] === i && c[1] === j);
                  const isPath = path.some(p => p[0] === i && p[1] === j);
                  
                  let cellClass = 'dp-cell';
                  if (isCurrent) cellClass += ' current';
                  if (isComparing) cellClass += ' comparing';
                  if (isPath) cellClass += ' result';
                  if (currentState.status === 'complete' && i === text1.length && j === text2.length) {
                    cellClass += ' result';
                  }

                  return (
                    <td key={j} className={cellClass}>
                      {cell}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="visualizer-page">
      <div className="viz-header">
        <Link to="/visualizer/dynamic-programming" className="back-btn">← Back</Link>
        <div className="viz-title-section">
          <h1 className="viz-title">🔗 Longest Common Subsequence</h1>
          <span className="viz-tag">Dynamic Programming</span>
        </div>
      </div>

      <div className="viz-content">
        <div className="viz-main">
          <div className="input-section">
            <div className="input-row">
              <div className="input-group">
                <label>String 1:</label>
                <input
                  type="text"
                  value={inputText1}
                  onChange={(e) => setInputText1(e.target.value.toUpperCase())}
                  className="input-field"
                  maxLength={10}
                />
              </div>
              <div className="input-group">
                <label>String 2:</label>
                <input
                  type="text"
                  value={inputText2}
                  onChange={(e) => setInputText2(e.target.value.toUpperCase())}
                  className="input-field"
                  maxLength={10}
                />
              </div>
            </div>
            <div className="button-row">
              <button onClick={handleVisualize} className="btn-visualize">Visualize</button>
              <div className="preset-buttons">
                <button onClick={() => handlePreset('simple')} className="btn-preset">Simple</button>
                <button onClick={() => handlePreset('medium')} className="btn-preset">Medium</button>
                <button onClick={() => handlePreset('hard')} className="btn-preset">Hard</button>
              </div>
            </div>
          </div>

          <div className="status-message">
            <span className="status-icon">
              {currentState.status === 'complete' ? '✅' : 
               currentState.status === 'match' ? '✓' : '📊'}
            </span>
            <span>{currentState.message || 'Ready to find LCS'}</span>
          </div>

          {renderStrings()}
          {renderDPTable()}

          {currentState.lcs && (
            <div className="result-display">
              <span className="result-label">LCS:</span>
              <span className="result-value">{currentState.lcs}</span>
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
          <AskTutorButton topic="Longest Common Subsequence" />
          <CodePanel code={lcsCode} currentLine={currentState.codeLine} title="LCS Algorithm" />
          <StatePanel
            state={{
              'String 1': `"${text1}" (${text1.length})`,
              'String 2': `"${text2}" (${text2.length})`,
              'Position': currentState.currentCell ? `(${currentState.currentCell[0]}, ${currentState.currentCell[1]})` : '-',
              'LCS Length': currentState.result ?? '-',
              'LCS': currentState.lcs || '-'
            }}
            title="Current State"
          />
        </div>
      </div>

      <div className="viz-info">
        <h3>About Longest Common Subsequence</h3>
        <p>
          Find the longest subsequence present in both strings. A subsequence appears in the 
          same relative order but not necessarily contiguous. Classic DP problem with O(m×n) solution.
        </p>
        <div className="complexity-badges">
          <span className="badge time">Time: O(m×n)</span>
          <span className="badge space">Space: O(m×n)</span>
          <span className="badge info">Tabulation</span>
        </div>
      </div>
    </div>
  );
};

export default LCSViz;
