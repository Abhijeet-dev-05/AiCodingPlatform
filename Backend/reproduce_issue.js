const axios = require('axios');
const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, 'reproduce.log');
function log(msg) {
    fs.appendFileSync(logFile, msg + '\n');
}

const payload = {
    "title": "Two Sum Problem",
    "description": "Given an array of integers, return indices of the two numbers such that they add up to a specific target.",
    "difficulty": "easy",
    "tags": "array",
    "visibleTestCases": [
        {
            "input": "[2,7,11,15], target = 9",
            "output": "[0,1]",
            "explanation": "Because nums[0] + nums[1] = 2 + 7 = 9."
        }
    ],
    "hiddenTestCases": [
        {
            "input": "[3,2,4], target = 6",
            "output": "[1,2]"
        },
        {
            "input": "[1,5,3,7], target = 8",
            "output": "[0,3]"
        }
    ],
    "startCode": [
        {
            "language": "javascript",
            "initialCode": "function twoSum(nums, target) {\n  // write your code here\n}"
        },
        {
            "language": "c++",
            "initialCode": "#include <bits/stdc++.h>\nusing namespace std;\nvector<int> twoSum(vector<int>& nums, int target) {\n    // write your code here\n}\n"
        },
        {
            "language": "java",
            "initialCode": "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // write your code here\n        return new int[]{};\n    }\n}\n"
        }
    ],
    "referenceSolution": [
        {
            "language": "javascript",
            "completeCode": "function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const diff = target - nums[i];\n    if (map.has(diff)) return [map.get(diff), i];\n    map.set(nums[i], i);\n  }\n}"
        },
        {
            "language": "c++",
            "completeCode": "#include <bits/stdc++.h>\nusing namespace std;\nvector<int> twoSum(vector<int>& nums, int target) {\n    unordered_map<int,int> mp;\n    for(int i = 0; i < nums.size(); i++){\n        int diff = target - nums[i];\n        if(mp.count(diff)) return {mp[diff], i};\n        mp[nums[i]] = i;\n    }\n    return {};\n}\n"
        },
        {
            "language": "java",
            "completeCode": "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        HashMap<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int diff = target - nums[i];\n            if (map.containsKey(diff)) {\n                return new int[]{map.get(diff), i};\n            }\n            map.put(nums[i], i);\n        }\n        return new int[]{};\n    }\n}\n"
        }
    ]
};

async function run() {
    try {
        log("Sending request...");
        const response = await axios.post('http://localhost:3000/problem/create', payload);
        log("Response: " + JSON.stringify(response.data));
    } catch (error) {
        if (error.response) {
            log("Error Response: " + JSON.stringify(error.response.data));
        } else {
            log("Error: " + error.message);
        }
    }
}

run();
