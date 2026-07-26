import React from 'react';
import { Link } from 'react-router';
import './SortingCategory.css';

const algorithms = [
  {
    id: 'stack',
    name: 'Stack (LIFO)',
    icon: '📚',
    description: 'Last In First Out — Push, Pop, Peek operations',
    complexity: 'O(1)',
    available: true,
  },
  {
    id: 'queue',
    name: 'Queue (FIFO)',
    icon: '🚶‍♂️',
    description: 'First In First Out — Enqueue, Dequeue operations',
    complexity: 'O(1)',
    available: true,
  },
  {
    id: 'monotonic-stack',
    name: 'Monotonic Stack',
    icon: '📈',
    description: 'Next Greater Element, Stock Span problems',
    complexity: 'O(n)',
    available: false,
  },
];

const StacksQueuesCategory = () => (
  <div className="sorting-category-page">
    <div className="cat-body">
      <Link to="/visualizer" className="back-link">← Back to Visualizer</Link>

      <div className="cat-hero">
        <span className="cat-hero-icon">📚</span>
        <h1 className="cat-hero-title">Stacks &amp; Queues</h1>
        <p className="cat-hero-subtitle">
          Explore fundamental data structures with push, pop, enqueue, dequeue
        </p>
      </div>

      <div className="algo-grid">
        {algorithms.map((algo) => (
          <Link
            key={algo.id}
            to={algo.available ? `/visualizer/stacks-queues/${algo.id}` : '#'}
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

export default StacksQueuesCategory;
