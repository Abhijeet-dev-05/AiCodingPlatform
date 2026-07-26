import React, { useState } from 'react';
import { Link } from 'react-router';
import CodePanel from '../common/CodePanel';
import AskTutorButton from '../common/AskTutorButton';
import './StackViz.css';

const stackCode = [
  'class Stack:',
  '  def push(value):',
  '    stack.append(value)',
  '  def pop():',
  '    if not empty: return stack.pop()',
  '    else: raise StackUnderflow',
  '  def peek():',
  '    return stack[-1] if stack else None'
];

/**
 * Stack Visualizer - Real-time Push, Pop, Peek
 */
const StackViz = () => {
  const [stack, setStack] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [lastOperation, setLastOperation] = useState(null);
  const [message, setMessage] = useState('Stack is empty. Enter a value and click Push!');
  const [highlightIndex, setHighlightIndex] = useState(null);
  const [currentLine, setCurrentLine] = useState(null);

  const maxHeight = 8;

  const handlePush = () => {
    const val = parseInt(inputValue);
    if (isNaN(val) || val < 1 || val > 99) {
      setMessage('Please enter a valid number (1-99)');
      return;
    }
    
    if (stack.length >= maxHeight) {
      setMessage('Stack Overflow! Maximum 8 elements allowed');
      setLastOperation({ type: 'push', value: val, error: true });
      return;
    }

    const newStack = [...stack, val];
    setStack(newStack);
    setInputValue('');
    setLastOperation({ type: 'push', value: val });
    setMessage(`PUSH: Added ${val} to top. Stack size: ${newStack.length}`);
    setHighlightIndex(newStack.length - 1);
    setCurrentLine(2);
    
    setTimeout(() => setHighlightIndex(null), 800);
  };

  const handlePop = () => {
    if (stack.length === 0) {
      setMessage('Stack Underflow! Cannot pop from empty stack');
      setLastOperation({ type: 'pop', value: null, error: true });
      setCurrentLine(5);
      return;
    }

    const poppedValue = stack[stack.length - 1];
    setHighlightIndex(stack.length - 1);
    
    setTimeout(() => {
      const newStack = stack.slice(0, -1);
      setStack(newStack);
      setLastOperation({ type: 'pop', value: poppedValue });
      setMessage(`POP: Removed ${poppedValue} from top. Stack size: ${newStack.length}`);
      setHighlightIndex(null);
      setCurrentLine(4);
    }, 300);
  };

  const handlePeek = () => {
    if (stack.length === 0) {
      setMessage('Stack is empty! Nothing to peek');
      setLastOperation({ type: 'peek', value: null });
      return;
    }

    const topValue = stack[stack.length - 1];
    setLastOperation({ type: 'peek', value: topValue });
    setMessage(`PEEK: Top element is ${topValue}`);
    setHighlightIndex(stack.length - 1);
    setCurrentLine(7);
    
    setTimeout(() => setHighlightIndex(null), 1000);
  };

  const handleClear = () => {
    setStack([]);
    setLastOperation(null);
    setMessage('Stack cleared!');
    setHighlightIndex(null);
    setCurrentLine(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handlePush();
    }
  };

  return (
    <div className="visualizer-page stack-viz-page">
      <div className="viz-header">
        <Link to="/visualizer/stacks-queues" className="back-btn">← Back</Link>
        <div className="viz-title-section">
          <h1 className="viz-title">Stack</h1>
          <span className="viz-tag">LIFO Data Structure</span>
        </div>
      </div>

      <div className="viz-content">
        <div className="viz-main">
          {/* Operation Buttons */}
          <div className="input-section stack-controls">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Value (1-99)"
              className="input-field stack-input"
              min="1"
              max="99"
            />
            <button onClick={handlePush} className="btn-push">Push</button>
            <button onClick={handlePop} className="btn-pop">Pop</button>
            <button onClick={handlePeek} className="btn-peek">Peek</button>
            <button onClick={handleClear} className="btn-reset">Clear</button>
          </div>

          {/* Stack Visualization */}
          <div className="stack-container">
            <div className="stack-visual">
              <div className="stack-label top-label">← TOP</div>
              <div className="stack-elements">
                {Array.from({ length: maxHeight }).map((_, idx) => {
                  const stackIdx = maxHeight - 1 - idx;
                  const value = stack[stackIdx];
                  const isTop = stackIdx === stack.length - 1 && stack.length > 0;
                  const isHighlighted = highlightIndex === stackIdx;
                  
                  return (
                    <div
                      key={idx}
                      className={`stack-slot ${value !== undefined ? 'filled' : 'empty'} ${isTop ? 'top' : ''} ${isHighlighted ? 'highlighted' : ''}`}
                    >
                      {value !== undefined && (
                        <span className="stack-value">{value}</span>
                      )}
                      <span className="stack-index">{stackIdx}</span>
                    </div>
                  );
                })}
              </div>
              <div className="stack-base">STACK BASE</div>
            </div>

            {/* Operation Info */}
            <div className="operation-info">
              {lastOperation && (
                <div className={`op-badge ${lastOperation.type} ${lastOperation.error ? 'error' : ''}`}>
                  {lastOperation.type.toUpperCase()}
                  {lastOperation.value !== null && lastOperation.value !== undefined && `: ${lastOperation.value}`}
                </div>
              )}
              <div className="message-box">{message}</div>
              <div className="stack-stats">
                <span>Size: {stack.length}</span>
                <span>Capacity: {maxHeight}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="viz-sidebar">
          <AskTutorButton topic="Stack" />
          <CodePanel code={stackCode} currentLine={currentLine} title="Stack Operations" />
          
          {/* Stack State */}
          <div className="state-panel">
            <h3 className="state-title">Stack Contents</h3>
            <div className="state-content">
              <p><strong>Stack:</strong> [{stack.join(', ')}]</p>
              <p><strong>Top:</strong> {stack.length > 0 ? stack[stack.length - 1] : 'Empty'}</p>
              <p><strong>Size:</strong> {stack.length}</p>
              <p><strong>isEmpty:</strong> {stack.length === 0 ? 'true' : 'false'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="viz-info">
        <h3>About Stack (LIFO)</h3>
        <p>
          A Stack is a Last-In-First-Out data structure. Elements are added (pushed)
          and removed (popped) from the same end called the "top".
        </p>
        <div className="complexity-badges">
          <span className="badge time">Push: O(1)</span>
          <span className="badge time">Pop: O(1)</span>
          <span className="badge space">Space: O(n)</span>
        </div>
      </div>
    </div>
  );
};

export default StackViz;
