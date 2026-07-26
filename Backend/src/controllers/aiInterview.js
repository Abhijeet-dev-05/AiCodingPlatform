const OpenAI = require("openai");

// Lazy initialization to ensure environment variables are loaded
let client = null;

const getClient = () => {
    if (!client) {
        client = new OpenAI({
            apiKey: process.env.GROQ_API_KEY,
            baseURL: "https://api.groq.com/openai/v1",
        });
    }
    return client;
};

// All IT domains for interview
const DOMAINS = {
    // Programming Languages
    javascript: { name: "JavaScript", icon: "🟨", category: "Languages" },
    python: { name: "Python", icon: "🐍", category: "Languages" },
    java: { name: "Java", icon: "☕", category: "Languages" },
    cpp: { name: "C++", icon: "⚡", category: "Languages" },
    csharp: { name: "C#", icon: "🔷", category: "Languages" },
    go: { name: "Go", icon: "🐹", category: "Languages" },
    rust: { name: "Rust", icon: "🦀", category: "Languages" },
    typescript: { name: "TypeScript", icon: "🔷", category: "Languages" },
    php: { name: "PHP", icon: "🐘", category: "Languages" },
    ruby: { name: "Ruby", icon: "💎", category: "Languages" },
    swift: { name: "Swift", icon: "🍎", category: "Languages" },
    kotlin: { name: "Kotlin", icon: "🎯", category: "Languages" },

    // Frontend
    react: { name: "React", icon: "⚛️", category: "Frontend" },
    angular: { name: "Angular", icon: "🅰️", category: "Frontend" },
    vue: { name: "Vue.js", icon: "💚", category: "Frontend" },
    nextjs: { name: "Next.js", icon: "▲", category: "Frontend" },
    html_css: { name: "HTML/CSS", icon: "🎨", category: "Frontend" },

    // Backend
    nodejs: { name: "Node.js", icon: "💚", category: "Backend" },
    django: { name: "Django", icon: "🐍", category: "Backend" },
    spring: { name: "Spring Boot", icon: "🌱", category: "Backend" },
    dotnet: { name: ".NET", icon: "🔵", category: "Backend" },
    express: { name: "Express.js", icon: "🚂", category: "Backend" },
    flask: { name: "Flask", icon: "🌶️", category: "Backend" },

    // Databases
    sql: { name: "SQL", icon: "🗄️", category: "Database" },
    mongodb: { name: "MongoDB", icon: "🍃", category: "Database" },
    postgresql: { name: "PostgreSQL", icon: "🐘", category: "Database" },
    redis: { name: "Redis", icon: "🔴", category: "Database" },
    mysql: { name: "MySQL", icon: "🐬", category: "Database" },

    // DevOps & Cloud
    docker: { name: "Docker", icon: "🐳", category: "DevOps" },
    kubernetes: { name: "Kubernetes", icon: "☸️", category: "DevOps" },
    aws: { name: "AWS", icon: "☁️", category: "Cloud" },
    azure: { name: "Azure", icon: "🔷", category: "Cloud" },
    gcp: { name: "Google Cloud", icon: "🌐", category: "Cloud" },
    cicd: { name: "CI/CD", icon: "🔄", category: "DevOps" },
    linux: { name: "Linux", icon: "🐧", category: "DevOps" },
    git: { name: "Git", icon: "📚", category: "DevOps" },

    // Core Concepts
    dsa: { name: "Data Structures & Algorithms", icon: "🧮", category: "Concepts" },
    system_design: { name: "System Design", icon: "🏗️", category: "Concepts" },
    oop: { name: "Object-Oriented Programming", icon: "📦", category: "Concepts" },
    dbms: { name: "Database Management", icon: "🗃️", category: "Concepts" },
    os: { name: "Operating Systems", icon: "💻", category: "Concepts" },
    networking: { name: "Computer Networks", icon: "🌐", category: "Concepts" },
    security: { name: "Cybersecurity", icon: "🔐", category: "Concepts" },

    // Job Roles
    frontend_developer: { name: "Frontend Developer", icon: "🖥️", category: "Roles" },
    backend_developer: { name: "Backend Developer", icon: "⚙️", category: "Roles" },
    fullstack_developer: { name: "Full Stack Developer", icon: "🔗", category: "Roles" },
    devops_engineer: { name: "DevOps Engineer", icon: "🔧", category: "Roles" },
    data_scientist: { name: "Data Scientist", icon: "📊", category: "Roles" },
    ml_engineer: { name: "ML Engineer", icon: "🤖", category: "Roles" },
    cloud_architect: { name: "Cloud Architect", icon: "☁️", category: "Roles" },
    mobile_developer: { name: "Mobile Developer", icon: "📱", category: "Roles" },
    qa_engineer: { name: "QA Engineer", icon: "✅", category: "Roles" },
    security_engineer: { name: "Security Engineer", icon: "🛡️", category: "Roles" },
};

// Get all domains
const getDomains = async (req, res) => {
    try {
        // Group domains by category
        const grouped = {};
        for (const [key, value] of Object.entries(DOMAINS)) {
            if (!grouped[value.category]) {
                grouped[value.category] = [];
            }
            grouped[value.category].push({ id: key, ...value });
        }

        res.json({ success: true, domains: grouped });
    } catch (error) {
        console.error("Error fetching domains:", error);
        res.status(500).json({ success: false, error: "Failed to fetch domains" });
    }
};

// Generate interview question
const generateQuestion = async (req, res) => {
    try {
        const { domain, difficulty, questionNumber, totalQuestions, previousQuestions = [] } = req.body;

        const domainInfo = DOMAINS[domain];
        if (!domainInfo) {
            return res.status(400).json({ success: false, error: "Invalid domain" });
        }

        const difficultyPrompts = {
            beginner: "Ask a basic conceptual question suitable for freshers or beginners.",
            intermediate: "Ask a moderate difficulty question that tests practical knowledge.",
            expert: "Ask a challenging question that tests deep understanding and real-world experience."
        };

        const previousQuestionsText = previousQuestions.length > 0
            ? `\n\nDo NOT repeat these questions:\n${previousQuestions.join('\n')}`
            : '';

        const prompt = `You are an expert technical interviewer conducting a ${domainInfo.name} interview.

${difficultyPrompts[difficulty] || difficultyPrompts.intermediate}

This is question ${questionNumber} of ${totalQuestions}.
${previousQuestionsText}

Generate ONE technical interview question about ${domainInfo.name}.

IMPORTANT: Respond in this EXACT JSON format only, no other text:
{
  "question": "Your question here",
  "expectedAnswer": "The ideal answer (2-3 sentences)",
  "keyPoints": ["point1", "point2", "point3"],
  "hint": "A helpful hint without giving away the answer",
  "topic": "Specific topic within ${domainInfo.name}",
  "companyRelevance": "This type of question is commonly asked at companies like..."
}`;

        const response = await getClient().chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: "You are a technical interviewer. Always respond with valid JSON only." },
                { role: "user", content: prompt }
            ],
            temperature: 0.8,
            max_tokens: 800,
        });

        const content = response.choices[0].message.content;

        // Parse the JSON response
        let questionData;
        try {
            // Try to extract JSON from the response
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                questionData = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error("No JSON found in response");
            }
        } catch (parseError) {
            // Fallback if parsing fails
            questionData = {
                question: content,
                expectedAnswer: "Answer verification will be done manually",
                keyPoints: [],
                hint: "Think about the core concepts",
                topic: domainInfo.name,
                companyRelevance: "Common interview question"
            };
        }

        res.json({
            success: true,
            data: {
                ...questionData,
                domain: domainInfo.name,
                domainIcon: domainInfo.icon,
                difficulty,
                questionNumber,
                totalQuestions
            }
        });

    } catch (error) {
        console.error("Error generating question:", error);
        res.status(500).json({ success: false, error: "Failed to generate question" });
    }
};

// Evaluate user's answer
const evaluateAnswer = async (req, res) => {
    try {
        const { question, userAnswer, expectedAnswer, keyPoints, domain } = req.body;

        if (!userAnswer || userAnswer.trim().length < 5) {
            return res.json({
                success: true,
                data: {
                    isCorrect: false,
                    score: 0,
                    maxScore: 10,
                    feedback: "Your answer is too short. Please provide a more detailed response.",
                    correctAnswer: expectedAnswer,
                    improvement: "Try to explain your answer with examples and key concepts."
                }
            });
        }

        const prompt = `You are evaluating a technical interview answer.

QUESTION: ${question}

EXPECTED ANSWER: ${expectedAnswer}

KEY POINTS TO COVER: ${keyPoints?.join(', ') || 'General understanding'}

USER'S ANSWER: ${userAnswer}

Evaluate the answer and respond in this EXACT JSON format:
{
  "isCorrect": true/false (true if answer covers main concepts, even if not perfect),
  "score": number from 0-10,
  "feedback": "Specific feedback on their answer",
  "correctAnswer": "The complete correct answer",
  "keyPointsCovered": ["points they got right"],
  "keyPointsMissed": ["points they missed"],
  "improvement": "How they can improve this answer"
}`;

        const response = await getClient().chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: "You are a fair technical interview evaluator. Always respond with valid JSON only." },
                { role: "user", content: prompt }
            ],
            temperature: 0.3,
            max_tokens: 600,
        });

        const content = response.choices[0].message.content;

        let evaluationData;
        try {
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                evaluationData = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error("No JSON found");
            }
        } catch (parseError) {
            // Fallback evaluation
            const isLongAnswer = userAnswer.length > 50;
            evaluationData = {
                isCorrect: isLongAnswer,
                score: isLongAnswer ? 5 : 2,
                feedback: "Answer evaluated",
                correctAnswer: expectedAnswer,
                keyPointsCovered: [],
                keyPointsMissed: keyPoints || [],
                improvement: "Try to be more specific"
            };
        }

        res.json({ success: true, data: evaluationData });

    } catch (error) {
        console.error("Error evaluating answer:", error);
        res.status(500).json({ success: false, error: "Failed to evaluate answer" });
    }
};

// Get hint for question
const getHint = async (req, res) => {
    try {
        const { question, hint, domain } = req.body;

        // If we already have a hint, return a more detailed one
        const prompt = `For this technical interview question about ${domain}:
"${question}"

The basic hint is: "${hint}"

Provide a more detailed hint that helps without giving away the answer. Keep it to 2 sentences.`;

        const response = await getClient().chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "user", content: prompt }
            ],
            temperature: 0.5,
            max_tokens: 150,
        });

        res.json({
            success: true,
            hint: response.choices[0].message.content
        });

    } catch (error) {
        console.error("Error getting hint:", error);
        res.json({ success: true, hint: req.body.hint || "Think about the fundamental concepts." });
    }
};

// Generate interview summary
const generateSummary = async (req, res) => {
    try {
        const { domain, difficulty, results, totalTime, totalQuestions } = req.body;

        const correctCount = results.filter(r => r.isCorrect).length;
        const totalScore = results.reduce((sum, r) => sum + (r.score || 0), 0);
        const maxScore = totalQuestions * 10;

        const topicsAttempted = [...new Set(results.map(r => r.topic))];
        const weakTopics = results
            .filter(r => !r.isCorrect || r.score < 5)
            .map(r => r.topic)
            .filter((v, i, a) => a.indexOf(v) === i);

        const prompt = `Analyze this interview performance and give personalized advice:

Domain: ${domain}
Difficulty: ${difficulty}
Score: ${totalScore}/${maxScore} (${Math.round(totalScore / maxScore * 100)}%)
Correct: ${correctCount}/${totalQuestions}
Time: ${Math.round(totalTime / 60)} minutes
Topics covered: ${topicsAttempted.join(', ')}
Weak areas: ${weakTopics.join(', ') || 'None identified'}

Provide a brief, encouraging summary with 3 specific improvement tips. Keep it under 150 words.`;

        const response = await getClient().chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: 300,
        });

        res.json({
            success: true,
            summary: {
                totalScore,
                maxScore,
                percentage: Math.round(totalScore / maxScore * 100),
                correctCount,
                totalQuestions,
                totalTime,
                weakTopics,
                advice: response.choices[0].message.content,
                grade: totalScore >= maxScore * 0.8 ? 'A' :
                    totalScore >= maxScore * 0.6 ? 'B' :
                        totalScore >= maxScore * 0.4 ? 'C' : 'D'
            }
        });

    } catch (error) {
        console.error("Error generating summary:", error);
        res.status(500).json({ success: false, error: "Failed to generate summary" });
    }
};

module.exports = {
    getDomains,
    generateQuestion,
    evaluateAnswer,
    getHint,
    generateSummary
};
