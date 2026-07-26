import React from 'react';
import './ArrayBars.css';

/**
 * Array Bars Component
 * Visualizes array as vertical bars with color coding
 */
const ArrayBars = ({ 
  array = [], 
  comparing = [], 
  swapped = [], 
  sorted = [],
  pivot = -1,
  maxValue = null 
}) => {
  const max = maxValue || Math.max(...array, 1);
  
  const getBarColor = (index) => {
    if (sorted.includes(index)) return 'sorted';
    if (swapped.includes(index)) return 'swapped';
    if (comparing.includes(index)) return 'comparing';
    if (pivot === index) return 'pivot';
    return 'default';
  };

  return (
    <div className="array-bars-container">
      <div className="array-bars">
        {array.map((value, index) => (
          <div
            key={index}
            className={`bar-wrapper`}
            style={{ width: `${100 / array.length}%` }}
          >
            <div
              className={`bar ${getBarColor(index)}`}
              style={{
                height: `${(value / max) * 100}%`,
              }}
            >
              <span className="bar-value">{value}</span>
            </div>
            <span className="bar-index">{index}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArrayBars;
