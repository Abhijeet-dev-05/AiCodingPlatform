/**
 * Tree Algorithm Visualizations
 */

// Generate a sample binary tree
export const generateBinaryTree = (values) => {
    if (!values || values.length === 0) return null;

    const nodes = values.map((val, idx) => ({
        id: idx,
        value: val,
        left: null,
        right: null
    }));

    // Build tree structure
    for (let i = 0; i < nodes.length; i++) {
        const leftIdx = 2 * i + 1;
        const rightIdx = 2 * i + 2;
        if (leftIdx < nodes.length && nodes[leftIdx].value !== null) {
            nodes[i].left = nodes[leftIdx];
        }
        if (rightIdx < nodes.length && nodes[rightIdx].value !== null) {
            nodes[i].right = nodes[rightIdx];
        }
    }

    return nodes[0];
};

// BFS (Level Order) traversal steps
export const generateBFSSteps = (values) => {
    const steps = [];
    const tree = generateBinaryTree(values);

    if (!tree) {
        steps.push({ visited: [], current: null, queue: [], message: 'Empty tree' });
        return steps;
    }

    const visited = [];
    const queue = [tree];

    steps.push({
        visited: [],
        current: null,
        queue: queue.map(n => n.id),
        message: 'Starting BFS (Level Order) traversal',
        codeLine: 1
    });

    while (queue.length > 0) {
        const node = queue.shift();

        steps.push({
            visited: [...visited],
            current: node.id,
            queue: queue.map(n => n.id),
            message: `Visiting node ${node.value}`,
            codeLine: 3
        });

        visited.push(node.id);

        if (node.left) {
            queue.push(node.left);
            steps.push({
                visited: [...visited],
                current: node.id,
                queue: queue.map(n => n.id),
                message: `Added left child ${node.left.value} to queue`,
                codeLine: 4
            });
        }

        if (node.right) {
            queue.push(node.right);
            steps.push({
                visited: [...visited],
                current: node.id,
                queue: queue.map(n => n.id),
                message: `Added right child ${node.right.value} to queue`,
                codeLine: 5
            });
        }
    }

    steps.push({
        visited,
        current: null,
        queue: [],
        message: `BFS Complete! Order: [${values.filter((_, i) => visited.includes(i)).join(', ')}]`,
        codeLine: 7,
        complete: true
    });

    return steps;
};

// DFS (Inorder) traversal steps
export const generateDFSInorderSteps = (values) => {
    const steps = [];
    const tree = generateBinaryTree(values);
    const visited = [];
    const result = [];

    if (!tree) {
        steps.push({ visited: [], current: null, stack: [], message: 'Empty tree' });
        return steps;
    }

    steps.push({
        visited: [],
        current: null,
        stack: [],
        result: [],
        message: 'Starting DFS Inorder traversal (Left → Root → Right)',
        codeLine: 1
    });

    const inorder = (node) => {
        if (!node) return;

        steps.push({
            visited: [...visited],
            current: node.id,
            result: [...result],
            message: `Exploring node ${node.value}`,
            codeLine: 2
        });

        // Left
        if (node.left) {
            inorder(node.left);
        }

        // Root
        visited.push(node.id);
        result.push(node.value);
        steps.push({
            visited: [...visited],
            current: node.id,
            result: [...result],
            message: `Visit node ${node.value} - Added to result`,
            codeLine: 4
        });

        // Right
        if (node.right) {
            inorder(node.right);
        }
    };

    inorder(tree);

    steps.push({
        visited,
        current: null,
        result,
        message: `DFS Inorder Complete! Order: [${result.join(', ')}]`,
        codeLine: 6,
        complete: true
    });

    return steps;
};

export const bfsCode = [
    'function BFS(root):',
    '  queue = [root]',
    '  while queue not empty:',
    '    node = queue.dequeue()',
    '    visit(node)',
    '    if node.left: queue.enqueue(left)',
    '    if node.right: queue.enqueue(right)'
];

export const dfsInorderCode = [
    'function inorder(node):',
    '  if node is null: return',
    '  inorder(node.left)   # Left',
    '  visit(node)          # Root',
    '  inorder(node.right)  # Right'
];
