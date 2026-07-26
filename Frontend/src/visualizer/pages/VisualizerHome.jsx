import React from 'react';
import { Link } from 'react-router';
import './VisualizerHome.css';

/**
 * Visualizer Home Page
 * Landing page with category cards for all DSA topics
 */
const VisualizerHome = () => {
  const categories = [
    {
      id: 'sorting',
      name: 'Sorting Algorithms',
      icon: '📊',
      color: '#ff6b9d',
      description: 'Bubble, Merge, Quick, Heap Sort',
      algorithms: ['bubble-sort', 'merge-sort', 'quick-sort', 'heap-sort'],
      available: true
    },
    {
      id: 'stacks-queues',
      name: 'Stacks & Queues',
      icon: '📚',
      color: '#00e5cc',
      description: 'Stack, Queue, Monotonic Stack',
      algorithms: ['stack', 'queue', 'monotonic-stack'],
      available: true
    },
    {
      id: 'trees',
      name: 'Trees',
      icon: '🌳',
      color: '#22c55e',
      description: 'Binary Tree, BST, Heap, Trie',
      algorithms: ['binary-tree', 'bst', 'heap', 'trie'],
      available: true
    },
    {
      id: 'graphs',
      name: 'Graphs',
      icon: '🔗',
      color: '#a78bfa',
      description: 'BFS, DFS, Dijkstra, Union-Find',
      algorithms: ['bfs', 'dfs', 'dijkstra', 'union-find'],
      available: true
    },
    {
      id: 'dynamic-programming',
      name: 'Dynamic Programming',
      icon: '🧩',
      color: '#ffd93d',
      description: 'Knapsack, LCS, LIS, Matrix DP',
      algorithms: ['knapsack', 'lcs', 'lis', 'matrix-dp'],
      available: true
    },
    {
      id: 'strings',
      name: 'Strings',
      icon: '📝',
      color: '#f97316',
      description: 'Sliding Window, Two Pointers, KMP',
      algorithms: ['sliding-window', 'two-pointers', 'kmp'],
      available: true
    },
    {
      id: 'searching',
      name: 'Searching',
      icon: '🔍',
      color: '#06b6d4',
      description: 'Binary Search, Linear Search',
      algorithms: ['binary-search', 'linear-search'],
      available: true
    },
    {
      id: 'recursion',
      name: 'Recursion & Backtracking',
      icon: '🔄',
      color: '#ec4899',
      description: 'Recursion Tree, Backtracking',
      algorithms: ['recursion', 'backtracking'],
      available: true
    }
  ];

  return (
    <div className="visualizer-home">
      {/* NAVBAR */}
      <div className="viz-home-header">
        <div className="header-top-row">
          <Link to="/" className="home-back-btn">← Back to Home</Link>
          <div className="header-content">
            <h1 className="header-title">DSA Visualizer</h1>
          </div>
          <div className="header-badge">✨ Interactive Learning</div>
        </div>
      </div>

      {/* PAGE BODY */}
      <div className="viz-body">
        <p className="viz-subtitle">
          Master Data Structures &amp; Algorithms with step-by-step visual animations
        </p>

        {/* Categories Grid */}
        <div className="categories-grid">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={cat.available ? `/visualizer/${cat.id}` : '#'}
              className={`category-card ${!cat.available ? 'coming-soon' : ''}`}
              style={{ '--accent-color': cat.color }}
            >
              <span className="card-icon">{cat.icon}</span>
              <h3 className="card-title">{cat.name}</h3>
              <p className="card-desc">{cat.description}</p>
              <div className="card-footer">
                <span className="algo-count">{cat.algorithms.length} algorithms</span>
                {!cat.available && <span className="soon-badge">Coming Soon</span>}
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Access */}
        <div className="quick-access">
          <h2 className="quick-title">🚀 Quick Start — Sorting</h2>
          <div className="quick-links">
            <Link to="/visualizer/sorting/bubble-sort" className="quick-link">
              <span className="quick-icon">🫧</span>
              <span className="quick-name">Bubble Sort</span>
            </Link>
            <Link to="/visualizer/sorting/quick-sort" className="quick-link">
              <span className="quick-icon">⚡</span>
              <span className="quick-name">Quick Sort</span>
            </Link>
            <Link to="/visualizer/sorting/merge-sort" className="quick-link">
              <span className="quick-icon">🔀</span>
              <span className="quick-name">Merge Sort</span>
            </Link>
            <Link to="/visualizer/sorting/heap-sort" className="quick-link">
              <span className="quick-icon">🏔️</span>
              <span className="quick-name">Heap Sort</span>
            </Link>
            <Link to="/visualizer/sorting/selection-sort" className="quick-link">
              <span className="quick-icon">👆</span>
              <span className="quick-name">Selection Sort</span>
            </Link>
            <Link to="/visualizer/sorting/insertion-sort" className="quick-link">
              <span className="quick-icon">📥</span>
              <span className="quick-name">Insertion Sort</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualizerHome;
