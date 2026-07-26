/**
 * Recursion & Backtracking Algorithms
 * Step generators for visualization
 */

// =============================================
// N-QUEENS PROBLEM
// =============================================

export const nQueensCode = `function solveNQueens(n) {
  const board = Array(n).fill().map(() => Array(n).fill('.'));
  const result = [];
  
  function isSafe(row, col) {
    // Check column
    for (let i = 0; i < row; i++) {
      if (board[i][col] === 'Q') return false;
    }
    // Check upper left diagonal
    for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
      if (board[i][j] === 'Q') return false;
    }
    // Check upper right diagonal
    for (let i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
      if (board[i][j] === 'Q') return false;
    }
    return true;
  }
  
  function backtrack(row) {
    if (row === n) {
      result.push(board.map(r => r.join('')));
      return;
    }
    for (let col = 0; col < n; col++) {
      if (isSafe(row, col)) {
        board[row][col] = 'Q';
        backtrack(row + 1);
        board[row][col] = '.'; // Backtrack
      }
    }
  }
  
  backtrack(0);
  return result;
}`;

export function generateNQueensSteps(n = 4) {
    const steps = [];
    const board = Array(n).fill().map(() => Array(n).fill(0));
    const queens = []; // Track queen positions

    steps.push({
        board: JSON.parse(JSON.stringify(board)),
        queens: [...queens],
        currentRow: 0,
        currentCol: null,
        checking: null,
        message: `Starting N-Queens for ${n}x${n} board`,
        codeLine: 1,
        status: 'start',
        conflicts: []
    });

    function isSafe(row, col) {
        // Check column
        for (let i = 0; i < row; i++) {
            if (board[i][col] === 1) return { safe: false, conflict: [i, col] };
        }
        // Check upper left diagonal
        for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
            if (board[i][j] === 1) return { safe: false, conflict: [i, j] };
        }
        // Check upper right diagonal
        for (let i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
            if (board[i][j] === 1) return { safe: false, conflict: [i, j] };
        }
        return { safe: true, conflict: null };
    }

    function solve(row) {
        if (row === n) {
            steps.push({
                board: JSON.parse(JSON.stringify(board)),
                queens: [...queens],
                currentRow: row,
                currentCol: null,
                checking: null,
                message: `✅ Solution found! All ${n} queens placed safely.`,
                codeLine: 27,
                status: 'solved',
                conflicts: []
            });
            return true;
        }

        for (let col = 0; col < n; col++) {
            steps.push({
                board: JSON.parse(JSON.stringify(board)),
                queens: [...queens],
                currentRow: row,
                currentCol: col,
                checking: [row, col],
                message: `Trying queen at row ${row}, column ${col}`,
                codeLine: 31,
                status: 'trying',
                conflicts: []
            });

            const result = isSafe(row, col);

            if (result.safe) {
                board[row][col] = 1;
                queens.push([row, col]);

                steps.push({
                    board: JSON.parse(JSON.stringify(board)),
                    queens: [...queens],
                    currentRow: row,
                    currentCol: col,
                    checking: [row, col],
                    message: `✓ Safe! Placing queen at row ${row}, column ${col}`,
                    codeLine: 33,
                    status: 'placed',
                    conflicts: []
                });

                if (solve(row + 1)) {
                    return true;
                }

                // Backtrack
                board[row][col] = 0;
                queens.pop();

                steps.push({
                    board: JSON.parse(JSON.stringify(board)),
                    queens: [...queens],
                    currentRow: row,
                    currentCol: col,
                    checking: [row, col],
                    message: `↩ Backtracking from row ${row}, column ${col}`,
                    codeLine: 35,
                    status: 'backtrack',
                    conflicts: []
                });
            } else {
                steps.push({
                    board: JSON.parse(JSON.stringify(board)),
                    queens: [...queens],
                    currentRow: row,
                    currentCol: col,
                    checking: [row, col],
                    message: `✗ Conflict at row ${row}, column ${col}`,
                    codeLine: 5,
                    status: 'conflict',
                    conflicts: result.conflict ? [result.conflict] : []
                });
            }
        }
        return false;
    }

    solve(0);

    if (steps[steps.length - 1].status !== 'solved') {
        steps.push({
            board: JSON.parse(JSON.stringify(board)),
            queens: [...queens],
            currentRow: null,
            currentCol: null,
            checking: null,
            message: `No solution exists for ${n}x${n} board`,
            codeLine: 38,
            status: 'no-solution',
            conflicts: []
        });
    }

    return steps;
}

// =============================================
// RAT IN A MAZE
// =============================================

export const ratMazeCode = `function ratInMaze(maze) {
  const n = maze.length;
  const solution = Array(n).fill().map(() => Array(n).fill(0));
  
  function isSafe(x, y) {
    return x >= 0 && x < n && y >= 0 && y < n 
           && maze[x][y] === 1 && solution[x][y] === 0;
  }
  
  function solve(x, y) {
    // Reached destination
    if (x === n - 1 && y === n - 1) {
      solution[x][y] = 1;
      return true;
    }
    
    if (isSafe(x, y)) {
      solution[x][y] = 1;
      
      // Move Down
      if (solve(x + 1, y)) return true;
      // Move Right
      if (solve(x, y + 1)) return true;
      // Backtrack
      solution[x][y] = 0;
      return false;
    }
    return false;
  }
  
  return solve(0, 0) ? solution : null;
}`;

export function generateRatMazeSteps(maze) {
    const n = maze.length;
    const steps = [];
    const solution = Array(n).fill().map(() => Array(n).fill(0));
    const path = [];

    steps.push({
        maze: JSON.parse(JSON.stringify(maze)),
        solution: JSON.parse(JSON.stringify(solution)),
        path: [...path],
        currentPos: null,
        message: `Starting Rat in Maze for ${n}x${n} grid`,
        codeLine: 1,
        status: 'start',
        trying: null
    });

    function isSafe(x, y) {
        return x >= 0 && x < n && y >= 0 && y < n && maze[x][y] === 1 && solution[x][y] === 0;
    }

    function solve(x, y) {
        steps.push({
            maze: JSON.parse(JSON.stringify(maze)),
            solution: JSON.parse(JSON.stringify(solution)),
            path: [...path],
            currentPos: [x, y],
            message: `Checking position (${x}, ${y})`,
            codeLine: 16,
            status: 'checking',
            trying: [x, y]
        });

        // Reached destination
        if (x === n - 1 && y === n - 1 && maze[x][y] === 1) {
            solution[x][y] = 1;
            path.push([x, y]);
            steps.push({
                maze: JSON.parse(JSON.stringify(maze)),
                solution: JSON.parse(JSON.stringify(solution)),
                path: [...path],
                currentPos: [x, y],
                message: `🎉 Reached destination! Path found.`,
                codeLine: 12,
                status: 'solved',
                trying: null
            });
            return true;
        }

        if (isSafe(x, y)) {
            solution[x][y] = 1;
            path.push([x, y]);

            steps.push({
                maze: JSON.parse(JSON.stringify(maze)),
                solution: JSON.parse(JSON.stringify(solution)),
                path: [...path],
                currentPos: [x, y],
                message: `Moving to (${x}, ${y})`,
                codeLine: 17,
                status: 'moving',
                trying: [x, y]
            });

            // Try Down
            steps.push({
                maze: JSON.parse(JSON.stringify(maze)),
                solution: JSON.parse(JSON.stringify(solution)),
                path: [...path],
                currentPos: [x, y],
                message: `Trying to move DOWN from (${x}, ${y})`,
                codeLine: 20,
                status: 'try-down',
                trying: [x + 1, y]
            });

            if (solve(x + 1, y)) return true;

            // Try Right
            steps.push({
                maze: JSON.parse(JSON.stringify(maze)),
                solution: JSON.parse(JSON.stringify(solution)),
                path: [...path],
                currentPos: [x, y],
                message: `Trying to move RIGHT from (${x}, ${y})`,
                codeLine: 22,
                status: 'try-right',
                trying: [x, y + 1]
            });

            if (solve(x, y + 1)) return true;

            // Backtrack
            solution[x][y] = 0;
            path.pop();

            steps.push({
                maze: JSON.parse(JSON.stringify(maze)),
                solution: JSON.parse(JSON.stringify(solution)),
                path: [...path],
                currentPos: [x, y],
                message: `↩ Backtracking from (${x}, ${y})`,
                codeLine: 24,
                status: 'backtrack',
                trying: null
            });

            return false;
        }

        steps.push({
            maze: JSON.parse(JSON.stringify(maze)),
            solution: JSON.parse(JSON.stringify(solution)),
            path: [...path],
            currentPos: [x, y],
            message: `Blocked at (${x}, ${y})`,
            codeLine: 5,
            status: 'blocked',
            trying: [x, y]
        });

        return false;
    }

    const result = solve(0, 0);

    if (!result) {
        steps.push({
            maze: JSON.parse(JSON.stringify(maze)),
            solution: JSON.parse(JSON.stringify(solution)),
            path: [...path],
            currentPos: null,
            message: `No path exists from source to destination`,
            codeLine: 29,
            status: 'no-solution',
            trying: null
        });
    }

    return steps;
}

// Default maze
export const defaultMaze = [
    [1, 0, 0, 0],
    [1, 1, 0, 1],
    [0, 1, 0, 0],
    [1, 1, 1, 1]
];

// =============================================
// SUDOKU SOLVER
// =============================================

export const sudokuCode = `function solveSudoku(board) {
  function isValid(board, row, col, num) {
    // Check row
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === num) return false;
    }
    // Check column
    for (let i = 0; i < 9; i++) {
      if (board[i][col] === num) return false;
    }
    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[boxRow + i][boxCol + j] === num) return false;
      }
    }
    return true;
  }
  
  function solve() {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValid(board, row, col, num)) {
              board[row][col] = num;
              if (solve()) return true;
              board[row][col] = 0; // Backtrack
            }
          }
          return false; // No valid number found
        }
      }
    }
    return true; // Solved
  }
  
  return solve() ? board : null;
}`;

export function generateSudokuSteps(initialBoard) {
    const steps = [];
    const board = JSON.parse(JSON.stringify(initialBoard));
    const original = JSON.parse(JSON.stringify(initialBoard)); // Track original cells

    steps.push({
        board: JSON.parse(JSON.stringify(board)),
        original: original,
        currentCell: null,
        tryingNumber: null,
        message: 'Starting Sudoku Solver',
        codeLine: 1,
        status: 'start',
        conflicts: []
    });

    function isValid(row, col, num) {
        const conflicts = [];

        // Check row
        for (let i = 0; i < 9; i++) {
            if (board[row][i] === num) {
                conflicts.push([row, i]);
            }
        }

        // Check column
        for (let i = 0; i < 9; i++) {
            if (board[i][col] === num) {
                conflicts.push([i, col]);
            }
        }

        // Check 3x3 box
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[boxRow + i][boxCol + j] === num) {
                    conflicts.push([boxRow + i, boxCol + j]);
                }
            }
        }

        return { valid: conflicts.length === 0, conflicts };
    }

    function solve() {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    for (let num = 1; num <= 9; num++) {
                        steps.push({
                            board: JSON.parse(JSON.stringify(board)),
                            original: original,
                            currentCell: [row, col],
                            tryingNumber: num,
                            message: `Trying ${num} at row ${row + 1}, col ${col + 1}`,
                            codeLine: 26,
                            status: 'trying',
                            conflicts: []
                        });

                        const result = isValid(row, col, num);

                        if (result.valid) {
                            board[row][col] = num;

                            steps.push({
                                board: JSON.parse(JSON.stringify(board)),
                                original: original,
                                currentCell: [row, col],
                                tryingNumber: num,
                                message: `✓ Placed ${num} at row ${row + 1}, col ${col + 1}`,
                                codeLine: 27,
                                status: 'placed',
                                conflicts: []
                            });

                            if (solve()) return true;

                            // Backtrack
                            board[row][col] = 0;

                            steps.push({
                                board: JSON.parse(JSON.stringify(board)),
                                original: original,
                                currentCell: [row, col],
                                tryingNumber: null,
                                message: `↩ Backtracking from row ${row + 1}, col ${col + 1}`,
                                codeLine: 29,
                                status: 'backtrack',
                                conflicts: []
                            });
                        } else {
                            steps.push({
                                board: JSON.parse(JSON.stringify(board)),
                                original: original,
                                currentCell: [row, col],
                                tryingNumber: num,
                                message: `✗ ${num} conflicts at row ${row + 1}, col ${col + 1}`,
                                codeLine: 4,
                                status: 'conflict',
                                conflicts: result.conflicts
                            });
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    const result = solve();

    if (result) {
        steps.push({
            board: JSON.parse(JSON.stringify(board)),
            original: original,
            currentCell: null,
            tryingNumber: null,
            message: '🎉 Sudoku Solved!',
            codeLine: 35,
            status: 'solved',
            conflicts: []
        });
    } else {
        steps.push({
            board: JSON.parse(JSON.stringify(board)),
            original: original,
            currentCell: null,
            tryingNumber: null,
            message: 'No solution exists for this Sudoku',
            codeLine: 32,
            status: 'no-solution',
            conflicts: []
        });
    }

    return steps;
}

// Simple default Sudoku puzzle
export const defaultSudoku = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
];

// =============================================
// RECURSION TREE (Fibonacci)
// =============================================

export const recursionTreeCode = `function fibonacci(n) {
  if (n <= 1) {
    return n;
  }
  return fibonacci(n - 1) + fibonacci(n - 2);
}`;

export function generateRecursionTreeSteps(n = 5) {
    const steps = [];
    let nodeId = 0;
    const nodes = [];
    const edges = [];
    const callStack = [];

    function createNode(value, parentId = null, position = 'root') {
        const id = nodeId++;
        const node = {
            id,
            value,
            result: null,
            x: 0,
            y: callStack.length * 80,
            parentId,
            position,
            status: 'pending'
        };
        nodes.push(node);
        if (parentId !== null) {
            edges.push({ from: parentId, to: id });
        }
        return node;
    }

    function computePositions() {
        // Simple tree layout
        const levelCounts = {};
        const levelNodes = {};

        nodes.forEach(node => {
            const level = node.y / 80;
            levelCounts[level] = (levelCounts[level] || 0) + 1;
            if (!levelNodes[level]) levelNodes[level] = [];
            levelNodes[level].push(node);
        });

        Object.entries(levelNodes).forEach(([level, nodesAtLevel]) => {
            const width = nodesAtLevel.length * 80;
            nodesAtLevel.forEach((node, i) => {
                node.x = (i - (nodesAtLevel.length - 1) / 2) * 80;
            });
        });
    }

    function fib(value, parentId = null, position = 'root') {
        const node = createNode(value, parentId, position);
        callStack.push({ id: node.id, value, status: 'calling' });

        steps.push({
            nodes: JSON.parse(JSON.stringify(nodes)),
            edges: [...edges],
            callStack: [...callStack],
            currentNode: node.id,
            message: `Calling fibonacci(${value})`,
            codeLine: 1,
            status: 'calling'
        });

        if (value <= 1) {
            node.result = value;
            node.status = 'returning';
            callStack[callStack.length - 1].status = 'returning';
            callStack[callStack.length - 1].result = value;

            steps.push({
                nodes: JSON.parse(JSON.stringify(nodes)),
                edges: [...edges],
                callStack: [...callStack],
                currentNode: node.id,
                message: `Base case: fibonacci(${value}) = ${value}`,
                codeLine: 3,
                status: 'base-case'
            });

            callStack.pop();
            return value;
        }

        steps.push({
            nodes: JSON.parse(JSON.stringify(nodes)),
            edges: [...edges],
            callStack: [...callStack],
            currentNode: node.id,
            message: `Computing fibonacci(${value - 1}) + fibonacci(${value - 2})`,
            codeLine: 5,
            status: 'computing'
        });

        const left = fib(value - 1, node.id, 'left');
        const right = fib(value - 2, node.id, 'right');

        node.result = left + right;
        node.status = 'complete';

        if (callStack.length > 0) {
            callStack[callStack.length - 1].result = node.result;
            callStack[callStack.length - 1].status = 'complete';
        }

        steps.push({
            nodes: JSON.parse(JSON.stringify(nodes)),
            edges: [...edges],
            callStack: [...callStack],
            currentNode: node.id,
            message: `fibonacci(${value}) = ${left} + ${right} = ${node.result}`,
            codeLine: 5,
            status: 'returning'
        });

        callStack.pop();
        return node.result;
    }

    steps.push({
        nodes: [],
        edges: [],
        callStack: [],
        currentNode: null,
        message: `Starting Fibonacci Recursion Tree for n = ${n}`,
        codeLine: 1,
        status: 'start'
    });

    const result = fib(n);
    computePositions();

    // Update all steps with computed positions
    steps.forEach(step => {
        step.nodes.forEach(node => {
            const updated = nodes.find(n => n.id === node.id);
            if (updated) {
                node.x = updated.x;
                node.y = updated.y;
            }
        });
    });

    steps.push({
        nodes: JSON.parse(JSON.stringify(nodes)),
        edges: [...edges],
        callStack: [],
        currentNode: null,
        message: `✅ Complete! fibonacci(${n}) = ${result}`,
        codeLine: 5,
        status: 'complete'
    });

    return steps;
}
