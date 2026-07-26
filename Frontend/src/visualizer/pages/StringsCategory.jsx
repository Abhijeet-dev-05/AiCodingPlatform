import React from 'react';
import { Link } from 'react-router';
import './SortingCategory.css';

const algorithms = [
  {
    id: 'sliding-window',
    name: 'Sliding Window',
    icon: '🪟',
    description: 'Find subarrays/substrings with specific properties efficiently',
    complexity: 'O(n)',
    available: true,
  },
  {
    id: 'two-pointers',
    name: 'Two Pointers',
    icon: '👆👆',
    description: 'Traverse from both ends or at different speeds',
    complexity: 'O(n)',
    available: true,
  },
  {
    id: 'kmp',
    name: 'KMP Pattern Matching',
    icon: '🔤',
    description: 'Knuth-Morris-Pratt algorithm for linear-time pattern search',
    complexity: 'O(n + m)',
    available: true,
  },
  {
    id: 'rabin-karp',
    name: 'Rabin-Karp',
    icon: '🔢',
    description: 'Rolling hash based pattern matching',
    complexity: 'O(n + m) avg',
    available: true,
  },
  {
    id: 'z-algorithm',
    name: 'Z Algorithm',
    icon: '📐',
    description: 'Linear time pattern matching using Z-array',
    complexity: 'O(n + m)',
    available: true,
  },
  {
    id: 'manacher',
    name: "Manacher's Algorithm",
    icon: '🔄',
    description: 'Find longest palindromic substring in linear time',
    complexity: 'O(n)',
    available: true,
  },
];

const StringsCategory = () => (
  <div className="sorting-category-page">
    <div className="cat-body">
      <Link to="/visualizer" className="back-link">← Back to Visualizer</Link>

      <div className="cat-hero">
        <span className="cat-hero-icon">📝</span>
        <h1 className="cat-hero-title">String Algorithms</h1>
        <p className="cat-hero-subtitle">
          Master string manipulation, pattern matching, and text processing
        </p>
      </div>

      <div className="algo-grid">
        {algorithms.map((algo) => (
          <Link
            key={algo.id}
            to={algo.available ? `/visualizer/strings/${algo.id}` : '#'}
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

export default StringsCategory;
