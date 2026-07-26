import React, { useState, useMemo } from 'react';
import { Link } from 'react-router';
import useAnimation from '../../hooks/useAnimation';
import { generateLISSteps, lisCode, defaultLIS } from '../../algorithms/dp';
import AnimationControls from '../common/AnimationControls';
import CodePanel from '../common/CodePanel';
import StatePanel from '../common/StatePanel';
import AskTutorButton from '../common/AskTutorButton';
import './DPViz.css';

/**
 * Longest Increasing Subsequence Visualizer
 */
const LISViz = () => {
  const [nums, setNums] = useState(defaultLIS.nums);
  const [inputNums, setInputNums] = useState(defaultLIS.nums.join(', '));

  const steps = useMemo(() => {
    return generateLISSteps(nums);
  }, [nums]);

  const animation = useAnimation(steps, 1);
  const currentState = animation.currentState || {};

  const handleVisualize = () => {
    const n = inputNums.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
    
    if (n.length >= 2 && n.length <= 12) {
      setNums(n);
      setTimeout(() => {
        animation.reset();
        animation.play();
      }, 100);
    } else {
      alert('Please enter 2-12 numbers separated by commas');
    }
  };

  const handlePreset = (preset) => {
    const presets = {
      simple: { nums: [3, 1, 4, 1, 5, 9] },
      medium: { nums: [10, 9, 2, 5, 3, 7, 101, 18] },
      hard: { nums: [0, 1, 0, 3, 2, 3] }
    };
    const p = presets[preset];
    setNums(p.nums);
    setInputNums(p.nums.join(', '));
    setTimeout(() => {
      animation.reset();
      animation.play();
    }, 100);
  };

  const renderArray = () => {
    const dp = currentState.dp || Array(nums.length).fill(1);
    const currentIndex = currentState.currentIndex;
    const comparingIndex = currentState.comparingIndex;
    const lis = currentState.lis || [];

    return (
      <div className="array-display">
        {nums.map((num, idx) => {
          const isCurrent = idx === currentIndex;
          const isComparing = idx === comparingIndex;
          const isInLIS = lis.includes(num);
          
          let valueClass = 'array-value';
          if (isCurrent) valueClass += ' current';
          if (isComparing) valueClass += ' comparing';
          if (currentState.status === 'complete' && isInLIS) valueClass += ' included';

          return (
            <div key={idx} className="array-item">
              <div className={valueClass}>{num}</div>
              <div className="array-dp">dp={dp[idx]}</div>
              <div className="array-index">i={idx}</div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderLIS = () => {
    const lis = currentState.lis || [];
    
    if (lis.length === 0 || currentState.status !== 'complete') return null;

    return (
      <div className="result-display">
        <span className="result-label">One LIS:</span>
        <div className="lis-result">
          {lis.map((num, idx) => (
            <span key={idx} className="lis-item">{num}</span>
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
          <h1 className="viz-title">📈 Longest Increasing Subsequence</h1>
          <span className="viz-tag">Dynamic Programming</span>
        </div>
      </div>

      <div className="viz-content">
        <div className="viz-main">
          <div className="input-section">
            <div className="input-row">
              <div className="input-group" style={{ flex: 1 }}>
                <label>Array:</label>
                <input
                  type="text"
                  value={inputNums}
                  onChange={(e) => setInputNums(e.target.value)}
                  className="input-field"
                  placeholder="10, 9, 2, 5, 3, 7, 101, 18"
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
               currentState.status === 'update' ? '✓' : '📈'}
            </span>
            <span>{currentState.message || 'Ready to find LIS'}</span>
          </div>

          {renderArray()}
          {renderLIS()}

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
          <AskTutorButton topic="Longest Increasing Subsequence" />
          <CodePanel code={lisCode} currentLine={currentState.codeLine} title="LIS Algorithm" />
          <StatePanel
            state={{
              'Array Size': nums.length,
              'Current Index': currentState.currentIndex ?? '-',
              'Comparing': currentState.comparingIndex ?? '-',
              'LIS Length': currentState.result ?? '-'
            }}
            title="Current State"
          />
        </div>
      </div>

      <div className="viz-info">
        <h3>About Longest Increasing Subsequence</h3>
        <p>
          Find the length of the longest strictly increasing subsequence. Each element 
          in the subsequence must be greater than the previous.
        </p>
        <div className="complexity-badges">
          <span className="badge time">Time: O(n²)</span>
          <span className="badge space">Space: O(n)</span>
          <span className="badge info">DP Array</span>
        </div>
      </div>
    </div>
  );
};

export default LISViz;
