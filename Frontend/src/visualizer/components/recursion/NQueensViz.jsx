import React, { useState, useMemo } from 'react';
import { Link } from 'react-router';
import useAnimation from '../../hooks/useAnimation';
import { generateNQueensSteps, nQueensCode } from '../../algorithms/recursion';
import AnimationControls from '../common/AnimationControls';
import CodePanel from '../common/CodePanel';
import StatePanel from '../common/StatePanel';
import AskTutorButton from '../common/AskTutorButton';
import './NQueensViz.css';

/**
 * N-Queens Problem Visualizer
 * Interactive visualization of the backtracking algorithm
 */
const NQueensViz = () => {
  const [boardSize, setBoardSize] = useState(4);
  const [inputSize, setInputSize] = useState('4');

  // Generate animation steps
  const steps = useMemo(() => {
    return generateNQueensSteps(boardSize);
  }, [boardSize]);

  // Use animation hook
  const animation = useAnimation(steps, 0.8);
  const currentState = animation.currentState || {};

  const handleVisualize = () => {
    const size = parseInt(inputSize);
    if (size >= 4 && size <= 8) {
      setBoardSize(size);
      setTimeout(() => {
        animation.reset();
        animation.play();
      }, 100);
    } else {
      alert('Please enter a board size between 4 and 8');
    }
  };

  const handlePreset = (size) => {
    setInputSize(size.toString());
    setBoardSize(size);
    setTimeout(() => {
      animation.reset();
      animation.play();
    }, 100);
  };

  const renderBoard = () => {
    const board = currentState.board || Array(boardSize).fill().map(() => Array(boardSize).fill(0));
    const checking = currentState.checking;
    const conflicts = currentState.conflicts || [];

    return (
      <div className="nqueens-board" style={{ gridTemplateColumns: `repeat(${boardSize}, 1fr)` }}>
        {board.map((row, i) =>
          row.map((cell, j) => {
            const isWhite = (i + j) % 2 === 0;
            const isQueen = cell === 1;
            const isChecking = checking && checking[0] === i && checking[1] === j;
            const isConflict = conflicts.some(c => c[0] === i && c[1] === j);

            let cellClass = `board-cell ${isWhite ? 'white' : 'black'}`;
            if (isChecking) cellClass += ' checking';
            if (isConflict) cellClass += ' conflict';
            if (isQueen) cellClass += ' queen';

            return (
              <div key={`${i}-${j}`} className={cellClass}>
                {isQueen && <span className="queen-icon">👑</span>}
                {isChecking && !isQueen && <span className="checking-icon">?</span>}
              </div>
            );
          })
        )}
      </div>
    );
  };

  const getStatusColor = () => {
    switch (currentState.status) {
      case 'solved': return 'var(--accent-success)';
      case 'conflict': return 'var(--accent-error)';
      case 'backtrack': return 'var(--accent-warning)';
      case 'placed': return 'var(--accent-secondary)';
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
          <h1 className="viz-title">👑 N-Queens Problem</h1>
          <span className="viz-tag">Backtracking</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="viz-content">
        {/* Left: Visualization */}
        <div className="viz-main">
          {/* Input Section */}
          <div className="input-section">
            <div className="input-group">
              <label>Board Size (N):</label>
              <input
                type="number"
                value={inputSize}
                onChange={(e) => setInputSize(e.target.value)}
                min="4"
                max="8"
                className="input-field small"
              />
            </div>
            <button onClick={handleVisualize} className="btn-visualize">
              Visualize
            </button>
            <div className="preset-buttons">
              {[4, 5, 6, 7, 8].map(size => (
                <button
                  key={size}
                  onClick={() => handlePreset(size)}
                  className={`btn-preset ${boardSize === size ? 'active' : ''}`}
                >
                  {size}×{size}
                </button>
              ))}
            </div>
          </div>

          {/* Status Message */}
          <div className="status-message" style={{ borderColor: getStatusColor() }}>
            <span className="status-icon">
              {currentState.status === 'solved' && '✅'}
              {currentState.status === 'conflict' && '❌'}
              {currentState.status === 'backtrack' && '↩️'}
              {currentState.status === 'placed' && '✓'}
              {currentState.status === 'trying' && '🔍'}
              {!currentState.status && '🎯'}
            </span>
            <span>{currentState.message || 'Ready to start'}</span>
          </div>

          {/* Board Visualization */}
          <div className="board-container">
            {renderBoard()}
          </div>

          {/* Queen Counter */}
          <div className="queen-counter">
            <span className="counter-label">Queens Placed:</span>
            <span className="counter-value">
              {(currentState.queens || []).length} / {boardSize}
            </span>
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
          <AskTutorButton topic="N-Queens Problem" />
          <CodePanel
            code={nQueensCode}
            currentLine={currentState.codeLine}
            title="N-Queens Algorithm"
          />
          <StatePanel
            state={{
              'Board Size': boardSize,
              'Queens Placed': (currentState.queens || []).length,
              'Current Row': currentState.currentRow ?? '-',
              'Current Column': currentState.currentCol ?? '-',
              'Status': currentState.status || 'ready'
            }}
            title="Current State"
          />
        </div>
      </div>

      {/* Algorithm Info */}
      <div className="viz-info">
        <h3>About N-Queens Problem</h3>
        <p>
          The N-Queens puzzle is the problem of placing N chess queens on an N×N 
          chessboard so that no two queens threaten each other. This means no two 
          queens can share the same row, column, or diagonal.
        </p>
        <div className="complexity-badges">
          <span className="badge time">Time: O(N!)</span>
          <span className="badge space">Space: O(N²)</span>
          <span className="badge info">Technique: Backtracking</span>
        </div>
      </div>
    </div>
  );
};

export default NQueensViz;
