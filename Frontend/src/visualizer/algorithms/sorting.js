/**
 * Sorting Algorithm Step Generators
 * Each function returns an array of "steps" representing animation frames
 */

// Generate steps for Bubble Sort visualization
export const generateBubbleSortSteps = (inputArray) => {
    const steps = [];
    const array = [...inputArray];
    const n = array.length;

    // Initial state
    steps.push({
        array: [...array],
        comparing: [],
        swapped: [],
        sorted: [],
        codeLine: 1,
        message: `Starting Bubble Sort with array: [${array.join(', ')}]`,
        i: null,
        j: null
    });

    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            // Comparing step
            steps.push({
                array: [...array],
                comparing: [j, j + 1],
                swapped: [],
                sorted: Array.from({ length: i }, (_, k) => n - 1 - k),
                codeLine: 4,
                message: `Comparing arr[${j}]=${array[j]} and arr[${j + 1}]=${array[j + 1]}`,
                i,
                j
            });

            if (array[j] > array[j + 1]) {
                // Swap
                [array[j], array[j + 1]] = [array[j + 1], array[j]];

                // Swapping step
                steps.push({
                    array: [...array],
                    comparing: [],
                    swapped: [j, j + 1],
                    sorted: Array.from({ length: i }, (_, k) => n - 1 - k),
                    codeLine: 6,
                    message: `Swapped! arr[${j}]=${array[j]}, arr[${j + 1}]=${array[j + 1]}`,
                    i,
                    j
                });
            }
        }

        // Mark element as sorted
        steps.push({
            array: [...array],
            comparing: [],
            swapped: [],
            sorted: Array.from({ length: i + 1 }, (_, k) => n - 1 - k),
            codeLine: 2,
            message: `Element at index ${n - 1 - i} is now in its sorted position`,
            i,
            j: null
        });
    }

    // Final sorted state
    steps.push({
        array: [...array],
        comparing: [],
        swapped: [],
        sorted: Array.from({ length: n }, (_, k) => k),
        codeLine: 8,
        message: `Sorting complete! Final array: [${array.join(', ')}]`,
        i: null,
        j: null
    });

    return steps;
};

// Generate steps for Merge Sort visualization
export const generateMergeSortSteps = (inputArray) => {
    const steps = [];
    const array = [...inputArray];
    const n = array.length;

    const merge = (arr, left, mid, right, level) => {
        const leftArr = arr.slice(left, mid + 1);
        const rightArr = arr.slice(mid + 1, right + 1);

        steps.push({
            array: [...arr],
            ranges: [{ start: left, end: mid, type: 'left' }, { start: mid + 1, end: right, type: 'right' }],
            merging: { left, right },
            codeLine: 5,
            message: `Merging [${leftArr.join(', ')}] and [${rightArr.join(', ')}]`,
            level
        });

        let i = 0, j = 0, k = left;

        while (i < leftArr.length && j < rightArr.length) {
            if (leftArr[i] <= rightArr[j]) {
                arr[k] = leftArr[i];
                i++;
            } else {
                arr[k] = rightArr[j];
                j++;
            }
            k++;
        }

        while (i < leftArr.length) {
            arr[k] = leftArr[i];
            i++;
            k++;
        }

        while (j < rightArr.length) {
            arr[k] = rightArr[j];
            j++;
            k++;
        }

        steps.push({
            array: [...arr],
            merged: { start: left, end: right },
            codeLine: 10,
            message: `Merged result: [${arr.slice(left, right + 1).join(', ')}]`,
            level
        });
    };

    const mergeSort = (arr, left, right, level = 0) => {
        if (left < right) {
            const mid = Math.floor((left + right) / 2);

            steps.push({
                array: [...arr],
                dividing: { left, mid, right },
                codeLine: 2,
                message: `Dividing array from index ${left} to ${right}`,
                level
            });

            mergeSort(arr, left, mid, level + 1);
            mergeSort(arr, mid + 1, right, level + 1);
            merge(arr, left, mid, right, level);
        }
    };

    steps.push({
        array: [...array],
        codeLine: 1,
        message: `Starting Merge Sort with array: [${array.join(', ')}]`
    });

    mergeSort(array, 0, n - 1);

    steps.push({
        array: [...array],
        sorted: Array.from({ length: n }, (_, k) => k),
        codeLine: 12,
        message: `Sorting complete! Final array: [${array.join(', ')}]`
    });

    return steps;
};

// Generate steps for Quick Sort visualization
export const generateQuickSortSteps = (inputArray) => {
    const steps = [];
    const array = [...inputArray];
    const n = array.length;

    const partition = (arr, low, high) => {
        const pivot = arr[high];

        steps.push({
            array: [...arr],
            pivot: high,
            range: { low, high },
            codeLine: 3,
            message: `Pivot selected: ${pivot} at index ${high}`
        });

        let i = low - 1;

        for (let j = low; j < high; j++) {
            steps.push({
                array: [...arr],
                pivot: high,
                comparing: [j],
                pointer: i,
                codeLine: 5,
                message: `Comparing arr[${j}]=${arr[j]} with pivot ${pivot}`
            });

            if (arr[j] < pivot) {
                i++;
                [arr[i], arr[j]] = [arr[j], arr[i]];

                if (i !== j) {
                    steps.push({
                        array: [...arr],
                        pivot: high,
                        swapped: [i, j],
                        codeLine: 7,
                        message: `Swapped arr[${i}] and arr[${j}]`
                    });
                }
            }
        }

        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];

        steps.push({
            array: [...arr],
            pivotPlaced: i + 1,
            codeLine: 9,
            message: `Pivot ${pivot} placed at correct position ${i + 1}`
        });

        return i + 1;
    };

    const quickSort = (arr, low, high) => {
        if (low < high) {
            const pi = partition(arr, low, high);
            quickSort(arr, low, pi - 1);
            quickSort(arr, pi + 1, high);
        }
    };

    steps.push({
        array: [...array],
        codeLine: 1,
        message: `Starting Quick Sort with array: [${array.join(', ')}]`
    });

    quickSort(array, 0, n - 1);

    steps.push({
        array: [...array],
        sorted: Array.from({ length: n }, (_, k) => k),
        codeLine: 11,
        message: `Sorting complete! Final array: [${array.join(', ')}]`
    });

    return steps;
};

// Bubble Sort pseudocode
export const bubbleSortCode = [
    'function bubbleSort(arr):',
    '  for i = 0 to n-1:',
    '    for j = 0 to n-i-1:',
    '      if arr[j] > arr[j+1]:',
    '        swap(arr[j], arr[j+1])',
    '  return arr'
];

// Merge Sort pseudocode
export const mergeSortCode = [
    'function mergeSort(arr, l, r):',
    '  if l < r:',
    '    mid = (l + r) / 2',
    '    mergeSort(arr, l, mid)',
    '    mergeSort(arr, mid+1, r)',
    '    merge(arr, l, mid, r)',
    '',
    'function merge(arr, l, m, r):',
    '  // Merge two sorted subarrays',
    '  // arr[l..m] and arr[m+1..r]'
];

// Quick Sort pseudocode  
export const quickSortCode = [
    'function quickSort(arr, low, high):',
    '  if low < high:',
    '    pi = partition(arr, low, high)',
    '    quickSort(arr, low, pi-1)',
    '    quickSort(arr, pi+1, high)',
    '',
    'function partition(arr, low, high):',
    '  pivot = arr[high]',
    '  i = low - 1',
    '  for j = low to high-1:',
    '    if arr[j] < pivot:',
    '      i++; swap(arr[i], arr[j])',
    '  swap(arr[i+1], arr[high])',
    '  return i + 1'
];

// Generate steps for Selection Sort visualization
export const generateSelectionSortSteps = (inputArray) => {
    const steps = [];
    const array = [...inputArray];
    const n = array.length;

    steps.push({
        array: [...array],
        comparing: [],
        swapped: [],
        sorted: [],
        codeLine: 1,
        message: `Starting Selection Sort with array: [${array.join(', ')}]`,
        i: null,
        j: null,
        minIdx: null
    });

    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;

        steps.push({
            array: [...array],
            comparing: [i],
            sorted: Array.from({ length: i }, (_, k) => k),
            codeLine: 2,
            message: `Starting pass ${i + 1}: Looking for minimum from index ${i}`,
            i,
            minIdx
        });

        for (let j = i + 1; j < n; j++) {
            steps.push({
                array: [...array],
                comparing: [minIdx, j],
                sorted: Array.from({ length: i }, (_, k) => k),
                codeLine: 4,
                message: `Comparing arr[${minIdx}]=${array[minIdx]} with arr[${j}]=${array[j]}`,
                i,
                j,
                minIdx
            });

            if (array[j] < array[minIdx]) {
                minIdx = j;
                steps.push({
                    array: [...array],
                    comparing: [minIdx],
                    sorted: Array.from({ length: i }, (_, k) => k),
                    codeLine: 5,
                    message: `New minimum found: ${array[minIdx]} at index ${minIdx}`,
                    i,
                    j,
                    minIdx
                });
            }
        }

        if (minIdx !== i) {
            [array[i], array[minIdx]] = [array[minIdx], array[i]];
            steps.push({
                array: [...array],
                swapped: [i, minIdx],
                sorted: Array.from({ length: i + 1 }, (_, k) => k),
                codeLine: 7,
                message: `Swapped arr[${i}] and arr[${minIdx}]`,
                i,
                minIdx
            });
        }
    }

    steps.push({
        array: [...array],
        comparing: [],
        swapped: [],
        sorted: Array.from({ length: n }, (_, k) => k),
        codeLine: 8,
        message: `Sorting complete! Final array: [${array.join(', ')}]`
    });

    return steps;
};

// Selection Sort pseudocode
export const selectionSortCode = [
    'function selectionSort(arr):',
    '  for i = 0 to n-2:',
    '    minIdx = i',
    '    for j = i+1 to n-1:',
    '      if arr[j] < arr[minIdx]:',
    '        minIdx = j',
    '    swap(arr[i], arr[minIdx])',
    '  return arr'
];

// Generate steps for Insertion Sort visualization
export const generateInsertionSortSteps = (inputArray) => {
    const steps = [];
    const array = [...inputArray];
    const n = array.length;

    steps.push({
        array: [...array],
        comparing: [],
        swapped: [],
        sorted: [0],
        codeLine: 1,
        message: `Starting Insertion Sort with array: [${array.join(', ')}]`,
        i: null,
        j: null
    });

    for (let i = 1; i < n; i++) {
        const key = array[i];
        let j = i - 1;

        steps.push({
            array: [...array],
            comparing: [i],
            sorted: Array.from({ length: i }, (_, k) => k),
            codeLine: 2,
            message: `Picking key: ${key} at index ${i}`,
            i,
            key
        });

        while (j >= 0 && array[j] > key) {
            steps.push({
                array: [...array],
                comparing: [j, j + 1],
                sorted: Array.from({ length: i }, (_, k) => k),
                codeLine: 4,
                message: `arr[${j}]=${array[j]} > key=${key}, shifting right`,
                i,
                j,
                key
            });

            array[j + 1] = array[j];

            steps.push({
                array: [...array],
                swapped: [j + 1],
                sorted: Array.from({ length: i }, (_, k) => k),
                codeLine: 5,
                message: `Shifted ${array[j]} to index ${j + 1}`,
                i,
                j,
                key
            });

            j--;
        }

        array[j + 1] = key;

        steps.push({
            array: [...array],
            swapped: [j + 1],
            sorted: Array.from({ length: i + 1 }, (_, k) => k),
            codeLine: 6,
            message: `Inserted key ${key} at index ${j + 1}`,
            i,
            key
        });
    }

    steps.push({
        array: [...array],
        comparing: [],
        swapped: [],
        sorted: Array.from({ length: n }, (_, k) => k),
        codeLine: 7,
        message: `Sorting complete! Final array: [${array.join(', ')}]`
    });

    return steps;
};

// Insertion Sort pseudocode
export const insertionSortCode = [
    'function insertionSort(arr):',
    '  for i = 1 to n-1:',
    '    key = arr[i]',
    '    j = i - 1',
    '    while j >= 0 and arr[j] > key:',
    '      arr[j+1] = arr[j]',
    '      j--',
    '    arr[j+1] = key',
    '  return arr'
];

// Generate steps for Heap Sort visualization
export const generateHeapSortSteps = (inputArray) => {
    const steps = [];
    const array = [...inputArray];
    const n = array.length;

    steps.push({
        array: [...array],
        comparing: [],
        swapped: [],
        sorted: [],
        heapSize: n,
        codeLine: 1,
        message: `Starting Heap Sort with array: [${array.join(', ')}]`
    });

    // Heapify function
    const heapify = (arr, size, root) => {
        let largest = root;
        const left = 2 * root + 1;
        const right = 2 * root + 2;

        steps.push({
            array: [...arr],
            comparing: [root],
            heapSize: size,
            codeLine: 7,
            message: `Heapifying at index ${root}, value: ${arr[root]}`
        });

        if (left < size) {
            steps.push({
                array: [...arr],
                comparing: [largest, left],
                heapSize: size,
                codeLine: 8,
                message: `Comparing ${arr[largest]} with left child ${arr[left]}`
            });
            if (arr[left] > arr[largest]) {
                largest = left;
            }
        }

        if (right < size) {
            steps.push({
                array: [...arr],
                comparing: [largest, right],
                heapSize: size,
                codeLine: 9,
                message: `Comparing ${arr[largest]} with right child ${arr[right]}`
            });
            if (arr[right] > arr[largest]) {
                largest = right;
            }
        }

        if (largest !== root) {
            [arr[root], arr[largest]] = [arr[largest], arr[root]];
            steps.push({
                array: [...arr],
                swapped: [root, largest],
                heapSize: size,
                codeLine: 10,
                message: `Swapped ${arr[largest]} with ${arr[root]}`
            });
            heapify(arr, size, largest);
        }
    };

    // Build max heap
    steps.push({
        array: [...array],
        codeLine: 2,
        message: `Building max heap...`
    });

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(array, n, i);
    }

    steps.push({
        array: [...array],
        codeLine: 3,
        message: `Max heap built: [${array.join(', ')}]`
    });

    // Extract elements from heap
    for (let i = n - 1; i > 0; i--) {
        steps.push({
            array: [...array],
            comparing: [0, i],
            sorted: Array.from({ length: n - i }, (_, k) => n - 1 - k),
            codeLine: 4,
            message: `Moving max element ${array[0]} to position ${i}`
        });

        [array[0], array[i]] = [array[i], array[0]];

        steps.push({
            array: [...array],
            swapped: [0, i],
            sorted: Array.from({ length: n - i }, (_, k) => n - 1 - k),
            codeLine: 5,
            message: `Swapped! Now heapifying remaining heap`
        });

        heapify(array, i, 0);
    }

    steps.push({
        array: [...array],
        sorted: Array.from({ length: n }, (_, k) => k),
        codeLine: 11,
        message: `Sorting complete! Final array: [${array.join(', ')}]`
    });

    return steps;
};

// Heap Sort pseudocode
export const heapSortCode = [
    'function heapSort(arr):',
    '  buildMaxHeap(arr)',
    '  for i = n-1 to 1:',
    '    swap(arr[0], arr[i])',
    '    heapify(arr, i, 0)',
    '',
    'function heapify(arr, n, i):',
    '  largest = i',
    '  if left < n and arr[left] > arr[largest]: largest = left',
    '  if right < n and arr[right] > arr[largest]: largest = right',
    '  if largest != i: swap and heapify',
    '  return arr'
];
