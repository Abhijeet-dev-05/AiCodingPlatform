import React, { useState, useMemo } from 'react';
import { Link } from 'react-router';
import useAnimation from '../../hooks/useAnimation';
import { generateEditDistanceSteps, editDistanceCode, defaultEditDistance } from '../../algorithms/dp';
import AnimationControls from '../common/AnimationControls';
import CodePanel from '../common/CodePanel';
import StatePanel from '../common/StatePanel';
import AskTutorButton from '../common/AskTutorButton';
import './DPViz.css';

/**
 * Edit Distance (Levenshtein) Visualizer
 */
const EditDistanceViz = () => {
  const [word1, setWord1] = useState(defaultEditDistance.word1);
  const [word2, setWord2] = useState(defaultEditDistance.word2);
  const [inputWord1, setInputWord1] = useState(defaultEditDistance.word1);
  const [inputWord2, setInputWord2] = useState(defaultEditDistance.word2);

  const steps = useMemo(() => {
    return generateEditDistanceSteps(word1, word2);
  }, [word1, word2]);

  const animation = useAnimation(steps, 1);
  const currentState = animation.currentState || {};

  const handleVisualize = () => {
    if (inputWord1.length > 0 && inputWord2.length > 0 && 
        inputWord1.length <= 8 && inputWord2.length <= 8) {
      setWord1(inputWord1.toLowerCase());
      setWord2(inputWord2.toLowerCase());
      setTimeout(() => {
        animation.reset();
        animation.play();
      }, 100);
    } else {
      alert('Please enter words (1-8 characters each)');
    }
  };

  const handlePreset = (preset) => {
    const presets = {
      easy: { word1: 'cat', word2: 'cut' },
      medium: { word1: 'horse', word2: 'ros' },
      hard: { word1: 'intention', word2: 'execution' }
    };
    const p = presets[preset];
    setWord1(p.word1);
    setWord2(p.word2);
    setInputWord1(p.word1);
    setInputWord2(p.word2);
    setTimeout(() => {
      animation.reset();
      animation.play();
    }, 100);
  };

  const getOperationIcon = () => {
    switch (currentState.operation) {
      case 'match': return '✓';
      case 'insert': return '➕';
      case 'delete': return '➖';
      case 'replace': return '🔄';
      default: return '📝';
    }
  };

  const renderStrings = () => {
    const currentCell = currentState.currentCell;
    
    return (
      <div className="string-comparison">
        <div className="string-box">
          <label>Word 1 (source)</label>
          <div className="string-display">
            {word1.split('').map((char, idx) => {
              const isHighlight = currentCell && idx === currentCell[0] - 1;
              return (
                <div key={idx} className={`char-box ${isHighlight ? 'highlight' : ''}`}>
                  {char}
                </div>
              );
            })}
          </div>
        </div>
        <div className="operation-arrow">→</div>
        <div className="string-box">
          <label>Word 2 (target)</label>
          <div className="string-display">
            {word2.split('').map((char, idx) => {
              const isHighlight = currentCell && idx === currentCell[1] - 1;
              return (
                <div key={idx} className={`char-box ${isHighlight ? 'highlight' : ''}`}>
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

    if (dp.length === 0) return null;

    return (
      <div className="dp-table-container">
        <table className="dp-table">
          <thead>
            <tr>
              <th className="corner-cell"></th>
              <th className="header-cell">ε</th>
              {word2.split('').map((char, i) => (
                <th key={i} className="header-cell">{char}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dp.map((row, i) => (
              <tr key={i}>
                <th className="row-header">{i === 0 ? 'ε' : word1[i - 1]}</th>
                {row.map((cell, j) => {
                  const isCurrent = currentCell && currentCell[0] === i && currentCell[1] === j;
                  const isComparing = comparing.some(c => c[0] === i && c[1] === j);
                  
                  let cellClass = 'dp-cell';
                  if (isCurrent) cellClass += ' current';
                  if (isComparing) cellClass += ' comparing';
                  if (currentState.status === 'complete' && i === word1.length && j === word2.length) {
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

  const renderOperationLegend = () => {
    return (
      <div className="operation-legend">
        <div className="legend-item">
          <span className="legend-icon match">✓</span>
          <span>Match (0)</span>
        </div>
        <div className="legend-item">
          <span className="legend-icon insert">➕</span>
          <span>Insert (+1)</span>
        </div>
        <div className="legend-item">
          <span className="legend-icon delete">➖</span>
          <span>Delete (+1)</span>
        </div>
        <div className="legend-item">
          <span className="legend-icon replace">🔄</span>
          <span>Replace (+1)</span>
        </div>
      </div>
    );
  };

  return (
    <div className="visualizer-page">
      <div className="viz-header">
        <Link to="/visualizer/dynamic-programming" className="back-btn">← Back</Link>
        <div className="viz-title-section">
          <h1 className="viz-title">✏️ Edit Distance</h1>
          <span className="viz-tag">Dynamic Programming</span>
        </div>
      </div>

      <div className="viz-content">
        <div className="viz-main">
          <div className="input-section">
            <div className="input-row">
              <div className="input-group">
                <label>Word 1:</label>
                <input
                  type="text"
                  value={inputWord1}
                  onChange={(e) => setInputWord1(e.target.value.toLowerCase())}
                  className="input-field"
                  maxLength={8}
                />
              </div>
              <div className="input-group">
                <label>Word 2:</label>
                <input
                  type="text"
                  value={inputWord2}
                  onChange={(e) => setInputWord2(e.target.value.toLowerCase())}
                  className="input-field"
                  maxLength={8}
                />
              </div>
            </div>
            <div className="button-row">
              <button onClick={handleVisualize} className="btn-visualize">Visualize</button>
              <div className="preset-buttons">
                <button onClick={() => handlePreset('easy')} className="btn-preset">Easy</button>
                <button onClick={() => handlePreset('medium')} className="btn-preset">Medium</button>
                <button onClick={() => handlePreset('hard')} className="btn-preset">Hard</button>
              </div>
            </div>
          </div>

          <div className="status-message">
            <span className="status-icon">{getOperationIcon()}</span>
            <span>{currentState.message || 'Ready to calculate edit distance'}</span>
          </div>

          {renderStrings()}
          {renderOperationLegend()}
          {renderDPTable()}

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
          <AskTutorButton topic="Edit Distance Algorithm" />
          <CodePanel code={editDistanceCode} currentLine={currentState.codeLine} title="Edit Distance" />
          <StatePanel
            state={{
              'Word 1': `"${word1}"`,
              'Word 2': `"${word2}"`,
              'Position': currentState.currentCell ? `(${currentState.currentCell[0]}, ${currentState.currentCell[1]})` : '-',
              'Operation': currentState.operation || '-',
              'Min Edits': currentState.result ?? '-'
            }}
            title="Current State"
          />
        </div>
      </div>

      <div className="viz-info">
        <h3>About Edit Distance</h3>
        <p>
          Find the minimum number of operations (insert, delete, replace) needed to 
          convert one word into another. Also known as Levenshtein distance.
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

export default EditDistanceViz;
