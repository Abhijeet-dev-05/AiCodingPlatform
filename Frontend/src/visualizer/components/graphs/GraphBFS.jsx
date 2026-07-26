import React, { useState, useMemo } from 'react';
import { Link } from 'react-router';
import useAnimation from '../../hooks/useAnimation';
import { generateGraphBFSSteps, graphBFSCode, sampleGraph } from '../../algorithms/graphs';
import CodePanel from '../common/CodePanel';
import AnimationControls from '../common/AnimationControls';
import AskTutorButton from '../common/AskTutorButton';
import './GraphViz.css';
import '../sorting/BubbleSortViz.css';

/**
 * Graph BFS Visualizer
 */
const GraphBFS = () => {
  const [graph] = useState(sampleGraph);
  const [startNode, setStartNode] = useState(0);

  const steps = useMemo(() => generateGraphBFSSteps(graph, startNode), [graph, startNode]);
  const animation = useAnimation(steps, 0.8);
  const currentState = animation.currentState || {};

  const handleVisualize = () => {
    animation.reset();
    animation.play();
  };

  const handleStartNodeChange = (nodeId) => {
    setStartNode(nodeId);
    setTimeout(() => {
      animation.reset();
      animation.play();
    }, 100);
  };

  return (
    <div className="visualizer-page graph-viz-page">
      <div className="viz-header">
        <Link to="/visualizer/graphs" className="back-btn">← Back</Link>
        <div className="viz-title-section">
          <h1 className="viz-title">Graph BFS</h1>
          <span className="viz-tag">Breadth-First Search</span>
        </div>
      </div>

      <div className="viz-content">
        <div className="viz-main">
          <div className="input-section">
            <span className="start-label">Start Node:</span>
            <div className="node-buttons">
              {graph.nodes.map(node => (
                <button
                  key={node}
                  onClick={() => handleStartNodeChange(node)}
                  className={`node-btn ${startNode === node ? 'active' : ''}`}
                >
                  {node}
                </button>
              ))}
            </div>
            <button onClick={handleVisualize} className="btn-visualize">Visualize</button>
          </div>

          {/* Graph Visualization */}
          <div className="graph-container">
            <svg className="graph-svg" viewBox="0 0 100 60" preserveAspectRatio="xMidYMid meet">
              {/* Draw edges */}
              {graph.edges.map(([u, v], idx) => {
                const isCurrentEdge = currentState.currentEdge && 
                  ((currentState.currentEdge[0] === u && currentState.currentEdge[1] === v) ||
                   (currentState.currentEdge[0] === v && currentState.currentEdge[1] === u));
                const isVisitedEdge = currentState.visited?.includes(u) && currentState.visited?.includes(v);
                
                return (
                  <line
                    key={idx}
                    x1={graph.positions[u].x}
                    y1={graph.positions[u].y}
                    x2={graph.positions[v].x}
                    y2={graph.positions[v].y}
                    className={`graph-edge ${isVisitedEdge ? 'visited' : ''} ${isCurrentEdge ? 'current' : ''}`}
                  />
                );
              })}
              
              {/* Draw nodes */}
              {graph.nodes.map(node => {
                const pos = graph.positions[node];
                const isVisited = currentState.visited?.includes(node);
                const isCurrent = currentState.current === node;
                const inQueue = currentState.queue?.includes(node);
                
                return (
                  <g key={node}>
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="5"
                      className={`graph-node ${isVisited ? 'visited' : ''} ${isCurrent ? 'current' : ''} ${inQueue ? 'in-queue' : ''}`}
                    />
                    <text
                      x={pos.x}
                      y={pos.y}
                      className="graph-node-text"
                      dominantBaseline="middle"
                      textAnchor="middle"
                    >
                      {node}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="structure-display">
            <span className="structure-label">Queue: </span>
            <span className="structure-items queue-color">
              [{currentState.queue?.join(', ') || ''}]
            </span>
          </div>

          <div className="message-display">{currentState.message}</div>

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

        <div className="viz-sidebar">
          <AskTutorButton topic="Graph BFS" />
          <CodePanel code={graphBFSCode} currentLine={currentState.codeLine} title="BFS Algorithm" />
          
          <div className="legend-panel">
            <h4>Legend</h4>
            <div className="legend-item"><span className="dot current"></span> Current Node</div>
            <div className="legend-item"><span className="dot visited"></span> Visited</div>
            <div className="legend-item"><span className="dot in-queue"></span> In Queue</div>
          </div>
        </div>
      </div>

      <div className="viz-info">
        <h3>About Graph BFS</h3>
        <p>
          BFS explores all neighbors at current depth before moving to next level.
          Uses a queue for FIFO ordering. Great for finding shortest path in unweighted graphs.
        </p>
        <div className="complexity-badges">
          <span className="badge time">Time: O(V + E)</span>
          <span className="badge space">Space: O(V)</span>
        </div>
      </div>
    </div>
  );
};

export default GraphBFS;
