import React from 'react';
import './StatePanel.css';

/**
 * State Panel Component
 * Shows current algorithm state: variables, pointers, messages
 */
const StatePanel = ({ state = {}, title = "Algorithm State" }) => {
  const { message, i, j, comparing, swapped, sorted, ...rest } = state;

  return (
    <div className="state-panel">
      <h3 className="state-panel-title">{title}</h3>
      
      {/* Current Message */}
      {message && (
        <div className="state-message">
          <span className="message-icon">💡</span>
          <span className="message-text">{message}</span>
        </div>
      )}

      {/* Variables Grid */}
      <div className="state-grid">
        {i !== undefined && i !== null && (
          <div className="state-item">
            <span className="state-label">i</span>
            <span className="state-value pink">{i}</span>
          </div>
        )}
        
        {j !== undefined && j !== null && (
          <div className="state-item">
            <span className="state-label">j</span>
            <span className="state-value teal">{j}</span>
          </div>
        )}

        {comparing && comparing.length > 0 && (
          <div className="state-item wide">
            <span className="state-label">Comparing</span>
            <span className="state-value yellow">[{comparing.join(', ')}]</span>
          </div>
        )}

        {swapped && swapped.length > 0 && (
          <div className="state-item wide">
            <span className="state-label">Swapped</span>
            <span className="state-value teal">[{swapped.join(', ')}]</span>
          </div>
        )}

        {sorted && sorted.length > 0 && (
          <div className="state-item wide">
            <span className="state-label">Sorted Indices</span>
            <span className="state-value green">[{sorted.join(', ')}]</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatePanel;
