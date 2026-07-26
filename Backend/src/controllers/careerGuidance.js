const OpenAI = require("openai");

const GROQ_BASE_URL = "https://api.groq.com/openai/v1";
const ROADMAP_MODEL = "llama-3.3-70b-versatile";

const getGroqClient = () => {
    if (!process.env.GROQ_API_KEY) {
        throw new Error("Missing GROQ_API_KEY environment variable");
    }

    return new OpenAI({
        apiKey: process.env.GROQ_API_KEY,
        baseURL: GROQ_BASE_URL,
    });
};

const toStringValue = (value, fallback = "") => {
    if (typeof value === "string") return value.trim();
    if (value === null || value === undefined) return fallback;
    return String(value).trim();
};

const toStringArray = (value) => {
    if (!Array.isArray(value)) return [];
    return value
        .map((item) => toStringValue(item))
        .filter(Boolean);
};

const extractJsonPayload = (raw) => {
    const text = toStringValue(raw);
    if (!text) return "";

    const cleaned = text
        .replace(/```json\s*/gi, "")
        .replace(/```\s*/g, "")
        .trim();

    if (cleaned.startsWith("{") && cleaned.endsWith("}")) {
        return cleaned;
    }

    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
        return cleaned.slice(start, end + 1);
    }

    return cleaned;
};

const normalizeSkill = (skill) => ({
    skill_name: toStringValue(skill?.skill_name, "Core Skill"),
    concepts: toStringArray(skill?.concepts),
    tools: toStringArray(skill?.tools),
    resources: toStringArray(skill?.resources),
    practice_projects: toStringArray(skill?.practice_projects),
});

const normalizePhase = (phase, fallbackName) => ({
    phase_name: toStringValue(phase?.phase_name, fallbackName),
    duration: toStringValue(phase?.duration, "TBD"),
    skills_to_learn: Array.isArray(phase?.skills_to_learn)
        ? phase.skills_to_learn.map(normalizeSkill)
        : [],
});

const normalizeProject = (project) => {
    if (typeof project === "string") {
        return {
            name: project,
            description: "",
            key_features: [],
            tech_stack: [],
        };
    }

    return {
        name: toStringValue(project?.name, "Project"),
        description: toStringValue(project?.description),
        key_features: toStringArray(project?.key_features),
        tech_stack: toStringArray(project?.tech_stack),
    };
};

const normalizeRoadmap = (raw, selectedCareer) => {
    const phases = Array.isArray(raw?.learning_phases) ? raw.learning_phases : [];

    const normalizedPhases = [
        normalizePhase(phases[0], "Beginner"),
        normalizePhase(phases[1], "Intermediate"),
        normalizePhase(phases[2], "Advanced"),
    ];

    return {
        career_name: toStringValue(raw?.career_name, selectedCareer),
        career_overview: toStringValue(raw?.career_overview),
        who_is_this_for: toStringValue(raw?.who_is_this_for),
        estimated_timeline: toStringValue(raw?.estimated_timeline),
        salary_range_india: toStringValue(raw?.salary_range_india),
        salary_range_global: toStringValue(raw?.salary_range_global),
        learning_phases: normalizedPhases,
        real_world_projects: Array.isArray(raw?.real_world_projects)
            ? raw.real_world_projects.map(normalizeProject)
            : [],
        certifications: toStringArray(raw?.certifications),
        internship_guidance: toStringValue(raw?.internship_guidance),
        portfolio_guidance: toStringValue(raw?.portfolio_guidance),
        interview_preparation: {
            technical_topics: toStringArray(raw?.interview_preparation?.technical_topics),
            system_design_topics: toStringArray(raw?.interview_preparation?.system_design_topics),
            behavioral_preparation: toStringArray(raw?.interview_preparation?.behavioral_preparation),
        },
        career_growth_path: toStringArray(raw?.career_growth_path),
        common_mistakes_to_avoid: toStringArray(raw?.common_mistakes_to_avoid),
        final_advice: toStringValue(raw?.final_advice),
    };
};

const hasRequiredRoadmapShape = (roadmap) => {
    return Boolean(
        roadmap.career_name &&
        roadmap.career_overview &&
        roadmap.learning_phases.length === 3 &&
        roadmap.learning_phases.every((phase) => Array.isArray(phase.skills_to_learn)) &&
        roadmap.interview_preparation &&
        Array.isArray(roadmap.interview_preparation.technical_topics) &&
        Array.isArray(roadmap.interview_preparation.system_design_topics) &&
        Array.isArray(roadmap.interview_preparation.behavioral_preparation)
    );
};

const parseRoadmapResponse = (rawContent, selectedCareer) => {
    const payload = extractJsonPayload(rawContent);
    const parsed = JSON.parse(payload);
    return normalizeRoadmap(parsed, selectedCareer);
};

const buildRoadmapPrompt = (career) => `You are an expert IT career mentor and curriculum architect.

Your task is to generate a COMPLETE and STRUCTURED career roadmap in the IT field.

The roadmap must be:

- Extremely well-structured
- Easy to understand
- Beginner-friendly but detailed
- Professionally organized
- No important topic should be missing
- Designed for UI rendering (clean hierarchy)

Generate a roadmap for: ${career}

Strictly follow this JSON structure:

{
  "career_name": "",
  "career_overview": "",
  "who_is_this_for": "",
  "estimated_timeline": "",
  "salary_range_india": "",
  "salary_range_global": "",
  "learning_phases": [
    {
      "phase_name": "Beginner",
      "duration": "",
      "skills_to_learn": [
        {
          "skill_name": "",
          "concepts": [],
          "tools": [],
          "resources": [],
          "practice_projects": []
        }
      ]
    },
    {
      "phase_name": "Intermediate",
      "duration": "",
      "skills_to_learn": []
    },
    {
      "phase_name": "Advanced",
      "duration": "",
      "skills_to_learn": []
    }
  ],
  "real_world_projects": [
    {
      "name": "",
      "description": "",
      "key_features": [],
      "tech_stack": []
    }
  ],
  "certifications": [],
  "internship_guidance": "",
  "portfolio_guidance": "",
  "interview_preparation": {
    "technical_topics": [],
    "system_design_topics": [],
    "behavioral_preparation": []
  },
  "career_growth_path": [],
  "common_mistakes_to_avoid": [],
  "final_advice": ""
}

Rules:
- Do not skip important concepts.
- Include modern tools and industry-relevant technologies.
- Include both theory + practical.
- Keep explanations concise but complete.
- Make it visually structured and clean.
- No markdown formatting.
- Return ONLY valid JSON.`;

const repairToStrictJson = async (client, rawText, career) => {
    const repairPrompt = `Fix and return valid JSON only using the exact roadmap schema below. Keep all content career-specific for ${career}.\n\nSchema keys must be exactly: career_name, career_overview, who_is_this_for, estimated_timeline, salary_range_india, salary_range_global, learning_phases, real_world_projects, certifications, internship_guidance, portfolio_guidance, interview_preparation, career_growth_path, common_mistakes_to_avoid, final_advice.\n\nRaw input:\n${rawText}`;

    const fixed = await client.chat.completions.create({
        model: ROADMAP_MODEL,
        temperature: 0.1,
        messages: [
            { role: "system", content: "You repair malformed JSON. Return JSON only." },
            { role: "user", content: repairPrompt },
        ],
    });

    return fixed.choices?.[0]?.message?.content || "";
};

const careerGuidance = async (req, res) => {
    try {
        const { messages, topic } = req.body;

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({
                message: "Messages array is required"
            });
        }

        const client = getGroqClient();

        const systemInstruction = `
You are a compassionate and experienced Career & Life Coach AI, specializing in helping developers and students navigate their tech career journey. You provide guidance on mental wellness, career growth, and personal development.

## YOUR EXPERTISE AREAS:

### Mental Wellness & Stress Management
- Techniques to handle coding burnout
- Managing interview anxiety
- Work-life balance strategies
- Mindfulness for developers
- Dealing with imposter syndrome

### Overcoming Challenges
- Dealing with rejection from companies
- Building confidence after failures
- Overcoming fear of coding interviews
- Handling comparison with peers
- Managing underconfidence

### Routine & Productivity
- Creating effective study schedules
- Time management for working professionals
- Building consistent coding habits
- Balancing learning with job/studies
- Deep work strategies for developers

### Career Growth & Company Preparation
- Roadmaps to crack FAANG/top companies
- DSA preparation strategies
- System design learning path
- Resume building tips
- Interview preparation timeline

### Motivation & Mindset
- Growth mindset development
- Setting realistic goals
- Celebrating small wins
- Long-term career vision
- Finding purpose in tech

## RESPONSE STYLE:
- Be warm, empathetic, and supportive
- Use encouraging language
- Provide actionable advice
- Share practical examples
- Break down complex advice into steps
- Give specific timeframes when suggesting routines

## CURRENT TOPIC/CONTEXT:
${topic || "General career guidance"}

## IMPORTANT:
- Always be supportive and non-judgmental
- Acknowledge the user's feelings
- Provide hope and practical solutions
- If user seems very distressed, gently suggest professional help
- Focus on growth and progress, not perfection
`;

        const formattedMessages = [
            { role: "system", content: systemInstruction },
            ...messages.map(msg => ({
                role: msg.role === "user" ? "user" : "assistant",
                content: msg.parts?.[0]?.text || msg.content || msg.text || ""
            }))
        ];

        const completion = await client.chat.completions.create({
            model: ROADMAP_MODEL,
            messages: formattedMessages,
        });

        res.status(201).json({
            message: completion.choices[0].message.content
        });

    } catch (err) {
        console.error("Career Guidance AI Error:", err.message);

        if (err.message && err.message.includes("429")) {
            return res.status(429).json({
                message: "Rate limit exceeded. Please wait and try again.",
                retryAfter: 60
            });
        }

        res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    }
};

const getMotivationalQuote = async (req, res) => {
    try {
        const { mood } = req.body;
        const client = getGroqClient();

        const prompt = `Generate a powerful, unique motivational quote for a developer/student who is feeling: "${mood || "need motivation"}"\n\nThe quote should be:\n- Inspiring and relevant to tech/coding journey\n- Not a commonly used quote\n- Include the quote and a brief explanation of its meaning\n\nFormat:\n"[QUOTE]" - [Author or "Anonymous"]\n\nExplanation: [Brief explanation]`;

        const completion = await client.chat.completions.create({
            model: ROADMAP_MODEL,
            messages: [
                { role: "system", content: "You are a motivational coach who creates powerful, unique quotes for developers." },
                { role: "user", content: prompt }
            ],
        });

        res.status(201).json({
            quote: completion.choices[0].message.content
        });

    } catch (err) {
        console.error("Quote Generation Error:", err.message);
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    }
};

const generateRoadmap = async (req, res) => {
    try {
        const careerInput = toStringValue(req.body?.career || req.body?.goal);
        const currentLevel = toStringValue(req.body?.currentLevel);
        const timeframe = toStringValue(req.body?.timeframe);

        if (!careerInput) {
            return res.status(400).json({ success: false, message: "Career name is required" });
        }

        const career = [careerInput, currentLevel && `for ${currentLevel} learners`, timeframe && `within ${timeframe}`]
            .filter(Boolean)
            .join(' ');

        const client = getGroqClient();

        const completion = await client.chat.completions.create({
            model: ROADMAP_MODEL,
            temperature: 0.25,
            messages: [
                { role: "system", content: "You are a JSON generator. Return JSON only with no markdown." },
                { role: "user", content: buildRoadmapPrompt(career) },
            ],
        });

        const raw = completion?.choices?.[0]?.message?.content || "";

        let roadmap;
        try {
            roadmap = parseRoadmapResponse(raw, career);
        } catch (parseError) {
            const repaired = await repairToStrictJson(client, raw, career);
            roadmap = parseRoadmapResponse(repaired, career);
        }

        if (!hasRequiredRoadmapShape(roadmap)) {
            return res.status(502).json({
                success: false,
                message: "Model returned incomplete roadmap structure"
            });
        }

        res.status(200).json({ success: true, data: roadmap });
    } catch (err) {
        console.error("Roadmap Generation Error:", err.message);

        if (err.message && err.message.includes("429")) {
            return res.status(429).json({
                success: false,
                message: "Rate limit exceeded. Please wait and try again.",
                retryAfter: 60
            });
        }

        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message
        });
    }
};

module.exports = { careerGuidance, generateRoadmap, getMotivationalQuote };
