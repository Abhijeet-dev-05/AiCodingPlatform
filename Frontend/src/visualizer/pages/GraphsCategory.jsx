import React from 'react';
import { Link } from 'react-router';
import './SortingCategory.css';

const algorithms = [
  {
    id: 'graph-bfs',
    name: 'BFS',
    icon: '🔄',
    description: 'Breadth-First Search — explore level by level',
    complexity: 'O(V + E)',
    available: true,
  },
  {
    id: 'graph-dfs',
    name: 'DFS',
    icon: '📍',
    description: 'Depth-First Search — explore deep before wide',
    complexity: 'O(V + E)',
    available: false,
  },
  {
    id: 'dijkstra',
    name: 'Dijkstra',
    icon: '🛤️',
    description: 'Shortest path in weighted graphs using a priority queue',
    complexity: 'O((V+E) log V)',
    available: false,
  },
  {
    id: 'union-find',
    name: 'Union-Find',
    icon: '🔗',
    description: 'Disjoint Set Union with path compression',
    complexity: 'O(α(n))',
    available: false,
  },
];

const GraphsCategory = () => (
  <div className="sorting-category-page">
    <div className="cat-body">
      <Link to="/visualizer" className="back-link">← Back to Visualizer</Link>

      <div className="cat-hero">
        <span className="cat-hero-icon">🔗</span>
        <h1 className="cat-hero-title">Graph Algorithms</h1>
        <p className="cat-hero-subtitle">
          Visualize graph traversal and pathfinding algorithms
        </p>
      </div>

      <div className="algo-grid">
        {algorithms.map((algo) => (
          <Link
            key={algo.id}
            to={algo.available ? `/visualizer/graphs/${algo.id}` : '#'}
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

export default GraphsCategory;
