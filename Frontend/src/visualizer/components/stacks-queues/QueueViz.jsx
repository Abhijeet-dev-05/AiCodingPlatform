import React, { useState } from 'react';
import { Link } from 'react-router';
import CodePanel from '../common/CodePanel';
import AskTutorButton from '../common/AskTutorButton';
import './QueueViz.css';

const queueCode = [
  'class Queue:',
  '  def enqueue(value):',
  '    queue.append(value)  # Add at rear',
  '  def dequeue():',
  '    if not empty: return queue.pop(0)',
  '    else: raise QueueUnderflow',
  '  def peek():',
  '    return queue[0] if queue else None'
];

/**
 * Queue Visualizer - Real-time Enqueue, Dequeue
 */
const QueueViz = () => {
  const [queue, setQueue] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [lastOperation, setLastOperation] = useState(null);
  const [message, setMessage] = useState('Queue is empty. Enter a value and click Enqueue!');
  const [highlightIndex, setHighlightIndex] = useState(null);
  const [currentLine, setCurrentLine] = useState(null);

  const maxSize = 10;

  const handleEnqueue = () => {
    const val = parseInt(inputValue);
    if (isNaN(val) || val < 1 || val > 99) {
      setMessage('Please enter a valid number (1-99)');
      return;
    }
    
    if (queue.length >= maxSize) {
      setMessage('Queue Overflow! Maximum 10 elements allowed');
      setLastOperation({ type: 'enqueue', value: val, error: true });
      return;
    }

    const newQueue = [...queue, val];
    setQueue(newQueue);
    setInputValue('');
    setLastOperation({ type: 'enqueue', value: val });
    setMessage(`ENQUEUE: Added ${val} to rear. Queue size: ${newQueue.length}`);
    setHighlightIndex(newQueue.length - 1);
    setCurrentLine(2);
    
    setTimeout(() => setHighlightIndex(null), 800);
  };

  const handleDequeue = () => {
    if (queue.length === 0) {
      setMessage('Queue Underflow! Cannot dequeue from empty queue');
      setLastOperation({ type: 'dequeue', value: null, error: true });
      setCurrentLine(5);
      return;
    }

    const dequeuedValue = queue[0];
    setHighlightIndex(0);
    
    setTimeout(() => {
      const newQueue = queue.slice(1);
      setQueue(newQueue);
      setLastOperation({ type: 'dequeue', value: dequeuedValue });
      setMessage(`DEQUEUE: Removed ${dequeuedValue} from front. Queue size: ${newQueue.length}`);
      setHighlightIndex(null);
      setCurrentLine(4);
    }, 300);
  };

  const handlePeek = () => {
    if (queue.length === 0) {
      setMessage('Queue is empty! Nothing to peek');
      setLastOperation({ type: 'peek', value: null });
      return;
    }

    const frontValue = queue[0];
    setLastOperation({ type: 'peek', value: frontValue });
    setMessage(`PEEK: Front element is ${frontValue}`);
    setHighlightIndex(0);
    setCurrentLine(7);
    
    setTimeout(() => setHighlightIndex(null), 1000);
  };

  const handleClear = () => {
    setQueue([]);
    setLastOperation(null);
    setMessage('Queue cleared!');
    setHighlightIndex(null);
    setCurrentLine(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleEnqueue();
    }
  };

  return (
    <div className="visualizer-page queue-viz-page">
      <div className="viz-header">
        <Link to="/visualizer/stacks-queues" className="back-btn">← Back</Link>
        <div className="viz-title-section">
          <h1 className="viz-title">Queue</h1>
          <span className="viz-tag">FIFO Data Structure</span>
        </div>
      </div>

      <div className="viz-content">
        <div className="viz-main">
          <div className="input-section queue-controls">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Value (1-99)"
              className="input-field queue-input"
              min="1"
              max="99"
            />
            <button onClick={handleEnqueue} className="btn-enqueue">Enqueue</button>
            <button onClick={handleDequeue} className="btn-dequeue">Dequeue</button>
            <button onClick={handlePeek} className="btn-peek">Peek</button>
            <button onClick={handleClear} className="btn-reset">Clear</button>
          </div>

          {/* Queue Visualization */}
          <div className="queue-container">
            <div className="queue-visual">
              <div className="queue-labels">
                <span className="front-label">FRONT →</span>
                <span className="rear-label">← REAR</span>
              </div>
              <div className="queue-elements">
                {queue.length === 0 ? (
                  <div className="queue-empty">Queue is empty</div>
                ) : (
                  queue.map((value, idx) => {
                    const isFront = idx === 0;
                    const isRear = idx === queue.length - 1;
                    const isHighlighted = highlightIndex === idx;
                    
                    return (
                      <div
                        key={idx}
                        className={`queue-slot ${isFront ? 'front' : ''} ${isRear ? 'rear' : ''} ${isHighlighted ? 'highlighted' : ''}`}
                      >
                        <span className="queue-value">{value}</span>
                        <span className="queue-index">{idx}</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="operation-info">
              {lastOperation && (
                <div className={`op-badge ${lastOperation.type} ${lastOperation.error ? 'error' : ''}`}>
                  {lastOperation.type.toUpperCase()}
                  {lastOperation.value !== null && lastOperation.value !== undefined && `: ${lastOperation.value}`}
                </div>
              )}
              <div className="message-box">{message}</div>
              <div className="queue-stats">
                <span>Size: {queue.length}</span>
                <span>Capacity: {maxSize}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="viz-sidebar">
          <AskTutorButton topic="Queue" />
          <CodePanel code={queueCode} currentLine={currentLine} title="Queue Operations" />
          
          {/* Queue State */}
          <div className="state-panel">
            <h3 className="state-title">Queue Contents</h3>
            <div className="state-content">
              <p><strong>Queue:</strong> [{queue.join(', ')}]</p>
              <p><strong>Front:</strong> {queue.length > 0 ? queue[0] : 'Empty'}</p>
              <p><strong>Rear:</strong> {queue.length > 0 ? queue[queue.length - 1] : 'Empty'}</p>
              <p><strong>Size:</strong> {queue.length}</p>
              <p><strong>isEmpty:</strong> {queue.length === 0 ? 'true' : 'false'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="viz-info">
        <h3>About Queue (FIFO)</h3>
        <p>
          A Queue is a First-In-First-Out data structure. Elements are added (enqueued)
          at the rear and removed (dequeued) from the front.
        </p>
        <div className="complexity-badges">
          <span className="badge time">Enqueue: O(1)</span>
          <span className="badge time">Dequeue: O(1)</span>
          <span className="badge space">Space: O(n)</span>
        </div>
      </div>
    </div>
  );
};

export default QueueViz;
