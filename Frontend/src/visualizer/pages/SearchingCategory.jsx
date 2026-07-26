import React from 'react';
import { Link } from 'react-router';
import './SortingCategory.css';

const algorithms = [
  {
    id: 'binary-search',
    name: 'Binary Search',
    icon: '🎯',
    description: 'Efficiently find elements in sorted arrays by halving search space',
    complexity: 'O(log n)',
    available: true,
  },
  {
    id: 'linear-search',
    name: 'Linear Search',
    icon: '👀',
    description: 'Simple sequential search through all elements',
    complexity: 'O(n)',
    available: true,
  },
  {
    id: 'jump-search',
    name: 'Jump Search',
    icon: '🦘',
    description: 'Search by jumping ahead in fixed block steps',
    complexity: 'O(√n)',
    available: false,
  },
  {
    id: 'interpolation-search',
    name: 'Interpolation Search',
    icon: '📊',
    description: 'Improved binary search for uniformly distributed data',
    complexity: 'O(log log n)',
    available: false,
  },
  {
    id: 'exponential-search',
    name: 'Exponential Search',
    icon: '📈',
    description: 'Find range then binary search — great for unbounded arrays',
    complexity: 'O(log n)',
    available: false,
  },
];

const SearchingCategory = () => (
  <div className="sorting-category-page">
    <div className="cat-body">
      <Link to="/visualizer" className="back-link">← Back to Visualizer</Link>

      <div className="cat-hero">
        <span className="cat-hero-icon">🔍</span>
        <h1 className="cat-hero-title">Searching Algorithms</h1>
        <p className="cat-hero-subtitle">
          Find elements efficiently with various search techniques
        </p>
      </div>

      <div className="algo-grid">
        {algorithms.map((algo) => (
          <Link
            key={algo.id}
            to={algo.available ? `/visualizer/searching/${algo.id}` : '#'}
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

export default SearchingCategory;
