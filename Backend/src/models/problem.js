const mongoose = require("mongoose");
const { Schema } = mongoose;

const problemSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: true
    },
    tags: {
        type: String,
        enum: [
            'array',
            'linkedlist',
            'graph',
            'dp',
            'string',
            'sliding-window',
            'two-pointers',
            'hashing',
            'stack',
            'queue',
            'tree',
            'binary-tree',
            'bst',
            'heap',
            'priority-queue',
            'trie',
            'greedy',
            'backtracking',
            'recursion',
            'bit-manipulation',
            'math',
            'sorting',
            'searching',
            'binary-search',
            'prefix-sum',
            'graph-bfs',
            'graph-dfs',
            'shortest-path',
            'dijkstra',
            'topo-sort',
            'union-find',
            'knapsack',
            'lcs',
            'lis',
            'matrix-dp'
        ],
        required: true
    },

    visibleTestCases: [{
        input: {
            type: String,
            required: true,
        },
        output: {
            type: String,
            required: true,
        },
        explanation: {
            type: String,
            required: true,
        }
    }],
    hiddenTestCases: [{
        input: {
            type: String,
            required: true,
        },
        output: {
            type: String,
            required: true,
        },
    }],
    startCode: [
        {
            language: {
                type: String,
                required: true,
            },
            initialCode: {
                type: String,
                required: true,
            }
        },
    ],
    referenceSolution: [
        {
            language: {
                type: String,
                required: true,
            },
            completeCode: {
                type: String,
                required: true,
            }
        },
    ],
    problemCreator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },


});

const Problem = mongoose.model("Problem", problemSchema);
module.exports = Problem;
