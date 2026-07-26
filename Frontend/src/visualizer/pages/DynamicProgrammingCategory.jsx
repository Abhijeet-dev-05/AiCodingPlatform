import React from 'react';
import { Link } from 'react-router';
import './SortingCategory.css';

const algorithms = [
  {
    id: 'knapsack',
    name: '0/1 Knapsack',
    icon: '🎒',
    description: 'Maximize value with weight constraint using a DP table',
    complexity: 'O(n × W)',
    available: true,
  },
  {
    id: 'lcs',
    name: 'Longest Common Subsequence',
    icon: '🔗',
    description: 'Find the longest subsequence common to two sequences',
    complexity: 'O(m × n)',
    available: true,
  },
  {
    id: 'lis',
    name: 'Longest Increasing Subsequence',
    icon: '📈',
    description: 'Find the longest strictly increasing subsequence',
    complexity: 'O(n²) / O(n log n)',
    available: true,
  },
  {
    id: 'matrix-chain',
    name: 'Matrix Chain Multiplication',
    icon: '🔢',
    description: 'Optimal parenthesization for matrix multiplication',
    complexity: 'O(n³)',
    available: false,
  },
  {
    id: 'coin-change',
    name: 'Coin Change',
    icon: '🪙',
    description: 'Minimum coins needed to make a target sum',
    complexity: 'O(n × amount)',
    available: true,
  },
  {
    id: 'edit-distance',
    name: 'Edit Distance',
    icon: '✏️',
    description: 'Minimum operations to convert one string to another',
    complexity: 'O(m × n)',
    available: true,
  },
];

const DynamicProgrammingCategory = () => (
  <div className="sorting-category-page">
    <div className="cat-body">
      <Link to="/visualizer" className="back-link">← Back to Visualizer</Link>

      <div className="cat-hero">
        <span className="cat-hero-icon">🧩</span>
        <h1 className="cat-hero-title">Dynamic Programming</h1>
        <p className="cat-hero-subtitle">
          Solve complex problems by breaking them into overlapping subproblems
        </p>
      </div>

      <div className="algo-grid">
        {algorithms.map((algo) => (
          <Link
            key={algo.id}
            to={algo.available ? `/visualizer/dynamic-programming/${algo.id}` : '#'}
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

export default DynamicProgrammingCategory;
