import React, { useState, useMemo } from 'react';
import { Link } from 'react-router';
import useAnimation from '../../hooks/useAnimation';
import { generateSudokuSteps, sudokuCode, defaultSudoku } from '../../algorithms/recursion';
import AnimationControls from '../common/AnimationControls';
import CodePanel from '../common/CodePanel';
import StatePanel from '../common/StatePanel';
import AskTutorButton from '../common/AskTutorButton';
import './SudokuViz.css';

/**
 * Sudoku Solver Visualizer
 * Interactive visualization of the backtracking algorithm for Sudoku
 */
const SudokuViz = () => {
  const [puzzle, setPuzzle] = useState(defaultSudoku);

  // Generate animation steps
  const steps = useMemo(() => {
    return generateSudokuSteps(puzzle);
  }, [puzzle]);

  // Use animation hook
  const animation = useAnimation(steps, 2);
  const currentState = animation.currentState || {};

  const easyPuzzle = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
  ];

  const mediumPuzzle = [
    [0, 0, 0, 2, 6, 0, 7, 0, 1],
    [6, 8, 0, 0, 7, 0, 0, 9, 0],
    [1, 9, 0, 0, 0, 4, 5, 0, 0],
    [8, 2, 0, 1, 0, 0, 0, 4, 0],
    [0, 0, 4, 6, 0, 2, 9, 0, 0],
    [0, 5, 0, 0, 0, 3, 0, 2, 8],
    [0, 0, 9, 3, 0, 0, 0, 7, 4],
    [0, 4, 0, 0, 5, 0, 0, 3, 6],
    [7, 0, 3, 0, 1, 8, 0, 0, 0]
  ];

  const handlePreset = (preset) => {
    const puzzles = {
      easy: easyPuzzle,
      medium: mediumPuzzle
    };
    setPuzzle(puzzles[preset]);
    setTimeout(() => {
      animation.reset();
      animation.play();
    }, 100);
  };

  const handleReset = () => {
    setPuzzle(defaultSudoku);
    animation.reset();
  };

  const renderBoard = () => {
    const board = currentState.board || puzzle;
    const original = currentState.original || puzzle;
    const currentCell = currentState.currentCell;
    const tryingNumber = currentState.tryingNumber;
    const conflicts = currentState.conflicts || [];

    return (
      <div className="sudoku-board">
        {board.map((row, i) => (
          <div key={i} className="sudoku-row">
            {row.map((cell, j) => {
              const isOriginal = original[i][j] !== 0;
              const isCurrent = currentCell && currentCell[0] === i && currentCell[1] === j;
              const isConflict = conflicts.some(c => c[0] === i && c[1] === j);
              const isInSameBox = currentCell && 
                Math.floor(i / 3) === Math.floor(currentCell[0] / 3) && 
                Math.floor(j / 3) === Math.floor(currentCell[1] / 3);
              const isInSameRow = currentCell && i === currentCell[0];
              const isInSameCol = currentCell && j === currentCell[1];

              let cellClass = 'sudoku-cell';
              if (isOriginal) cellClass += ' original';
              if (isCurrent) cellClass += ' current';
              if (isConflict) cellClass += ' conflict';
              if ((isInSameRow || isInSameCol || isInSameBox) && !isCurrent) {
                cellClass += ' highlight';
              }
              
              // Box borders
              if (j % 3 === 0 && j !== 0) cellClass += ' left-border';
              if (i % 3 === 0 && i !== 0) cellClass += ' top-border';

              return (
                <div key={`${i}-${j}`} className={cellClass}>
                  <span className={cell === 0 ? 'empty' : ''}>
                    {cell === 0 ? '' : cell}
                  </span>
                  {isCurrent && tryingNumber && (
                    <span className="trying-number">{tryingNumber}</span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
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

  const countEmpty = () => {
    return puzzle.flat().filter(c => c === 0).length;
  };

  const countFilled = () => {
    const board = currentState.board || puzzle;
    return board.flat().filter(c => c !== 0).length;
  };

  return (
    <div className="visualizer-page">
      {/* Header */}
      <div className="viz-header">
        <Link to="/visualizer/recursion" className="back-btn">
          ← Back
        </Link>
        <div className="viz-title-section">
          <h1 className="viz-title">🔢 Sudoku Solver</h1>
          <span className="viz-tag">Backtracking</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="viz-content">
        {/* Left: Visualization */}
        <div className="viz-main">
          {/* Input Section */}
          <div className="input-section">
            <div className="preset-buttons">
              <button onClick={() => handlePreset('easy')} className="btn-preset">
                Easy Puzzle
              </button>
              <button onClick={() => handlePreset('medium')} className="btn-preset">
                Medium Puzzle
              </button>
            </div>
            <button onClick={handleReset} className="btn-random">
              Reset
            </button>
          </div>

          {/* Status Message */}
          <div className="status-message" style={{ borderColor: getStatusColor() }}>
            <span className="status-icon">
              {currentState.status === 'solved' && '🎉'}
              {currentState.status === 'conflict' && '❌'}
              {currentState.status === 'backtrack' && '↩️'}
              {currentState.status === 'placed' && '✓'}
              {currentState.status === 'trying' && '🔍'}
              {!currentState.status && '🎯'}
            </span>
            <span>{currentState.message || 'Ready to solve'}</span>
          </div>

          {/* Sudoku Board */}
          <div className="sudoku-container">
            {renderBoard()}
          </div>

          {/* Stats */}
          <div className="sudoku-stats">
            <div className="stat-item">
              <span className="stat-label">Cells to Fill:</span>
              <span className="stat-value">{countEmpty()}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Cells Filled:</span>
              <span className="stat-value">{countFilled()}/81</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Trying:</span>
              <span className="stat-value">{currentState.tryingNumber || '-'}</span>
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
          <AskTutorButton topic="Sudoku Solver Algorithm" />
          <CodePanel
            code={sudokuCode}
            currentLine={currentState.codeLine}
            title="Sudoku Algorithm"
          />
          <StatePanel
            state={{
              'Current Cell': currentState.currentCell ? `Row ${currentState.currentCell[0] + 1}, Col ${currentState.currentCell[1] + 1}` : '-',
              'Trying Number': currentState.tryingNumber || '-',
              'Status': currentState.status || 'ready',
              'Conflicts': (currentState.conflicts || []).length
            }}
            title="Current State"
          />
        </div>
      </div>

      {/* Algorithm Info */}
      <div className="viz-info">
        <h3>About Sudoku Solver</h3>
        <p>
          Sudoku is solved using backtracking: we try placing numbers 1-9 in each empty cell, 
          checking if the placement is valid (no duplicates in row, column, or 3×3 box). 
          If we get stuck, we backtrack and try a different number.
        </p>
        <div className="complexity-badges">
          <span className="badge time">Time: O(9^(n×n))</span>
          <span className="badge space">Space: O(n²)</span>
          <span className="badge info">Technique: Backtracking</span>
        </div>
      </div>
    </div>
  );
};

export default SudokuViz;
