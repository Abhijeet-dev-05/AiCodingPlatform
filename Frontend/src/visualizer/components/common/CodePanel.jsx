import React from 'react';
import './CodePanel.css';

/**
 * Code Panel Component
 * Shows pseudocode with current line highlighting
 */
const CodePanel = ({ code = [], currentLine = -1, title = "Pseudocode" }) => {
  // Handle both string and array input
  const codeLines = Array.isArray(code) ? code : (typeof code === 'string' ? code.split('\n') : []);
  
  return (
    <div className="code-panel">
      <h3 className="code-panel-title">{title}</h3>
      <div className="code-content">
        {codeLines.map((line, index) => (
          <div
            key={index}
            className={`code-line ${index + 1 === currentLine ? 'active' : ''}`}
          >
            <span className="line-number">{index + 1}</span>
            <span className="line-content">{line || '\u00A0'}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CodePanel;
