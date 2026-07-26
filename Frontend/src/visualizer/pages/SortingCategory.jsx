import React from 'react';
import { Link } from 'react-router';
import './SortingCategory.css';

const algorithms = [
  {
    id: 'bubble-sort',
    name: 'Bubble Sort',
    icon: '🫧',
    description: 'Repeatedly swap adjacent elements if they are in wrong order',
    complexity: 'O(n²)',
    available: true,
  },
  {
    id: 'quick-sort',
    name: 'Quick Sort',
    icon: '⚡',
    description: 'Pick a pivot and partition the array around it',
    complexity: 'O(n log n)',
    available: true,
  },
  {
    id: 'selection-sort',
    name: 'Selection Sort',
    icon: '👆',
    description: 'Find the minimum element and swap it to the front',
    complexity: 'O(n²)',
    available: true,
  },
  {
    id: 'insertion-sort',
    name: 'Insertion Sort',
    icon: '📥',
    description: 'Build a sorted array one element at a time',
    complexity: 'O(n²)',
    available: true,
  },
  {
    id: 'merge-sort',
    name: 'Merge Sort',
    icon: '🔀',
    description: 'Divide and conquer — split, sort, and merge subarrays',
    complexity: 'O(n log n)',
    available: true,
  },
  {
    id: 'heap-sort',
    name: 'Heap Sort',
    icon: '🏔️',
    description: 'Build a max heap and extract elements one by one',
    complexity: 'O(n log n)',
    available: true,
  },
];

const SortingCategory = () => (
  <div className="sorting-category-page">
    {/* ── BODY ── */}
    <div className="cat-body">
      <Link to="/visualizer" className="back-link">← Back to Visualizer</Link>

      {/* Hero */}
      <div className="cat-hero">
        <span className="cat-hero-icon">📊</span>
        <h1 className="cat-hero-title">Sorting Algorithms</h1>
        <p className="cat-hero-subtitle">
          Visualize how different sorting algorithms work step-by-step
        </p>
      </div>

      {/* Grid */}
      <div className="algo-grid">
        {algorithms.map((algo) => (
          <Link
            key={algo.id}
            to={algo.available ? `/visualizer/sorting/${algo.id}` : '#'}
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

export default SortingCategory;
