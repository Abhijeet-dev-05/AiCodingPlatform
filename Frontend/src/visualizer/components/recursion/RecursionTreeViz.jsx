import React, { useState, useMemo } from 'react';
import { Link } from 'react-router';
import useAnimation from '../../hooks/useAnimation';
import { generateRecursionTreeSteps, recursionTreeCode } from '../../algorithms/recursion';
import AnimationControls from '../common/AnimationControls';
import CodePanel from '../common/CodePanel';
import StatePanel from '../common/StatePanel';
import AskTutorButton from '../common/AskTutorButton';
import './RecursionTreeViz.css';

/**
 * Recursion Tree Visualizer
 * Visualizes the recursive call stack for Fibonacci
 */
const RecursionTreeViz = () => {
  const [inputN, setInputN] = useState(5);
  const [inputText, setInputText] = useState('5');

  // Generate animation steps
  const steps = useMemo(() => {
    return generateRecursionTreeSteps(inputN);
  }, [inputN]);

  // Use animation hook
  const animation = useAnimation(steps, 0.8);
  const currentState = animation.currentState || {};

  const handleVisualize = () => {
    const n = parseInt(inputText);
    if (n >= 1 && n <= 7) {
      setInputN(n);
      setTimeout(() => {
        animation.reset();
        animation.play();
      }, 100);
    } else {
      alert('Please enter a number between 1 and 7 (larger values create very large trees)');
    }
  };

  const handlePreset = (n) => {
    setInputText(n.toString());
    setInputN(n);
    setTimeout(() => {
      animation.reset();
      animation.play();
    }, 100);
  };

  const renderTree = () => {
    const nodes = currentState.nodes || [];
    const edges = currentState.edges || [];
    const currentNode = currentState.currentNode;

    if (nodes.length === 0) {
      return (
        <div className="tree-empty">
          <span>🌲</span>
          <p>Click "Visualize" to see the recursion tree</p>
        </div>
      );
    }

    // Calculate SVG dimensions
    const padding = 50;
    const nodeRadius = 25;
    const minX = Math.min(...nodes.map(n => n.x)) - padding;
    const maxX = Math.max(...nodes.map(n => n.x)) + padding;
    const maxY = Math.max(...nodes.map(n => n.y)) + padding;
    const width = Math.max(maxX - minX + nodeRadius * 2, 400);
    const height = maxY + nodeRadius * 2;
    const offsetX = -minX + nodeRadius;

    return (
      <svg 
        className="tree-svg" 
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMin meet"
      >
        {/* Edges */}
        {edges.map((edge, i) => {
          const from = nodes.find(n => n.id === edge.from);
          const to = nodes.find(n => n.id === edge.to);
          if (!from || !to) return null;
          
          return (
            <line
              key={i}
              x1={from.x + offsetX}
              y1={from.y + nodeRadius}
              x2={to.x + offsetX}
              y2={to.y + nodeRadius}
              className="tree-edge"
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const isCurrent = node.id === currentNode;
          const isComplete = node.status === 'complete' || node.status === 'returning';
          const isBaseCase = node.result !== null && node.value <= 1;

          let nodeClass = 'tree-node';
          if (isCurrent) nodeClass += ' current';
          if (isComplete) nodeClass += ' complete';
          if (isBaseCase) nodeClass += ' base-case';

          return (
            <g key={node.id} transform={`translate(${node.x + offsetX}, ${node.y + nodeRadius})`}>
              {/* Node circle */}
              <circle
                r={nodeRadius}
                className={nodeClass}
              />
              
              {/* Node label (fib(n)) */}
              <text
                className="node-label"
                dy="-5"
              >
                fib({node.value})
              </text>
              
              {/* Result */}
              {node.result !== null && (
                <text
                  className="node-result"
                  dy="12"
                >
                  = {node.result}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    );
  };

  const renderCallStack = () => {
    const callStack = currentState.callStack || [];
    
    if (callStack.length === 0) {
      return <div className="stack-empty">Call stack is empty</div>;
    }

    return (
      <div className="call-stack">
        {callStack.map((call, i) => (
          <div 
            key={i} 
            className={`stack-frame ${call.status}`}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <span className="frame-func">fib({call.value})</span>
            {call.result !== undefined && (
              <span className="frame-result">→ {call.result}</span>
            )}
          </div>
        )).reverse()}
      </div>
    );
  };

  const getStatusColor = () => {
    switch (currentState.status) {
      case 'complete': return 'var(--accent-success)';
      case 'base-case': return 'var(--accent-info)';
      case 'returning': return 'var(--accent-secondary)';
      case 'calling': return 'var(--accent-primary)';
      default: return 'var(--accent-primary)';
    }
  };

  return (
    <div className="visualizer-page">
      {/* Header */}
      <div className="viz-header">
        <Link to="/visualizer/recursion" className="back-btn">
          ← Back
        </Link>
        <div className="viz-title-section">
          <h1 className="viz-title">🌲 Recursion Tree</h1>
          <span className="viz-tag">Fibonacci</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="viz-content">
        {/* Left: Visualization */}
        <div className="viz-main">
          {/* Input Section */}
          <div className="input-section">
            <div className="input-group">
              <label>Fibonacci(n):</label>
              <input
                type="number"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                min="1"
                max="7"
                className="input-field small"
              />
            </div>
            <button onClick={handleVisualize} className="btn-visualize">
              Visualize
            </button>
            <div className="preset-buttons">
              {[3, 4, 5, 6, 7].map(n => (
                <button
                  key={n}
                  onClick={() => handlePreset(n)}
                  className={`btn-preset ${inputN === n ? 'active' : ''}`}
                >
                  n={n}
                </button>
              ))}
            </div>
          </div>

          {/* Status Message */}
          <div className="status-message" style={{ borderColor: getStatusColor() }}>
            <span className="status-icon">
              {currentState.status === 'complete' && '✅'}
              {currentState.status === 'base-case' && '🎯'}
              {currentState.status === 'returning' && '↩️'}
              {currentState.status === 'calling' && '📞'}
              {currentState.status === 'computing' && '🔄'}
              {!currentState.status && '🌲'}
            </span>
            <span>{currentState.message || 'Ready to visualize'}</span>
          </div>

          {/* Tree Visualization */}
          <div className="tree-container">
            {renderTree()}
          </div>

          {/* Call Stack */}
          <div className="stack-section">
            <h4>Call Stack</h4>
            {renderCallStack()}
          </div>

          {/* Controls */}
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

        {/* Right: Code & State */}
        <div className="viz-sidebar">
          <AskTutorButton topic="Recursion and Fibonacci" />
          <CodePanel
            code={recursionTreeCode}
            currentLine={currentState.codeLine}
            title="Fibonacci Recursion"
          />
          <StatePanel
            state={{
              'Input N': inputN,
              'Current Call': currentState.currentNode !== undefined 
                ? `Node ${currentState.currentNode}` 
                : '-',
              'Stack Depth': (currentState.callStack || []).length,
              'Status': currentState.status || 'ready'
            }}
            title="Current State"
          />
        </div>
      </div>

      {/* Algorithm Info */}
      <div className="viz-info">
        <h3>About Recursion Tree</h3>
        <p>
          A recursion tree shows how recursive calls branch out. For Fibonacci, each call 
          spawns two more calls (except base cases). This visualization shows why naive 
          Fibonacci recursion has O(2^n) time complexity - many subproblems are computed multiple times.
        </p>
        <div className="complexity-badges">
          <span className="badge time">Time: O(2^n)</span>
          <span className="badge space">Space: O(n)</span>
          <span className="badge info">Concept: Recursion</span>
        </div>
      </div>
    </div>
  );
};

export default RecursionTreeViz;
