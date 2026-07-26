import React, { useState, useMemo } from 'react';
import { Link } from 'react-router';
import useAnimation from '../../hooks/useAnimation';
import { generateKnapsackSteps, knapsackCode, defaultKnapsack } from '../../algorithms/dp';
import AnimationControls from '../common/AnimationControls';
import CodePanel from '../common/CodePanel';
import StatePanel from '../common/StatePanel';
import AskTutorButton from '../common/AskTutorButton';
import './DPViz.css';

/**
 * 0/1 Knapsack Problem Visualizer
 */
const KnapsackViz = () => {
  const [weights, setWeights] = useState(defaultKnapsack.weights);
  const [values, setValues] = useState(defaultKnapsack.values);
  const [capacity, setCapacity] = useState(defaultKnapsack.capacity);
  const [inputWeights, setInputWeights] = useState(defaultKnapsack.weights.join(', '));
  const [inputValues, setInputValues] = useState(defaultKnapsack.values.join(', '));
  const [inputCapacity, setInputCapacity] = useState(defaultKnapsack.capacity.toString());

  const steps = useMemo(() => {
    return generateKnapsackSteps(weights, values, capacity);
  }, [weights, values, capacity]);

  const animation = useAnimation(steps, 1);
  const currentState = animation.currentState || {};

  const handleVisualize = () => {
    const w = inputWeights.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n) && n > 0);
    const v = inputValues.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n) && n > 0);
    const c = parseInt(inputCapacity);
    
    if (w.length > 0 && w.length === v.length && c > 0 && c <= 20) {
      setWeights(w);
      setValues(v);
      setCapacity(c);
      setTimeout(() => {
        animation.reset();
        animation.play();
      }, 100);
    } else {
      alert('Please enter valid weights, values (same count), and capacity (1-20)');
    }
  };

  const handlePreset = (preset) => {
    const presets = {
      simple: { weights: [1, 2, 3], values: [6, 10, 12], capacity: 5 },
      medium: { weights: [1, 2, 3, 4], values: [10, 20, 30, 40], capacity: 5 },
      complex: { weights: [2, 3, 4, 5], values: [3, 4, 5, 6], capacity: 8 }
    };
    const p = presets[preset];
    setWeights(p.weights);
    setValues(p.values);
    setCapacity(p.capacity);
    setInputWeights(p.weights.join(', '));
    setInputValues(p.values.join(', '));
    setInputCapacity(p.capacity.toString());
    setTimeout(() => {
      animation.reset();
      animation.play();
    }, 100);
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
              <th className="corner-cell">i\w</th>
              {Array.from({ length: capacity + 1 }, (_, i) => (
                <th key={i} className="header-cell">{i}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dp.map((row, i) => (
              <tr key={i}>
                <th className="row-header">
                  {i === 0 ? '0' : `${i} (w=${weights[i-1]}, v=${values[i-1]})`}
                </th>
                {row.map((cell, j) => {
                  const isCurrent = currentCell && currentCell[0] === i && currentCell[1] === j;
                  const isComparing = comparing.some(c => c[0] === i && c[1] === j);
                  
                  let cellClass = 'dp-cell';
                  if (isCurrent) cellClass += ' current';
                  if (isComparing) cellClass += ' comparing';
                  if (currentState.status === 'complete' && i === weights.length && j === capacity) {
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

  const renderItems = () => {
    const items = currentState.items || weights.map((w, i) => ({ weight: w, value: values[i], included: false }));
    
    return (
      <div className="items-container">
        <h4>Items</h4>
        <div className="items-grid">
          {items.map((item, i) => (
            <div key={i} className={`item-card ${item.included ? 'included' : ''}`}>
              <div className="item-icon">🎒</div>
              <div className="item-details">
                <span className="item-label">Item {i + 1}</span>
                <span className="item-weight">W: {item.weight}</span>
                <span className="item-value">V: {item.value}</span>
              </div>
              {item.included && <div className="item-check">✓</div>}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="visualizer-page">
      <div className="viz-header">
        <Link to="/visualizer/dynamic-programming" className="back-btn">← Back</Link>
        <div className="viz-title-section">
          <h1 className="viz-title">🎒 0/1 Knapsack</h1>
          <span className="viz-tag">Dynamic Programming</span>
        </div>
      </div>

      <div className="viz-content">
        <div className="viz-main">
          <div className="input-section">
            <div className="input-row">
              <div className="input-group">
                <label>Weights:</label>
                <input
                  type="text"
                  value={inputWeights}
                  onChange={(e) => setInputWeights(e.target.value)}
                  className="input-field"
                  placeholder="1, 2, 3, 4"
                />
              </div>
              <div className="input-group">
                <label>Values:</label>
                <input
                  type="text"
                  value={inputValues}
                  onChange={(e) => setInputValues(e.target.value)}
                  className="input-field"
                  placeholder="10, 20, 30, 40"
                />
              </div>
              <div className="input-group">
                <label>Capacity:</label>
                <input
                  type="number"
                  value={inputCapacity}
                  onChange={(e) => setInputCapacity(e.target.value)}
                  className="input-field small"
                  min="1"
                  max="20"
                />
              </div>
            </div>
            <div className="button-row">
              <button onClick={handleVisualize} className="btn-visualize">Visualize</button>
              <div className="preset-buttons">
                <button onClick={() => handlePreset('simple')} className="btn-preset">Simple</button>
                <button onClick={() => handlePreset('medium')} className="btn-preset">Medium</button>
                <button onClick={() => handlePreset('complex')} className="btn-preset">Complex</button>
              </div>
            </div>
          </div>

          <div className="status-message">
            <span className="status-icon">
              {currentState.status === 'complete' ? '✅' : currentState.status === 'include' ? '✓' : '📊'}
            </span>
            <span>{currentState.message || 'Ready to solve knapsack problem'}</span>
          </div>

          {renderItems()}
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
          <AskTutorButton topic="0/1 Knapsack Problem" />
          <CodePanel code={knapsackCode} currentLine={currentState.codeLine} title="Knapsack Algorithm" />
          <StatePanel
            state={{
              'Items': weights.length,
              'Capacity': capacity,
              'Current Item': currentState.i || '-',
              'Current Weight': currentState.w ?? '-',
              'Max Value': currentState.result ?? '-'
            }}
            title="Current State"
          />
        </div>
      </div>

      <div className="viz-info">
        <h3>About 0/1 Knapsack</h3>
        <p>
          Given items with weights and values, find the maximum value that can fit in a knapsack 
          of limited capacity. Each item can only be taken once (0/1 choice).
        </p>
        <div className="complexity-badges">
          <span className="badge time">Time: O(n×W)</span>
          <span className="badge space">Space: O(n×W)</span>
          <span className="badge info">Tabulation</span>
        </div>
      </div>
    </div>
  );
};

export default KnapsackViz;
