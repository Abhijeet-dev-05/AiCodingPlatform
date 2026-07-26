import React from 'react';
import { Link } from 'react-router';
import './SortingCategory.css';

const algorithms = [
  {
    id: 'recursion-tree',
    name: 'Recursion Tree',
    icon: '🌲',
    description: 'Visualize the recursive call stack and tree structure',
    complexity: 'Varies',
    available: true,
  },
  {
    id: 'n-queens',
    name: 'N-Queens Problem',
    icon: '👑',
    description: 'Place N queens on an N×N board without attacking each other',
    complexity: 'O(N!)',
    available: true,
  },
  {
    id: 'sudoku-solver',
    name: 'Sudoku Solver',
    icon: '🔢',
    description: 'Solve Sudoku puzzles step-by-step using backtracking',
    complexity: 'O(9^(n×n))',
    available: true,
  },
  {
    id: 'rat-maze',
    name: 'Rat in a Maze',
    icon: '🐭',
    description: 'Find all paths from source to destination in a maze',
    complexity: 'O(2^(n²))',
    available: true,
  },
  {
    id: 'subset-sum',
    name: 'Subset Sum',
    icon: '➕',
    description: 'Find all subsets whose elements sum to a target value',
    complexity: 'O(2^n)',
    available: false,
  },
  {
    id: 'permutations',
    name: 'Permutations',
    icon: '🔀',
    description: 'Generate all permutations of given elements',
    complexity: 'O(n!)',
    available: false,
  },
];

const RecursionCategory = () => (
  <div className="sorting-category-page">
    <div className="cat-body">
      <Link to="/visualizer" className="back-link">← Back to Visualizer</Link>

      <div className="cat-hero">
        <span className="cat-hero-icon">🔄</span>
        <h1 className="cat-hero-title">Recursion &amp; Backtracking</h1>
        <p className="cat-hero-subtitle">
          Solve complex problems by breaking them into smaller subproblems
        </p>
      </div>

      <div className="algo-grid">
        {algorithms.map((algo) => (
          <Link
            key={algo.id}
            to={algo.available ? `/visualizer/recursion/${algo.id}` : '#'}
            className={`algo-card${!algo.available ? ' coming-soon' : ''}`}
          >
            <span className="algo-icon">{algo.icon}</span>
            <h3 className="algo-name">{algo.name}</h3>
            <p className="algo-desc">{algo.description}</p>
            <div className="algo-footer">
              <span className="complexity-badge">Time: {algo.complexity}</span>
              {!algo.available && <span className="soon-tag">Coming Soon</span>}
            </div>
            {algo.available && <div className="try-btn">Try Now →</div>}
          </Link>
        ))}
      </div>
    </div>
  </div>
);

export default RecursionCategory;
