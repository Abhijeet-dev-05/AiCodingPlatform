import React from 'react';
import { Link } from 'react-router';
import './SortingCategory.css';

const algorithms = [
  {
    id: 'binary-tree-bfs',
    name: 'BFS (Level Order)',
    icon: '🔄',
    description: 'Traverse a tree level by level using a queue',
    complexity: 'O(n)',
    available: true,
  },
  {
    id: 'binary-tree-dfs',
    name: 'DFS (Inorder)',
    icon: '📍',
    description: 'Left → Root → Right recursive traversal',
    complexity: 'O(n)',
    available: false,
  },
  {
    id: 'bst',
    name: 'Binary Search Tree',
    icon: '🔍',
    description: 'Insert, Search, Delete operations with O(log n) average',
    complexity: 'O(log n)',
    available: false,
  },
  {
    id: 'heap',
    name: 'Heap Operations',
    icon: '🏔️',
    description: 'Heapify, Insert, ExtractMax with visual DP table',
    complexity: 'O(log n)',
    available: false,
  },
];

const TreesCategory = () => (
  <div className="sorting-category-page">
    <div className="cat-body">
      <Link to="/visualizer" className="back-link">← Back to Visualizer</Link>

      <div className="cat-hero">
        <span className="cat-hero-icon">🌳</span>
        <h1 className="cat-hero-title">Tree Algorithms</h1>
        <p className="cat-hero-subtitle">
          Visualize tree structures and traversal algorithms
        </p>
      </div>

      <div className="algo-grid">
        {algorithms.map((algo) => (
          <Link
            key={algo.id}
            to={algo.available ? `/visualizer/trees/${algo.id}` : '#'}
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

export default TreesCategory;
