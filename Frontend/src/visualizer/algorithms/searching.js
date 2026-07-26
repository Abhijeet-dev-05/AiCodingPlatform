/**
 * Searching Algorithms - Step Generators and Pseudocode
 */

// Binary Search pseudocode
export const binarySearchCode = [
    'function binarySearch(arr, target):',
    '  left = 0, right = arr.length - 1',
    '  while left <= right:',
    '    mid = (left + right) // 2',
    '    if arr[mid] == target:',
    '      return mid  // Found!',
    '    else if arr[mid] < target:',
    '      left = mid + 1  // Search right',
    '    else:',
    '      right = mid - 1  // Search left',
    '  return -1  // Not found'
];

// Linear Search pseudocode
export const linearSearchCode = [
    'function linearSearch(arr, target):',
    '  for i = 0 to arr.length - 1:',
    '    if arr[i] == target:',
    '      return i  // Found!',
    '  return -1  // Not found'
];

/**
 * Generate Binary Search Steps
 */
export const generateBinarySearchSteps = (arr, target) => {
    const steps = [];
    const sortedArr = [...arr].sort((a, b) => a - b);
    let left = 0;
    let right = sortedArr.length - 1;

    steps.push({
        array: sortedArr,
        left,
        right,
        mid: null,
        target,
        found: false,
        completed: false,
        message: `Searching for ${target} in sorted array`,
        codeLine: 1
    });

    steps.push({
        array: sortedArr,
        left,
        right,
        mid: null,
        target,
        found: false,
        completed: false,
        message: `Initialize: left = ${left}, right = ${right}`,
        codeLine: 2
    });

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);

        steps.push({
            array: sortedArr,
            left,
            right,
            mid,
            target,
            found: false,
            completed: false,
            message: `Calculate mid = (${left} + ${right}) / 2 = ${mid}`,
            codeLine: 4
        });

        steps.push({
            array: sortedArr,
            left,
            right,
            mid,
            target,
            found: false,
            completed: false,
            comparing: true,
            message: `Compare arr[${mid}] = ${sortedArr[mid]} with target ${target}`,
            codeLine: 5
        });

        if (sortedArr[mid] === target) {
            steps.push({
                array: sortedArr,
                left,
                right,
                mid,
                target,
                found: true,
                foundIndex: mid,
                completed: true,
                message: `🎉 Found ${target} at index ${mid}!`,
                codeLine: 6
            });
            return steps;
        } else if (sortedArr[mid] < target) {
            steps.push({
                array: sortedArr,
                left,
                right,
                mid,
                target,
                found: false,
                completed: false,
                message: `${sortedArr[mid]} < ${target}, search right half`,
                codeLine: 8
            });
            left = mid + 1;
        } else {
            steps.push({
                array: sortedArr,
                left,
                right,
                mid,
                target,
                found: false,
                completed: false,
                message: `${sortedArr[mid]} > ${target}, search left half`,
                codeLine: 10
            });
            right = mid - 1;
        }
    }

    steps.push({
        array: sortedArr,
        left,
        right,
        mid: null,
        target,
        found: false,
        completed: true,
        message: `❌ ${target} not found in array`,
        codeLine: 11
    });

    return steps;
};

/**
 * Generate Linear Search Steps
 */
export const generateLinearSearchSteps = (arr, target) => {
    const steps = [];

    steps.push({
        array: arr,
        currentIndex: null,
        target,
        found: false,
        completed: false,
        message: `Searching for ${target} in array`,
        codeLine: 1
    });

    for (let i = 0; i < arr.length; i++) {
        steps.push({
            array: arr,
            currentIndex: i,
            target,
            found: false,
            completed: false,
            message: `Checking index ${i}: arr[${i}] = ${arr[i]}`,
            codeLine: 2
        });

        steps.push({
            array: arr,
            currentIndex: i,
            target,
            found: false,
            completed: false,
            comparing: true,
            message: `Compare ${arr[i]} with ${target}`,
            codeLine: 3
        });

        if (arr[i] === target) {
            steps.push({
                array: arr,
                currentIndex: i,
                target,
                found: true,
                foundIndex: i,
                completed: true,
                message: `🎉 Found ${target} at index ${i}!`,
                codeLine: 4
            });
            return steps;
        }
    }

    steps.push({
        array: arr,
        currentIndex: null,
        target,
        found: false,
        completed: true,
        message: `❌ ${target} not found in array`,
        codeLine: 5
    });

    return steps;
};
