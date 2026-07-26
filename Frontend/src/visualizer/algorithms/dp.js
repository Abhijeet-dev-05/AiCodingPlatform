/**
 * Dynamic Programming Algorithms
 * Step generators for visualization
 */

// =============================================
// 0/1 KNAPSACK PROBLEM
// =============================================

export const knapsackCode = `function knapsack(weights, values, W) {
  const n = weights.length;
  const dp = Array(n + 1).fill().map(() => 
    Array(W + 1).fill(0)
  );
  
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= W; w++) {
      // Don't include item i
      dp[i][w] = dp[i-1][w];
      
      // Include item i if possible
      if (weights[i-1] <= w) {
        dp[i][w] = Math.max(
          dp[i][w],
          dp[i-1][w - weights[i-1]] + values[i-1]
        );
      }
    }
  }
  
  return dp[n][W];
}`;

export function generateKnapsackSteps(weights, values, capacity) {
    const n = weights.length;
    const steps = [];
    const dp = Array(n + 1).fill().map(() => Array(capacity + 1).fill(0));

    steps.push({
        dp: JSON.parse(JSON.stringify(dp)),
        currentCell: null,
        comparing: null,
        items: weights.map((w, i) => ({ weight: w, value: values[i], included: false })),
        message: `Initialize DP table with ${n} items and capacity ${capacity}`,
        codeLine: 3,
        status: 'init',
        i: 0,
        w: 0
    });

    for (let i = 1; i <= n; i++) {
        for (let w = 0; w <= capacity; w++) {
            // Don't include item
            dp[i][w] = dp[i - 1][w];

            steps.push({
                dp: JSON.parse(JSON.stringify(dp)),
                currentCell: [i, w],
                comparing: [[i - 1, w]],
                items: weights.map((wt, idx) => ({ weight: wt, value: values[idx], included: false })),
                message: `Item ${i} (w=${weights[i - 1]}, v=${values[i - 1]}): Not including, dp[${i}][${w}] = dp[${i - 1}][${w}] = ${dp[i - 1][w]}`,
                codeLine: 17,
                status: 'exclude',
                i,
                w
            });

            // Include item if possible
            if (weights[i - 1] <= w) {
                const includeValue = dp[i - 1][w - weights[i - 1]] + values[i - 1];

                if (includeValue > dp[i][w]) {
                    dp[i][w] = includeValue;

                    steps.push({
                        dp: JSON.parse(JSON.stringify(dp)),
                        currentCell: [i, w],
                        comparing: [[i - 1, w - weights[i - 1]]],
                        items: weights.map((wt, idx) => ({ weight: wt, value: values[idx], included: idx === i - 1 })),
                        message: `Including item ${i}: dp[${i}][${w}] = dp[${i - 1}][${w - weights[i - 1]}] + ${values[i - 1]} = ${includeValue} (better!)`,
                        codeLine: 21,
                        status: 'include',
                        i,
                        w
                    });
                }
            }
        }
    }

    // Backtrack to find selected items
    const selected = [];
    let w = capacity;
    for (let i = n; i > 0; i--) {
        if (dp[i][w] !== dp[i - 1][w]) {
            selected.push(i - 1);
            w -= weights[i - 1];
        }
    }

    steps.push({
        dp: JSON.parse(JSON.stringify(dp)),
        currentCell: [n, capacity],
        comparing: null,
        items: weights.map((wt, idx) => ({ weight: wt, value: values[idx], included: selected.includes(idx) })),
        message: `✅ Maximum value: ${dp[n][capacity]}. Items selected: ${selected.map(i => i + 1).join(', ') || 'None'}`,
        codeLine: 29,
        status: 'complete',
        i: n,
        w: capacity,
        result: dp[n][capacity],
        selected
    });

    return steps;
}

// =============================================
// LONGEST COMMON SUBSEQUENCE
// =============================================

export const lcsCode = `function lcs(text1, text2) {
  const m = text1.length, n = text2.length;
  const dp = Array(m + 1).fill().map(() => 
    Array(n + 1).fill(0)
  );
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i-1] === text2[j-1]) {
        dp[i][j] = dp[i-1][j-1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
      }
    }
  }
  
  return dp[m][n];
}`;

export function generateLCSSteps(text1, text2) {
    const m = text1.length;
    const n = text2.length;
    const steps = [];
    const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));

    steps.push({
        dp: JSON.parse(JSON.stringify(dp)),
        text1,
        text2,
        currentCell: null,
        comparing: null,
        message: `Finding LCS of "${text1}" and "${text2}"`,
        codeLine: 1,
        status: 'init',
        i: 0,
        j: 0,
        lcs: ''
    });

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (text1[i - 1] === text2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;

                steps.push({
                    dp: JSON.parse(JSON.stringify(dp)),
                    text1,
                    text2,
                    currentCell: [i, j],
                    comparing: [[i - 1, j - 1]],
                    matchChar: text1[i - 1],
                    message: `Match! '${text1[i - 1]}' = '${text2[j - 1]}'. dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1 = ${dp[i][j]}`,
                    codeLine: 9,
                    status: 'match',
                    i,
                    j
                });
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);

                steps.push({
                    dp: JSON.parse(JSON.stringify(dp)),
                    text1,
                    text2,
                    currentCell: [i, j],
                    comparing: [[i - 1, j], [i, j - 1]],
                    message: `No match: '${text1[i - 1]}' ≠ '${text2[j - 1]}'. dp[${i}][${j}] = max(${dp[i - 1][j]}, ${dp[i][j - 1]}) = ${dp[i][j]}`,
                    codeLine: 11,
                    status: 'no-match',
                    i,
                    j
                });
            }
        }
    }

    // Backtrack to find LCS
    let lcs = '';
    let i = m, j = n;
    const path = [];
    while (i > 0 && j > 0) {
        if (text1[i - 1] === text2[j - 1]) {
            lcs = text1[i - 1] + lcs;
            path.push([i, j]);
            i--;
            j--;
        } else if (dp[i - 1][j] > dp[i][j - 1]) {
            i--;
        } else {
            j--;
        }
    }

    steps.push({
        dp: JSON.parse(JSON.stringify(dp)),
        text1,
        text2,
        currentCell: null,
        comparing: null,
        path,
        lcs,
        message: `✅ LCS Length: ${dp[m][n]}, LCS: "${lcs}"`,
        codeLine: 16,
        status: 'complete',
        result: dp[m][n]
    });

    return steps;
}

// =============================================
// COIN CHANGE PROBLEM
// =============================================

export const coinChangeCode = `function coinChange(coins, amount) {
  const dp = Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  
  for (let coin of coins) {
    for (let i = coin; i <= amount; i++) {
      dp[i] = Math.min(dp[i], dp[i - coin] + 1);
    }
  }
  
  return dp[amount] === Infinity ? -1 : dp[amount];
}`;

export function generateCoinChangeSteps(coins, amount) {
    const steps = [];
    const dp = Array(amount + 1).fill(Infinity);
    dp[0] = 0;

    steps.push({
        dp: dp.map(v => v === Infinity ? '∞' : v),
        coins,
        amount,
        currentCoin: null,
        currentAmount: null,
        message: `Initialize dp array. dp[0] = 0, rest = ∞`,
        codeLine: 2,
        status: 'init'
    });

    for (const coin of coins) {
        steps.push({
            dp: dp.map(v => v === Infinity ? '∞' : v),
            coins,
            amount,
            currentCoin: coin,
            currentAmount: null,
            message: `Processing coin with value ${coin}`,
            codeLine: 5,
            status: 'new-coin'
        });

        for (let i = coin; i <= amount; i++) {
            const oldValue = dp[i];
            const newValue = dp[i - coin] + 1;

            if (newValue < dp[i]) {
                dp[i] = newValue;

                steps.push({
                    dp: dp.map(v => v === Infinity ? '∞' : v),
                    coins,
                    amount,
                    currentCoin: coin,
                    currentAmount: i,
                    comparing: i - coin,
                    message: `dp[${i}] = min(${oldValue === Infinity ? '∞' : oldValue}, dp[${i - coin}] + 1) = ${dp[i]} ✓`,
                    codeLine: 7,
                    status: 'update'
                });
            }
        }
    }

    const result = dp[amount] === Infinity ? -1 : dp[amount];

    // Backtrack to find coins used
    const coinsUsed = [];
    if (result !== -1) {
        let remaining = amount;
        while (remaining > 0) {
            for (const coin of coins) {
                if (remaining >= coin && dp[remaining] === dp[remaining - coin] + 1) {
                    coinsUsed.push(coin);
                    remaining -= coin;
                    break;
                }
            }
        }
    }

    steps.push({
        dp: dp.map(v => v === Infinity ? '∞' : v),
        coins,
        amount,
        currentCoin: null,
        currentAmount: amount,
        coinsUsed,
        message: result === -1
            ? `❌ Cannot make amount ${amount} with given coins`
            : `✅ Minimum coins: ${result}. Coins used: [${coinsUsed.join(', ')}]`,
        codeLine: 10,
        status: 'complete',
        result
    });

    return steps;
}

// =============================================
// EDIT DISTANCE (LEVENSHTEIN)
// =============================================

export const editDistanceCode = `function editDistance(word1, word2) {
  const m = word1.length, n = word2.length;
  const dp = Array(m + 1).fill().map((_, i) => 
    Array(n + 1).fill(0).map((_, j) => i === 0 ? j : j === 0 ? i : 0)
  );
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i-1] === word2[j-1]) {
        dp[i][j] = dp[i-1][j-1]; // No operation
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i-1][j],   // Delete
          dp[i][j-1],   // Insert
          dp[i-1][j-1]  // Replace
        );
      }
    }
  }
  
  return dp[m][n];
}`;

export function generateEditDistanceSteps(word1, word2) {
    const m = word1.length;
    const n = word2.length;
    const steps = [];

    // Initialize DP table
    const dp = Array(m + 1).fill().map((_, i) =>
        Array(n + 1).fill(0).map((_, j) => i === 0 ? j : j === 0 ? i : 0)
    );

    steps.push({
        dp: JSON.parse(JSON.stringify(dp)),
        word1,
        word2,
        currentCell: null,
        operation: null,
        message: `Initialize: Convert "${word1}" to "${word2}"`,
        codeLine: 1,
        status: 'init'
    });

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (word1[i - 1] === word2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];

                steps.push({
                    dp: JSON.parse(JSON.stringify(dp)),
                    word1,
                    word2,
                    currentCell: [i, j],
                    comparing: [[i - 1, j - 1]],
                    operation: 'match',
                    message: `'${word1[i - 1]}' = '${word2[j - 1]}': No operation needed. dp[${i}][${j}] = ${dp[i][j]}`,
                    codeLine: 9,
                    status: 'match'
                });
            } else {
                const deleteOp = dp[i - 1][j];
                const insertOp = dp[i][j - 1];
                const replaceOp = dp[i - 1][j - 1];
                dp[i][j] = 1 + Math.min(deleteOp, insertOp, replaceOp);

                let operation = 'replace';
                if (deleteOp <= insertOp && deleteOp <= replaceOp) operation = 'delete';
                else if (insertOp <= replaceOp) operation = 'insert';

                steps.push({
                    dp: JSON.parse(JSON.stringify(dp)),
                    word1,
                    word2,
                    currentCell: [i, j],
                    comparing: [[i - 1, j], [i, j - 1], [i - 1, j - 1]],
                    operation,
                    message: `'${word1[i - 1]}' ≠ '${word2[j - 1]}': ${operation.toUpperCase()}. dp[${i}][${j}] = 1 + min(${deleteOp}, ${insertOp}, ${replaceOp}) = ${dp[i][j]}`,
                    codeLine: 12,
                    status: 'operation'
                });
            }
        }
    }

    steps.push({
        dp: JSON.parse(JSON.stringify(dp)),
        word1,
        word2,
        currentCell: [m, n],
        operation: null,
        message: `✅ Minimum operations to convert "${word1}" to "${word2}": ${dp[m][n]}`,
        codeLine: 20,
        status: 'complete',
        result: dp[m][n]
    });

    return steps;
}

// =============================================
// LONGEST INCREASING SUBSEQUENCE
// =============================================

export const lisCode = `function lis(nums) {
  const n = nums.length;
  const dp = Array(n).fill(1);
  
  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
  }
  
  return Math.max(...dp);
}`;

export function generateLISSteps(nums) {
    const n = nums.length;
    const steps = [];
    const dp = Array(n).fill(1);

    steps.push({
        nums,
        dp: [...dp],
        currentIndex: null,
        comparingIndex: null,
        message: `Initialize: Each element is LIS of length 1`,
        codeLine: 3,
        status: 'init'
    });

    for (let i = 1; i < n; i++) {
        for (let j = 0; j < i; j++) {
            steps.push({
                nums,
                dp: [...dp],
                currentIndex: i,
                comparingIndex: j,
                message: `Comparing nums[${j}]=${nums[j]} < nums[${i}]=${nums[i]}?`,
                codeLine: 6,
                status: 'comparing'
            });

            if (nums[j] < nums[i]) {
                if (dp[j] + 1 > dp[i]) {
                    dp[i] = dp[j] + 1;

                    steps.push({
                        nums,
                        dp: [...dp],
                        currentIndex: i,
                        comparingIndex: j,
                        message: `Yes! dp[${i}] = max(${dp[i] - 1}, dp[${j}] + 1) = ${dp[i]}`,
                        codeLine: 8,
                        status: 'update'
                    });
                }
            }
        }
    }

    const maxLen = Math.max(...dp);

    // Find one possible LIS
    const lis = [];
    let target = maxLen;
    for (let i = n - 1; i >= 0 && target > 0; i--) {
        if (dp[i] === target && (lis.length === 0 || nums[i] < lis[0])) {
            lis.unshift(nums[i]);
            target--;
        }
    }

    steps.push({
        nums,
        dp: [...dp],
        currentIndex: null,
        comparingIndex: null,
        lis,
        message: `✅ LIS Length: ${maxLen}. One LIS: [${lis.join(', ')}]`,
        codeLine: 12,
        status: 'complete',
        result: maxLen
    });

    return steps;
}

// Default values for testing
export const defaultKnapsack = {
    weights: [1, 2, 3, 4],
    values: [10, 20, 30, 40],
    capacity: 5
};

export const defaultLCS = {
    text1: 'ABCD',
    text2: 'AEBD'
};

export const defaultCoins = {
    coins: [1, 2, 5],
    amount: 11
};

export const defaultEditDistance = {
    word1: 'horse',
    word2: 'ros'
};

export const defaultLIS = {
    nums: [10, 9, 2, 5, 3, 7, 101, 18]
};
