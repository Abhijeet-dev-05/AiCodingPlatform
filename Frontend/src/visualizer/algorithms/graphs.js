/**
 * Graph Algorithm Visualizations
 */

// Sample graph as adjacency list
export const sampleGraph = {
    nodes: [0, 1, 2, 3, 4, 5],
    edges: [
        [0, 1], [0, 2], [1, 3], [1, 4], [2, 4], [3, 5], [4, 5]
    ],
    positions: {
        0: { x: 20, y: 30 },
        1: { x: 50, y: 15 },
        2: { x: 50, y: 45 },
        3: { x: 80, y: 10 },
        4: { x: 80, y: 30 },
        5: { x: 80, y: 50 }
    }
};

// Build adjacency list
const buildAdjList = (nodes, edges) => {
    const adj = {};
    nodes.forEach(n => adj[n] = []);
    edges.forEach(([u, v]) => {
        adj[u].push(v);
        adj[v].push(u);
    });
    return adj;
};

// Generate BFS steps for graph
export const generateGraphBFSSteps = (graph, startNode = 0) => {
    const steps = [];
    const adj = buildAdjList(graph.nodes, graph.edges);
    const visited = new Set();
    const queue = [startNode];

    steps.push({
        visited: [],
        current: null,
        queue: [...queue],
        currentEdge: null,
        message: `Starting BFS from node ${startNode}`,
        codeLine: 1
    });

    visited.add(startNode);

    while (queue.length > 0) {
        const node = queue.shift();

        steps.push({
            visited: [...visited],
            current: node,
            queue: [...queue],
            currentEdge: null,
            message: `Visiting node ${node}`,
            codeLine: 3
        });

        for (const neighbor of adj[node]) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push(neighbor);

                steps.push({
                    visited: [...visited],
                    current: node,
                    queue: [...queue],
                    currentEdge: [node, neighbor],
                    message: `Discovered node ${neighbor} via edge ${node}-${neighbor}`,
                    codeLine: 5
                });
            }
        }
    }

    steps.push({
        visited: [...visited],
        current: null,
        queue: [],
        currentEdge: null,
        message: `BFS Complete! Visited order: [${[...visited].join(', ')}]`,
        codeLine: 7,
        complete: true
    });

    return steps;
};

// Generate DFS steps for graph
export const generateGraphDFSSteps = (graph, startNode = 0) => {
    const steps = [];
    const adj = buildAdjList(graph.nodes, graph.edges);
    const visited = new Set();
    const stack = [startNode];

    steps.push({
        visited: [],
        current: null,
        stack: [...stack],
        currentEdge: null,
        message: `Starting DFS from node ${startNode}`,
        codeLine: 1
    });

    while (stack.length > 0) {
        const node = stack.pop();

        if (visited.has(node)) continue;

        visited.add(node);

        steps.push({
            visited: [...visited],
            current: node,
            stack: [...stack],
            currentEdge: null,
            message: `Visiting node ${node}`,
            codeLine: 3
        });

        // Add unvisited neighbors to stack (reverse for correct order)
        const neighbors = adj[node].filter(n => !visited.has(n)).reverse();
        for (const neighbor of neighbors) {
            stack.push(neighbor);

            steps.push({
                visited: [...visited],
                current: node,
                stack: [...stack],
                currentEdge: [node, neighbor],
                message: `Pushed node ${neighbor} to stack`,
                codeLine: 5
            });
        }
    }

    steps.push({
        visited: [...visited],
        current: null,
        stack: [],
        currentEdge: null,
        message: `DFS Complete! Visited order: [${[...visited].join(', ')}]`,
        codeLine: 7,
        complete: true
    });

    return steps;
};

export const graphBFSCode = [
    'function BFS(graph, start):',
    '  queue = [start]',
    '  while queue not empty:',
    '    node = queue.dequeue()',
    '    for neighbor in graph[node]:',
    '      if not visited[neighbor]:',
    '        visited[neighbor] = true',
    '        queue.enqueue(neighbor)'
];

export const graphDFSCode = [
    'function DFS(graph, start):',
    '  stack = [start]',
    '  while stack not empty:',
    '    node = stack.pop()',
    '    if not visited[node]:',
    '      visited[node] = true',
    '      for neighbor in graph[node]:',
    '        stack.push(neighbor)'
];
