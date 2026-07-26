import React, { useState } from 'react';
import './GeminiTutorModal.css';

// Algorithm explanations database
const explanations = {
  'BFS Tree Traversal': {
    title: 'Breadth-First Search (BFS)',
    content: `BFS explores a tree level by level, visiting all nodes at depth d before moving to depth d+1.

**How it works:**
1. Start from the root node
2. Add root to a queue
3. While queue is not empty:
   - Dequeue a node and visit it
   - Enqueue all its children (left, then right)

**Key Properties:**
• Uses a Queue (FIFO) data structure
• Visits nodes in level order
• Great for finding shortest path in unweighted graphs
• Memory usage: O(w) where w is maximum width of tree`,
    tips: ['Queue ensures FIFO order', 'Level-order traversal is another name for BFS', 'Used in shortest path algorithms']
  },
  'Graph BFS': {
    title: 'Graph Breadth-First Search',
    content: `BFS on graphs explores all neighbors at the current depth before moving deeper.

**Algorithm:**
1. Start from source node, mark as visited
2. Add source to queue
3. While queue not empty:
   - Dequeue node, process it
   - For each unvisited neighbor: mark visited, enqueue

**Applications:**
• Shortest path in unweighted graphs
• Web crawlers
• Social network friend suggestions
• GPS navigation`,
    tips: ['Mark nodes visited BEFORE enqueueing to avoid duplicates', 'Time: O(V+E)', 'Space: O(V)']
  },
  'Bubble Sort': {
    title: 'Bubble Sort Algorithm',
    content: `Bubble Sort repeatedly swaps adjacent elements if they're in wrong order.

**How it works:**
1. Compare adjacent elements
2. Swap if left > right
3. Repeat for all pairs
4. Largest element "bubbles" to end
5. Repeat n-1 times

**Optimization:** If no swaps in a pass, array is sorted!`,
    tips: ['Simple but inefficient: O(n²)', 'Best case O(n) if array is sorted', 'Stable sort - equal elements maintain order']
  },
  'Quick Sort': {
    title: 'Quick Sort Algorithm',
    content: `Quick Sort uses divide-and-conquer by picking a pivot and partitioning.

**Steps:**
1. Choose a pivot element
2. Partition: elements < pivot go left, > pivot go right
3. Recursively sort left and right subarrays

**Pivot Selection:**
• Last element (simple)
• Random (better average case)
• Median-of-three (robust)`,
    tips: ['Average O(n log n), worst O(n²)', 'In-place sorting', 'Not stable', 'Fastest in practice for most inputs']
  },
  'Stack': {
    title: 'Stack (LIFO)',
    content: `A Stack is a Last-In-First-Out data structure.

**Operations:**
• push(x) - Add element to top
• pop() - Remove and return top element
• peek() - View top without removing
• isEmpty() - Check if stack is empty

**Real-world examples:**
• Undo/Redo functionality
• Browser back button
• Function call stack
• Expression evaluation`,
    tips: ['All operations are O(1)', 'Think of a stack of plates', 'Used in DFS, backtracking']
  },
  'Queue': {
    title: 'Queue (FIFO)',
    content: `A Queue is a First-In-First-Out data structure.

**Operations:**
• enqueue(x) - Add element at rear
• dequeue() - Remove from front
• peek() - View front element
• isEmpty() - Check if empty

**Real-world examples:**
• Printer queue
• CPU task scheduling
• BFS traversal
• Message queues`,
    tips: ['All operations are O(1)', 'Think of a line at a ticket counter', 'Used in BFS, level-order traversal']
  },
  'Binary Search': {
    title: 'Binary Search Algorithm',
    content: `Binary Search efficiently finds an element in a SORTED array by halving the search space.

**Algorithm:**
1. Set left = 0, right = n-1
2. While left <= right:
   - Calculate mid = (left + right) / 2
   - If arr[mid] == target: Found!
   - If arr[mid] < target: search right (left = mid + 1)
   - If arr[mid] > target: search left (right = mid - 1)
3. If loop ends, element not found

**Key Insight:**
Each comparison eliminates HALF of remaining elements!`,
    tips: ['ONLY works on sorted arrays', 'Time: O(log n) - very fast!', 'Space: O(1) iterative, O(log n) recursive', 'Used in: rotated arrays, finding peaks, and more']
  },
  'Linear Search': {
    title: 'Linear Search Algorithm',
    content: `Linear Search is the simplest search - check each element one by one.

**Algorithm:**
1. Start from index 0
2. Compare current element with target
3. If match found, return index
4. If not, move to next element
5. If end reached, element not found

**When to use:**
• Unsorted arrays
• Small datasets
• When simplicity is preferred`,
    tips: ['Works on ANY array (sorted or unsorted)', 'Time: O(n) - checks every element', 'Space: O(1)', 'Best for small arrays or when data is near the beginning']
  },
  'default': {
    title: 'Algorithm Explanation',
    content: 'Select an algorithm from the visualizer to learn more about it!',
    tips: ['Try different algorithms', 'Watch the animations', 'Understand step by step']
  }
};

/**
 * Gemini Tutor Modal - Shows AI-powered algorithm explanations
 */
const GeminiTutorModal = ({ isOpen, onClose, topic = 'default' }) => {
  if (!isOpen) return null;

  const explanation = explanations[topic] || explanations['default'];

  return (
    <div className="tutor-modal-overlay" onClick={onClose}>
      <div className="tutor-modal" onClick={e => e.stopPropagation()}>
        <div className="tutor-header">
          <div className="tutor-icon">✨</div>
          <h2 className="tutor-title">Gemini Tutor</h2>
          <button className="tutor-close" onClick={onClose}>×</button>
        </div>
        
        <div className="tutor-content">
          <h3 className="explanation-title">{explanation.title}</h3>
          <div className="explanation-text">
            {explanation.content.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
          
          {explanation.tips && (
            <div className="tips-section">
              <h4>💡 Quick Tips</h4>
              <ul>
                {explanation.tips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div className="tutor-footer">
          <button className="tutor-close-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default GeminiTutorModal;
