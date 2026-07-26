/**
 * String Algorithm Step Generators
 * Each function returns an array of "steps" representing animation frames
 */

// =====================================================
// SLIDING WINDOW - Find max sum subarray of size k
// =====================================================
export const generateSlidingWindowSteps = (arr, k) => {
    const steps = [];
    const n = arr.length;

    if (k > n) {
        steps.push({
            array: arr,
            windowStart: 0,
            windowEnd: 0,
            windowSum: 0,
            maxSum: 0,
            codeLine: 1,
            message: `Error: Window size ${k} is larger than array length ${n}`
        });
        return steps;
    }

    // Initial state
    steps.push({
        array: arr,
        windowStart: null,
        windowEnd: null,
        windowSum: 0,
        maxSum: 0,
        codeLine: 1,
        message: `Starting Sliding Window with array: [${arr.join(', ')}], window size k=${k}`
    });

    // Calculate first window sum
    let windowSum = 0;
    for (let i = 0; i < k; i++) {
        windowSum += arr[i];
        steps.push({
            array: arr,
            windowStart: 0,
            windowEnd: i,
            windowSum: windowSum,
            maxSum: windowSum,
            codeLine: 3,
            message: `Building initial window: adding ${arr[i]}, sum = ${windowSum}`
        });
    }

    let maxSum = windowSum;
    steps.push({
        array: arr,
        windowStart: 0,
        windowEnd: k - 1,
        windowSum: windowSum,
        maxSum: maxSum,
        codeLine: 4,
        message: `Initial window [0..${k - 1}] sum = ${windowSum}, maxSum = ${maxSum}`
    });

    // Slide the window
    for (let i = k; i < n; i++) {
        const removing = arr[i - k];
        const adding = arr[i];

        steps.push({
            array: arr,
            windowStart: i - k,
            windowEnd: i - 1,
            removing: i - k,
            adding: i,
            windowSum: windowSum,
            maxSum: maxSum,
            codeLine: 6,
            message: `Sliding: remove ${removing} from left, add ${adding} from right`
        });

        windowSum = windowSum - removing + adding;
        maxSum = Math.max(maxSum, windowSum);

        steps.push({
            array: arr,
            windowStart: i - k + 1,
            windowEnd: i,
            windowSum: windowSum,
            maxSum: maxSum,
            codeLine: 7,
            message: `Window [${i - k + 1}..${i}] sum = ${windowSum}, maxSum = ${maxSum}`
        });
    }

    steps.push({
        array: arr,
        windowStart: n - k,
        windowEnd: n - 1,
        windowSum: windowSum,
        maxSum: maxSum,
        codeLine: 9,
        message: `Complete! Maximum sum of window size ${k} is ${maxSum}`
    });

    return steps;
};

export const slidingWindowCode = [
    'function maxSumSubarray(arr, k):',
    '  windowSum = 0',
    '  for i = 0 to k-1:',
    '    windowSum += arr[i]',
    '  maxSum = windowSum',
    '  for i = k to n-1:',
    '    windowSum = windowSum - arr[i-k] + arr[i]',
    '    maxSum = max(maxSum, windowSum)',
    '  return maxSum'
];

// =====================================================
// TWO POINTERS - Check if string is palindrome
// =====================================================
export const generateTwoPointersSteps = (str) => {
    const steps = [];
    const chars = str.toLowerCase().replace(/[^a-z0-9]/g, '').split('');
    const n = chars.length;

    steps.push({
        chars: chars,
        left: null,
        right: null,
        comparing: [],
        matched: [],
        codeLine: 1,
        message: `Checking if "${str}" is a palindrome`,
        isPalindrome: null
    });

    let left = 0;
    let right = n - 1;
    const matched = [];

    steps.push({
        chars: chars,
        left: left,
        right: right,
        comparing: [],
        matched: [],
        codeLine: 2,
        message: `Initialize: left = 0, right = ${right}`,
        isPalindrome: null
    });

    while (left < right) {
        steps.push({
            chars: chars,
            left: left,
            right: right,
            comparing: [left, right],
            matched: [...matched],
            codeLine: 4,
            message: `Comparing chars[${left}]='${chars[left]}' with chars[${right}]='${chars[right]}'`,
            isPalindrome: null
        });

        if (chars[left] !== chars[right]) {
            steps.push({
                chars: chars,
                left: left,
                right: right,
                comparing: [left, right],
                matched: [...matched],
                mismatch: [left, right],
                codeLine: 5,
                message: `Mismatch! '${chars[left]}' ≠ '${chars[right]}'. NOT a palindrome.`,
                isPalindrome: false
            });
            return steps;
        }

        matched.push(left, right);
        steps.push({
            chars: chars,
            left: left,
            right: right,
            comparing: [],
            matched: [...matched],
            codeLine: 6,
            message: `Match! '${chars[left]}' = '${chars[right]}'. Moving pointers inward.`,
            isPalindrome: null
        });

        left++;
        right--;
    }

    // If we have a middle character (odd length)
    if (left === right) {
        matched.push(left);
    }

    steps.push({
        chars: chars,
        left: left,
        right: right,
        comparing: [],
        matched: [...matched],
        codeLine: 8,
        message: `All characters matched! "${str}" IS a palindrome.`,
        isPalindrome: true
    });

    return steps;
};

export const twoPointersCode = [
    'function isPalindrome(s):',
    '  left = 0, right = len(s) - 1',
    '  while left < right:',
    '    if s[left] != s[right]:',
    '      return false',
    '    left++, right--',
    '  return true'
];

// =====================================================
// KMP PATTERN MATCHING
// =====================================================
export const generateKMPSteps = (text, pattern) => {
    const steps = [];
    const n = text.length;
    const m = pattern.length;

    steps.push({
        text: text.split(''),
        pattern: pattern.split(''),
        textIndex: null,
        patternIndex: null,
        lps: [],
        matches: [],
        codeLine: 1,
        message: `KMP: Searching for "${pattern}" in "${text}"`
    });

    // Build LPS (Longest Proper Prefix which is also Suffix) array
    const lps = new Array(m).fill(0);
    let len = 0;
    let i = 1;

    steps.push({
        text: text.split(''),
        pattern: pattern.split(''),
        lps: [...lps],
        buildingLPS: true,
        codeLine: 2,
        message: `Building LPS (failure function) array for pattern "${pattern}"`
    });

    while (i < m) {
        steps.push({
            text: text.split(''),
            pattern: pattern.split(''),
            lps: [...lps],
            buildingLPS: true,
            lpsI: i,
            lpsLen: len,
            codeLine: 3,
            message: `LPS: Comparing pattern[${i}]='${pattern[i]}' with pattern[${len}]='${pattern[len]}'`
        });

        if (pattern[i] === pattern[len]) {
            len++;
            lps[i] = len;
            steps.push({
                text: text.split(''),
                pattern: pattern.split(''),
                lps: [...lps],
                buildingLPS: true,
                lpsI: i,
                lpsLen: len,
                codeLine: 4,
                message: `Match! lps[${i}] = ${len}`
            });
            i++;
        } else {
            if (len !== 0) {
                len = lps[len - 1];
                steps.push({
                    text: text.split(''),
                    pattern: pattern.split(''),
                    lps: [...lps],
                    buildingLPS: true,
                    lpsI: i,
                    lpsLen: len,
                    codeLine: 5,
                    message: `Mismatch! Fallback: len = lps[${len}] = ${lps[len] || 0}`
                });
            } else {
                lps[i] = 0;
                i++;
            }
        }
    }

    steps.push({
        text: text.split(''),
        pattern: pattern.split(''),
        lps: [...lps],
        buildingLPS: false,
        codeLine: 6,
        message: `LPS array complete: [${lps.join(', ')}]. Now searching...`
    });

    // Search for pattern
    i = 0;
    let j = 0;
    const matches = [];

    while (i < n) {
        steps.push({
            text: text.split(''),
            pattern: pattern.split(''),
            lps: [...lps],
            textIndex: i,
            patternIndex: j,
            patternOffset: i - j,
            comparing: [i],
            matches: [...matches],
            codeLine: 8,
            message: `Comparing text[${i}]='${text[i]}' with pattern[${j}]='${pattern[j]}'`
        });

        if (text[i] === pattern[j]) {
            i++;
            j++;

            if (j === m) {
                matches.push(i - j);
                steps.push({
                    text: text.split(''),
                    pattern: pattern.split(''),
                    lps: [...lps],
                    textIndex: i - 1,
                    patternIndex: j - 1,
                    patternOffset: i - j,
                    matches: [...matches],
                    matchFound: i - j,
                    codeLine: 10,
                    message: `Pattern FOUND at index ${i - j}!`
                });
                j = lps[j - 1];
            }
        } else {
            if (j !== 0) {
                steps.push({
                    text: text.split(''),
                    pattern: pattern.split(''),
                    lps: [...lps],
                    textIndex: i,
                    patternIndex: j,
                    mismatch: true,
                    codeLine: 11,
                    message: `Mismatch! Using LPS: j = lps[${j - 1}] = ${lps[j - 1]}`
                });
                j = lps[j - 1];
            } else {
                i++;
            }
        }
    }

    steps.push({
        text: text.split(''),
        pattern: pattern.split(''),
        lps: [...lps],
        matches: [...matches],
        codeLine: 13,
        message: matches.length > 0
            ? `Complete! Found ${matches.length} match(es) at indices: [${matches.join(', ')}]`
            : `Complete! Pattern not found in text.`
    });

    return steps;
};

export const kmpCode = [
    'function KMP(text, pattern):',
    '  // Build LPS array',
    '  lps = computeLPS(pattern)',
    '  i = 0, j = 0',
    '  while i < len(text):',
    '    if text[i] == pattern[j]:',
    '      i++, j++',
    '      if j == len(pattern):',
    '        found at index i-j',
    '        j = lps[j-1]',
    '    else:',
    '      if j != 0: j = lps[j-1]',
    '      else: i++'
];

// =====================================================
// RABIN-KARP - Rolling Hash Pattern Matching
// =====================================================
export const generateRabinKarpSteps = (text, pattern) => {
    const steps = [];
    const n = text.length;
    const m = pattern.length;
    const d = 256; // Number of characters in alphabet
    const q = 101; // A prime number for mod

    steps.push({
        text: text.split(''),
        pattern: pattern.split(''),
        windowStart: null,
        patternHash: null,
        textHash: null,
        matches: [],
        codeLine: 1,
        message: `Rabin-Karp: Searching for "${pattern}" in "${text}"`
    });

    if (m > n) {
        steps.push({
            text: text.split(''),
            pattern: pattern.split(''),
            codeLine: 2,
            message: `Pattern longer than text. No match possible.`
        });
        return steps;
    }

    // Calculate hash of pattern and first window
    let patternHash = 0;
    let textHash = 0;
    let h = 1;

    // h = d^(m-1) % q
    for (let i = 0; i < m - 1; i++) {
        h = (h * d) % q;
    }

    // Calculate initial hashes
    for (let i = 0; i < m; i++) {
        patternHash = (d * patternHash + pattern.charCodeAt(i)) % q;
        textHash = (d * textHash + text.charCodeAt(i)) % q;
    }

    steps.push({
        text: text.split(''),
        pattern: pattern.split(''),
        windowStart: 0,
        windowEnd: m - 1,
        patternHash: patternHash,
        textHash: textHash,
        matches: [],
        codeLine: 3,
        message: `Pattern hash = ${patternHash}, Initial text window hash = ${textHash}`
    });

    const matches = [];

    // Slide the pattern over text
    for (let i = 0; i <= n - m; i++) {
        steps.push({
            text: text.split(''),
            pattern: pattern.split(''),
            windowStart: i,
            windowEnd: i + m - 1,
            patternHash: patternHash,
            textHash: textHash,
            comparing: true,
            matches: [...matches],
            codeLine: 5,
            message: `Window [${i}..${i + m - 1}]: textHash=${textHash}, patternHash=${patternHash}`
        });

        // Check if hashes match
        if (patternHash === textHash) {
            // Verify character by character
            let match = true;
            for (let j = 0; j < m; j++) {
                if (text[i + j] !== pattern[j]) {
                    match = false;
                    break;
                }
            }

            if (match) {
                matches.push(i);
                steps.push({
                    text: text.split(''),
                    pattern: pattern.split(''),
                    windowStart: i,
                    windowEnd: i + m - 1,
                    patternHash: patternHash,
                    textHash: textHash,
                    matchFound: i,
                    matches: [...matches],
                    codeLine: 7,
                    message: `Hash match! Character verification passed. Pattern FOUND at index ${i}!`
                });
            } else {
                steps.push({
                    text: text.split(''),
                    pattern: pattern.split(''),
                    windowStart: i,
                    windowEnd: i + m - 1,
                    patternHash: patternHash,
                    textHash: textHash,
                    spuriousHit: true,
                    matches: [...matches],
                    codeLine: 8,
                    message: `Spurious hit! Hash matched but characters differ.`
                });
            }
        }

        // Calculate hash for next window using rolling hash
        if (i < n - m) {
            const oldChar = text.charCodeAt(i);
            const newChar = text.charCodeAt(i + m);
            textHash = (d * (textHash - oldChar * h) + newChar) % q;
            if (textHash < 0) textHash += q;

            steps.push({
                text: text.split(''),
                pattern: pattern.split(''),
                windowStart: i + 1,
                windowEnd: i + m,
                patternHash: patternHash,
                textHash: textHash,
                rolling: true,
                removing: i,
                adding: i + m,
                matches: [...matches],
                codeLine: 10,
                message: `Rolling hash: remove '${text[i]}', add '${text[i + m]}' → new hash = ${textHash}`
            });
        }
    }

    steps.push({
        text: text.split(''),
        pattern: pattern.split(''),
        matches: [...matches],
        patternHash: patternHash,
        codeLine: 12,
        message: matches.length > 0
            ? `Complete! Found ${matches.length} match(es) at indices: [${matches.join(', ')}]`
            : `Complete! Pattern not found in text.`
    });

    return steps;
};

export const rabinKarpCode = [
    'function RabinKarp(text, pattern):',
    '  patternHash = hash(pattern)',
    '  textHash = hash(text[0..m-1])',
    '  for i = 0 to n-m:',
    '    if patternHash == textHash:',
    '      if text[i..i+m-1] == pattern:',
    '        found at index i',
    '    // Rolling hash',
    '    if i < n-m:',
    '      textHash = rehash(textHash, text[i], text[i+m])'
];

// =====================================================
// Z ALGORITHM - Z-array construction
// =====================================================
export const generateZAlgorithmSteps = (str) => {
    const steps = [];
    const n = str.length;
    const z = new Array(n).fill(0);

    steps.push({
        str: str.split(''),
        z: [...z],
        left: null,
        right: null,
        i: null,
        codeLine: 1,
        message: `Z Algorithm: Computing Z-array for "${str}"`
    });

    let left = 0, right = 0;

    for (let i = 1; i < n; i++) {
        steps.push({
            str: str.split(''),
            z: [...z],
            left: left,
            right: right,
            i: i,
            zBox: right > 0 ? { left, right } : null,
            codeLine: 2,
            message: `Processing index ${i}: Z-box is [${left}, ${right}]`
        });

        if (i < right) {
            // Inside Z-box
            const k = i - left;
            if (z[k] < right - i) {
                z[i] = z[k];
                steps.push({
                    str: str.split(''),
                    z: [...z],
                    left: left,
                    right: right,
                    i: i,
                    k: k,
                    zBox: { left, right },
                    codeLine: 4,
                    message: `Inside Z-box: z[${i}] = z[${k}] = ${z[k]} (no extension needed)`
                });
            } else {
                // Need to extend
                left = i;
                steps.push({
                    str: str.split(''),
                    z: [...z],
                    left: left,
                    right: right,
                    i: i,
                    extending: true,
                    codeLine: 5,
                    message: `Z-box boundary case: need to extend from right=${right}`
                });

                while (right < n && str[right - left] === str[right]) {
                    right++;
                }
                z[i] = right - left;

                steps.push({
                    str: str.split(''),
                    z: [...z],
                    left: left,
                    right: right,
                    i: i,
                    zBox: { left, right: right - 1 },
                    codeLine: 6,
                    message: `Extended Z-box: z[${i}] = ${z[i]}, new right = ${right}`
                });
            }
        } else {
            // Outside Z-box, naive comparison
            left = right = i;

            steps.push({
                str: str.split(''),
                z: [...z],
                left: left,
                right: right,
                i: i,
                comparing: true,
                codeLine: 8,
                message: `Outside Z-box: Starting fresh comparison from index ${i}`
            });

            while (right < n && str[right - left] === str[right]) {
                right++;
            }
            z[i] = right - left;

            steps.push({
                str: str.split(''),
                z: [...z],
                left: left,
                right: right,
                i: i,
                zBox: right > left ? { left, right: right - 1 } : null,
                codeLine: 9,
                message: `Computed z[${i}] = ${z[i]}`
            });
        }
    }

    steps.push({
        str: str.split(''),
        z: [...z],
        codeLine: 11,
        message: `Complete! Z-array: [${z.join(', ')}]`
    });

    return steps;
};

export const zAlgorithmCode = [
    'function ZAlgorithm(str):',
    '  z[0] = 0, left = right = 0',
    '  for i = 1 to n-1:',
    '    if i < right:',
    '      z[i] = min(z[i-left], right-i)',
    '    while i+z[i] < n and str[z[i]] == str[i+z[i]]:',
    '      z[i]++',
    '    if i + z[i] > right:',
    '      left = i, right = i + z[i]',
    '  return z'
];

// =====================================================
// MANACHER'S ALGORITHM - Longest Palindromic Substring
// =====================================================
export const generateManacherSteps = (s) => {
    const steps = [];

    // Preprocess: add # between characters
    let t = '#';
    for (const c of s) {
        t += c + '#';
    }

    const n = t.length;
    const p = new Array(n).fill(0);

    steps.push({
        original: s,
        processed: t.split(''),
        p: [...p],
        center: null,
        right: null,
        i: null,
        codeLine: 1,
        message: `Manacher's: Preprocessed "${s}" to "${t}"`
    });

    let center = 0, right = 0;
    let maxLen = 0, maxCenter = 0;

    for (let i = 0; i < n; i++) {
        steps.push({
            original: s,
            processed: t.split(''),
            p: [...p],
            center: center,
            right: right,
            i: i,
            palindromeBoundary: right > 0 ? { center, right } : null,
            codeLine: 3,
            message: `Processing index ${i} ('${t[i]}'): center=${center}, right=${right}`
        });

        // Mirror of i with respect to center
        const mirror = 2 * center - i;

        if (i < right && mirror >= 0) {
            p[i] = Math.min(right - i, p[mirror]);
            steps.push({
                original: s,
                processed: t.split(''),
                p: [...p],
                center: center,
                right: right,
                i: i,
                mirror: mirror,
                codeLine: 4,
                message: `Inside boundary: p[${i}] = min(${right - i}, p[${mirror}]) = ${p[i]}`
            });
        }

        // Expand around center
        steps.push({
            original: s,
            processed: t.split(''),
            p: [...p],
            center: center,
            right: right,
            i: i,
            expanding: true,
            codeLine: 6,
            message: `Trying to expand palindrome around index ${i}`
        });

        while (i + p[i] + 1 < n && i - p[i] - 1 >= 0 && t[i + p[i] + 1] === t[i - p[i] - 1]) {
            p[i]++;
        }

        steps.push({
            original: s,
            processed: t.split(''),
            p: [...p],
            center: center,
            right: right,
            i: i,
            palindromeRange: { start: i - p[i], end: i + p[i] },
            codeLine: 7,
            message: `Palindrome at ${i}: length ${p[i]}, range [${i - p[i]}, ${i + p[i]}]`
        });

        // Update center and right boundary
        if (i + p[i] > right) {
            center = i;
            right = i + p[i];
            steps.push({
                original: s,
                processed: t.split(''),
                p: [...p],
                center: center,
                right: right,
                i: i,
                codeLine: 8,
                message: `Updated boundary: center=${center}, right=${right}`
            });
        }

        // Track max palindrome
        if (p[i] > maxLen) {
            maxLen = p[i];
            maxCenter = i;
        }
    }

    // Extract the longest palindrome
    const start = Math.floor((maxCenter - maxLen) / 2);
    const longestPalindrome = s.substring(start, start + maxLen);

    steps.push({
        original: s,
        processed: t.split(''),
        p: [...p],
        maxCenter: maxCenter,
        maxLen: maxLen,
        longestPalindrome: longestPalindrome,
        resultStart: start,
        resultEnd: start + maxLen - 1,
        codeLine: 10,
        message: `Complete! Longest palindrome: "${longestPalindrome}" (length ${maxLen}) at indices [${start}, ${start + maxLen - 1}]`
    });

    return steps;
};

export const manacherCode = [
    "function Manacher(s):",
    "  t = '#' + join(s, '#') + '#'  // preprocess",
    "  p = array of zeros",
    "  center = right = 0",
    "  for i = 0 to len(t)-1:",
    "    if i < right:",
    "      p[i] = min(right-i, p[2*center-i])",
    "    // Expand around i",
    "    while can_expand: p[i]++",
    "    if i + p[i] > right:",
    "      center = i, right = i + p[i]",
    "  return longest palindrome"
];
