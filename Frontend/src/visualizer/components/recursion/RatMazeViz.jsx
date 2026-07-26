import React, { useState, useMemo } from 'react';
import { Link } from 'react-router';
import useAnimation from '../../hooks/useAnimation';
import { generateRatMazeSteps, ratMazeCode, defaultMaze } from '../../algorithms/recursion';
import AnimationControls from '../common/AnimationControls';
import CodePanel from '../common/CodePanel';
import StatePanel from '../common/StatePanel';
import AskTutorButton from '../common/AskTutorButton';
import './RatMazeViz.css';

/**
 * Rat in a Maze Visualizer
 * Interactive visualization of maze pathfinding with backtracking
 */
const RatMazeViz = () => {
  const [maze, setMaze] = useState(defaultMaze);
  const [gridSize, setGridSize] = useState(4);

  // Generate animation steps
  const steps = useMemo(() => {
    return generateRatMazeSteps(maze);
  }, [maze]);

  // Use animation hook
  const animation = useAnimation(steps, 0.8);
  const currentState = animation.currentState || {};

  const generateRandomMaze = (size) => {
    const newMaze = Array(size).fill().map(() => 
      Array(size).fill().map(() => Math.random() > 0.3 ? 1 : 0)
    );
    // Ensure start and end are open
    newMaze[0][0] = 1;
    newMaze[size - 1][size - 1] = 1;
    // Create at least one path
    for (let i = 0; i < size; i++) {
      if (Math.random() > 0.5) newMaze[i][i] = 1;
    }
    return newMaze;
  };

  const handleRandomMaze = () => {
    const newMaze = generateRandomMaze(gridSize);
    setMaze(newMaze);
    setTimeout(() => {
      animation.reset();
      animation.play();
    }, 100);
  };

  const handlePresetMaze = (preset) => {
    const presets = {
      easy: [
        [1, 1, 1, 1],
        [0, 0, 0, 1],
        [0, 0, 0, 1],
        [0, 0, 0, 1]
      ],
      medium: [
        [1, 0, 0, 0],
        [1, 1, 0, 1],
        [0, 1, 0, 0],
        [1, 1, 1, 1]
      ],
      hard: [
        [1, 1, 1, 0, 0],
        [0, 0, 1, 1, 0],
        [0, 0, 0, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 0, 1, 1]
      ]
    };
    const newMaze = presets[preset];
    setGridSize(newMaze.length);
    setMaze(newMaze);
    setTimeout(() => {
      animation.reset();
      animation.play();
    }, 100);
  };

  const toggleCell = (row, col) => {
    // Don't toggle start or end
    if ((row === 0 && col === 0) || (row === maze.length - 1 && col === maze.length - 1)) {
      return;
    }
    const newMaze = maze.map((r, i) => 
      r.map((c, j) => (i === row && j === col) ? (c === 1 ? 0 : 1) : c)
    );
    setMaze(newMaze);
  };

  const renderMaze = () => {
    const displayMaze = currentState.maze || maze;
    const solution = currentState.solution || [];
    const path = currentState.path || [];
    const currentPos = currentState.currentPos;
    const trying = currentState.trying;

    return (
      <div className="maze-grid" style={{ gridTemplateColumns: `repeat(${displayMaze.length}, 1fr)` }}>
        {displayMaze.map((row, i) =>
          row.map((cell, j) => {
            const isStart = i === 0 && j === 0;
            const isEnd = i === displayMaze.length - 1 && j === displayMaze.length - 1;
            const isBlocked = cell === 0;
            const isInPath = path.some(p => p[0] === i && p[1] === j);
            const isCurrent = currentPos && currentPos[0] === i && currentPos[1] === j;
            const isTrying = trying && trying[0] === i && trying[1] === j;
            const isSolved = currentState.status === 'solved' && isInPath;

            let cellClass = 'maze-cell';
            if (isBlocked) cellClass += ' blocked';
            if (isStart) cellClass += ' start';
            if (isEnd) cellClass += ' end';
            if (isInPath && !isStart && !isEnd) cellClass += ' path';
            if (isCurrent) cellClass += ' current';
            if (isTrying && !isInPath) cellClass += ' trying';
            if (isSolved) cellClass += ' solved';

            return (
              <div 
                key={`${i}-${j}`} 
                className={cellClass}
                onClick={() => toggleCell(i, j)}
              >
                {isStart && <span className="cell-icon">🐭</span>}
                {isEnd && <span className="cell-icon">🧀</span>}
                {isInPath && !isStart && !isEnd && (
                  <span className="path-dot">●</span>
                )}
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
      case 'blocked': return 'var(--accent-error)';
      case 'backtrack': return 'var(--accent-warning)';
      case 'moving': return 'var(--accent-secondary)';
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
          <h1 className="viz-title">🐭 Rat in a Maze</h1>
          <span className="viz-tag">Backtracking</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="viz-content">
        {/* Left: Visualization */}
        <div className="viz-main">
          {/* Input Section */}
          <div className="input-section">
            <button onClick={handleRandomMaze} className="btn-visualize">
              Random Maze
            </button>
            <div className="preset-buttons">
              <button onClick={() => handlePresetMaze('easy')} className="btn-preset">
                Easy
              </button>
              <button onClick={() => handlePresetMaze('medium')} className="btn-preset">
                Medium
              </button>
              <button onClick={() => handlePresetMaze('hard')} className="btn-preset">
                Hard
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="maze-instructions">
            <span>💡 Click cells to toggle walls. Rat 🐭 must reach cheese 🧀</span>
          </div>

          {/* Status Message */}
          <div className="status-message" style={{ borderColor: getStatusColor() }}>
            <span className="status-icon">
              {currentState.status === 'solved' && '🎉'}
              {currentState.status === 'blocked' && '🚫'}
              {currentState.status === 'backtrack' && '↩️'}
              {currentState.status === 'moving' && '🐭'}
              {currentState.status === 'try-down' && '⬇️'}
              {currentState.status === 'try-right' && '➡️'}
              {!currentState.status && '🎯'}
            </span>
            <span>{currentState.message || 'Ready to start'}</span>
          </div>

          {/* Maze Visualization */}
          <div className="maze-container">
            {renderMaze()}
          </div>

          {/* Legend */}
          <div className="maze-legend">
            <div className="legend-item">
              <div className="legend-color start"></div>
              <span>Start (Rat)</span>
            </div>
            <div className="legend-item">
              <div className="legend-color end"></div>
              <span>End (Cheese)</span>
            </div>
            <div className="legend-item">
              <div className="legend-color path"></div>
              <span>Path</span>
            </div>
            <div className="legend-item">
              <div className="legend-color blocked"></div>
              <span>Wall</span>
            </div>
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
          <AskTutorButton topic="Rat in a Maze Problem" />
          <CodePanel
            code={ratMazeCode}
            currentLine={currentState.codeLine}
            title="Rat Maze Algorithm"
          />
          <StatePanel
            state={{
              'Grid Size': `${maze.length}x${maze.length}`,
              'Path Length': (currentState.path || []).length,
              'Current Position': currentState.currentPos ? `(${currentState.currentPos[0]}, ${currentState.currentPos[1]})` : '-',
              'Status': currentState.status || 'ready'
            }}
            title="Current State"
          />
        </div>
      </div>

      {/* Algorithm Info */}
      <div className="viz-info">
        <h3>About Rat in a Maze</h3>
        <p>
          The Rat in a Maze problem involves finding a path from source to destination 
          in a maze. The rat can only move right or down. This is solved using backtracking - 
          if a path doesn't lead to the destination, we backtrack and try another path.
        </p>
        <div className="complexity-badges">
          <span className="badge time">Time: O(2^(n²))</span>
          <span className="badge space">Space: O(n²)</span>
          <span className="badge info">Technique: Backtracking</span>
        </div>
      </div>
    </div>
  );
};

export default RatMazeViz;
