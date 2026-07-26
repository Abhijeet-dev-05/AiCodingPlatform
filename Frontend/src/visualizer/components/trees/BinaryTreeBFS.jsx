import React, { useState, useMemo } from 'react';
import { Link } from 'react-router';
import useAnimation from '../../hooks/useAnimation';
import { generateBFSSteps, bfsCode } from '../../algorithms/trees';
import CodePanel from '../common/CodePanel';
import AnimationControls from '../common/AnimationControls';
import AskTutorButton from '../common/AskTutorButton';
import './TreeViz.css';
import '../sorting/BubbleSortViz.css';

/**
 * Binary Tree BFS (Level Order) Visualizer
 */
const BinaryTreeBFS = () => {
  const [values, setValues] = useState([1, 2, 3, 4, 5, 6, 7]);
  const [inputText, setInputText] = useState('1, 2, 3, 4, 5, 6, 7');

  const steps = useMemo(() => generateBFSSteps(values), [values]);
  const animation = useAnimation(steps, 0.8);
  const currentState = animation.currentState || {};

  const handleVisualize = () => {
    const newValues = inputText
      .split(',')
      .map(n => {
        const v = n.trim();
        return v === 'null' ? null : parseInt(v);
      });
    
    if (newValues.length >= 1 && newValues.length <= 15) {
      setValues(newValues);
      setTimeout(() => {
        animation.reset();
        animation.play();
      }, 100);
    }
  };

  const handleRandom = () => {
    const size = Math.floor(Math.random() * 5) + 3;
    const newValues = Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
    setValues(newValues);
    setInputText(newValues.join(', '));
    setTimeout(() => {
      animation.reset();
      animation.play();
    }, 100);
  };

  // Calculate node positions for visualization
  const getNodePosition = (index, totalLevels) => {
    const level = Math.floor(Math.log2(index + 1));
    const levelStart = Math.pow(2, level) - 1;
    const positionInLevel = index - levelStart;
    const nodesInLevel = Math.pow(2, level);
    
    const x = ((positionInLevel + 0.5) / nodesInLevel) * 100;
    const y = (level + 0.5) * (100 / (totalLevels + 1));
    
    return { x, y, level };
  };

  const totalLevels = Math.ceil(Math.log2(values.length + 1));

  return (
    <div className="visualizer-page tree-viz-page">
      <div className="viz-header">
        <Link to="/visualizer/trees" className="back-btn">← Back</Link>
        <div className="viz-title-section">
          <h1 className="viz-title">Binary Tree BFS</h1>
          <span className="viz-tag">Level Order Traversal</span>
        </div>
      </div>

      <div className="viz-content">
        <div className="viz-main">
          <div className="input-section">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter values (use 'null' for empty nodes)"
              className="input-field"
            />
            <button onClick={handleVisualize} className="btn-visualize">Visualize</button>
            <button onClick={handleRandom} className="btn-random">Random</button>
          </div>

          {/* Tree Visualization */}
          <div className="tree-container">
            <svg className="tree-svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
              {/* Draw edges first */}
              {values.map((val, idx) => {
                if (val === null) return null;
                const pos = getNodePosition(idx, totalLevels);
                const leftIdx = 2 * idx + 1;
                const rightIdx = 2 * idx + 2;
                
                return (
                  <g key={`edges-${idx}`}>
                    {leftIdx < values.length && values[leftIdx] !== null && (
                      <line
                        x1={`${pos.x}%`}
                        y1={`${pos.y}%`}
                        x2={`${getNodePosition(leftIdx, totalLevels).x}%`}
                        y2={`${getNodePosition(leftIdx, totalLevels).y}%`}
                        className="tree-edge"
                      />
                    )}
                    {rightIdx < values.length && values[rightIdx] !== null && (
                      <line
                        x1={`${pos.x}%`}
                        y1={`${pos.y}%`}
                        x2={`${getNodePosition(rightIdx, totalLevels).x}%`}
                        y2={`${getNodePosition(rightIdx, totalLevels).y}%`}
                        className="tree-edge"
                      />
                    )}
                  </g>
                );
              })}
              
              {/* Draw nodes */}
              {values.map((val, idx) => {
                if (val === null) return null;
                const pos = getNodePosition(idx, totalLevels);
                const isVisited = currentState.visited?.includes(idx);
                const isCurrent = currentState.current === idx;
                const inQueue = currentState.queue?.includes(idx);
                
                return (
                  <g key={idx} className="tree-node-group">
                    <circle
                      cx={`${pos.x}%`}
                      cy={`${pos.y}%`}
                      r="4"
                      className={`tree-node ${isVisited ? 'visited' : ''} ${isCurrent ? 'current' : ''} ${inQueue ? 'in-queue' : ''}`}
                    />
                    <text
                      x={`${pos.x}%`}
                      y={`${pos.y}%`}
                      className="tree-node-text"
                      dominantBaseline="middle"
                      textAnchor="middle"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Queue Display */}
          <div className="queue-display">
            <span className="queue-label">Queue: </span>
            <span className="queue-items">
              [{currentState.queue?.map(id => values[id]).join(', ') || ''}]
            </span>
          </div>

          <div className="message-display">{currentState.message}</div>

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
          <AskTutorButton topic="BFS Tree Traversal" />
          <CodePanel code={bfsCode} currentLine={currentState.codeLine} title="BFS Algorithm" />
        </div>
      </div>

      <div className="viz-info">
        <h3>About BFS (Level Order)</h3>
        <p>
          BFS visits nodes level by level, using a queue to track nodes to visit.
          It processes all nodes at depth d before nodes at depth d+1.
        </p>
        <div className="complexity-badges">
          <span className="badge time">Time: O(n)</span>
          <span className="badge space">Space: O(n)</span>
        </div>
      </div>
    </div>
  );
};

export default BinaryTreeBFS;
