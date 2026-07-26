/**
 * Stack & Queue Algorithm Step Generators
 */

// Generate steps for Stack Push/Pop visualization
export const generateStackSteps = (operations) => {
    const steps = [];
    const stack = [];

    steps.push({
        stack: [...stack],
        operation: null,
        codeLine: 1,
        message: 'Stack initialized (empty)',
        top: -1
    });

    for (const op of operations) {
        if (op.type === 'push') {
            stack.push(op.value);
            steps.push({
                stack: [...stack],
                operation: { type: 'push', value: op.value },
                highlighting: stack.length - 1,
                codeLine: 2,
                message: `PUSH ${op.value} onto stack`,
                top: stack.length - 1
            });
        } else if (op.type === 'pop') {
            if (stack.length > 0) {
                const popped = stack.pop();
                steps.push({
                    stack: [...stack],
                    operation: { type: 'pop', value: popped },
                    popping: true,
                    codeLine: 4,
                    message: `POP ${popped} from stack`,
                    top: stack.length - 1
                });
            } else {
                steps.push({
                    stack: [...stack],
                    operation: { type: 'pop', value: null },
                    error: true,
                    codeLine: 5,
                    message: 'Stack Underflow! Cannot pop from empty stack',
                    top: -1
                });
            }
        } else if (op.type === 'peek') {
            const top = stack.length > 0 ? stack[stack.length - 1] : null;
            steps.push({
                stack: [...stack],
                operation: { type: 'peek', value: top },
                highlighting: stack.length > 0 ? stack.length - 1 : null,
                codeLine: 6,
                message: top !== null ? `PEEK: Top element is ${top}` : 'Stack is empty',
                top: stack.length - 1
            });
        }
    }

    steps.push({
        stack: [...stack],
        operation: null,
        codeLine: 7,
        message: `Operations complete. Final stack: [${stack.join(', ')}]`,
        top: stack.length - 1
    });

    return steps;
};

// Stack pseudocode
export const stackCode = [
    'class Stack:',
    '  def push(value):',
    '    stack.append(value)',
    '  def pop():',
    '    if not empty: return stack.pop()',
    '    else: raise StackUnderflow',
    '  def peek():',
    '    return stack[-1] if stack else None'
];

// Generate steps for Queue Enqueue/Dequeue visualization
export const generateQueueSteps = (operations) => {
    const steps = [];
    const queue = [];

    steps.push({
        queue: [...queue],
        operation: null,
        codeLine: 1,
        message: 'Queue initialized (empty)',
        front: -1,
        rear: -1
    });

    for (const op of operations) {
        if (op.type === 'enqueue') {
            queue.push(op.value);
            steps.push({
                queue: [...queue],
                operation: { type: 'enqueue', value: op.value },
                highlighting: queue.length - 1,
                codeLine: 2,
                message: `ENQUEUE ${op.value} at rear`,
                front: 0,
                rear: queue.length - 1
            });
        } else if (op.type === 'dequeue') {
            if (queue.length > 0) {
                const dequeued = queue.shift();
                steps.push({
                    queue: [...queue],
                    operation: { type: 'dequeue', value: dequeued },
                    dequeuing: true,
                    codeLine: 4,
                    message: `DEQUEUE ${dequeued} from front`,
                    front: queue.length > 0 ? 0 : -1,
                    rear: queue.length > 0 ? queue.length - 1 : -1
                });
            } else {
                steps.push({
                    queue: [...queue],
                    operation: { type: 'dequeue', value: null },
                    error: true,
                    codeLine: 5,
                    message: 'Queue Underflow! Cannot dequeue from empty queue',
                    front: -1,
                    rear: -1
                });
            }
        } else if (op.type === 'peek') {
            const front = queue.length > 0 ? queue[0] : null;
            steps.push({
                queue: [...queue],
                operation: { type: 'peek', value: front },
                highlighting: queue.length > 0 ? 0 : null,
                codeLine: 6,
                message: front !== null ? `PEEK: Front element is ${front}` : 'Queue is empty',
                front: queue.length > 0 ? 0 : -1,
                rear: queue.length > 0 ? queue.length - 1 : -1
            });
        }
    }

    steps.push({
        queue: [...queue],
        operation: null,
        codeLine: 7,
        message: `Operations complete. Final queue: [${queue.join(', ')}]`,
        front: queue.length > 0 ? 0 : -1,
        rear: queue.length > 0 ? queue.length - 1 : -1
    });

    return steps;
};

// Queue pseudocode
export const queueCode = [
    'class Queue:',
    '  def enqueue(value):',
    '    queue.append(value)  # Add at rear',
    '  def dequeue():',
    '    if not empty: return queue.pop(0)',
    '    else: raise QueueUnderflow',
    '  def peek():',
    '    return queue[0] if queue else None'
];

// Generate steps for Monotonic Stack visualization
export const generateMonotonicStackSteps = (inputArray, type = 'decreasing') => {
    const steps = [];
    const stack = [];
    const result = new Array(inputArray.length).fill(-1);

    steps.push({
        array: inputArray,
        stack: [],
        result: [...result],
        currentIndex: -1,
        codeLine: 1,
        message: `Finding Next Greater Element using ${type} monotonic stack`,
        type
    });

    for (let i = 0; i < inputArray.length; i++) {
        steps.push({
            array: inputArray,
            stack: stack.map(s => s.index),
            result: [...result],
            currentIndex: i,
            comparing: true,
            codeLine: 2,
            message: `Processing element ${inputArray[i]} at index ${i}`,
            type
        });

        while (stack.length > 0 && inputArray[i] > stack[stack.length - 1].value) {
            const popped = stack.pop();
            result[popped.index] = inputArray[i];

            steps.push({
                array: inputArray,
                stack: stack.map(s => s.index),
                result: [...result],
                currentIndex: i,
                popping: popped.index,
                codeLine: 4,
                message: `${inputArray[i]} > ${popped.value}, so NGE[${popped.index}] = ${inputArray[i]}`,
                type
            });
        }

        stack.push({ value: inputArray[i], index: i });

        steps.push({
            array: inputArray,
            stack: stack.map(s => s.index),
            result: [...result],
            currentIndex: i,
            pushing: true,
            codeLine: 5,
            message: `Push ${inputArray[i]} onto stack`,
            type
        });
    }

    steps.push({
        array: inputArray,
        stack: stack.map(s => s.index),
        result: [...result],
        currentIndex: -1,
        codeLine: 7,
        message: `Complete! NGE result: [${result.join(', ')}]`,
        type,
        complete: true
    });

    return steps;
};

// Monotonic Stack pseudocode
export const monotonicStackCode = [
    'function nextGreaterElement(arr):',
    '  for i = 0 to n-1:',
    '    while stack not empty and arr[i] > stack.top:',
    '      popped = stack.pop()',
    '      result[popped.index] = arr[i]',
    '    stack.push({value: arr[i], index: i})',
    '  return result  # -1 for no NGE'
];
