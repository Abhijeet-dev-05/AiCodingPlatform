import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import axiosClient from "../utils/axiosClient";
import ReactMarkdown from "react-markdown";
import { 
  Send, Bot, User, Sparkles, Loader2, Brain, Target, 
  Calendar, Rocket, Heart, Quote, ArrowLeft, Zap, 
  BookOpen, Trophy, Coffee, Moon, Sun, TrendingUp
} from 'lucide-react';
import './CareerGuidance.css';

const topics = [
  { id: 'stress', icon: <Brain size={20} />, label: 'Mental Wellness', color: '#ff6b9d' },
  { id: 'rejection', icon: <Heart size={20} />, label: 'Handling Rejection', color: '#ff8fab' },
  { id: 'routine', icon: <Calendar size={20} />, label: 'Daily Routine', color: '#00e5cc' },
  { id: 'faang', icon: <Rocket size={20} />, label: 'Crack FAANG', color: '#5eb3ff' },
  { id: 'confidence', icon: <Trophy size={20} />, label: 'Build Confidence', color: '#ffd93d' },
  { id: 'fear', icon: <Zap size={20} />, label: 'Overcome Fear', color: '#ff9f43' },
];

const quickPrompts = [
  "How do I deal with coding burnout?",
  "I got rejected, feeling demotivated",
  "Create a 6-month FAANG prep plan",
  "How to build consistent coding habit?",
  "I feel like an imposter, help me",
  "How to balance job and DSA prep?",
];

const formatRoadmap = (raw) => {
  if (!raw || typeof raw !== 'object') return null;

  const lines = [];
  lines.push(`# ${raw.career_name || 'Your Learning Roadmap'}`);
  if (raw.career_overview) lines.push(`\n${raw.career_overview}`);
  if (raw.who_is_this_for) lines.push(`\n**Who is this for:** ${raw.who_is_this_for}`);
  if (raw.estimated_timeline) lines.push(`\n**Estimated timeline:** ${raw.estimated_timeline}`);
  if (raw.salary_range_india) lines.push(`\n**Salary range (India):** ${raw.salary_range_india}`);
  if (raw.salary_range_global) lines.push(`\n**Salary range (Global):** ${raw.salary_range_global}`);

  const phases = Array.isArray(raw.learning_phases) ? raw.learning_phases : [];
  phases.forEach((phase, idx) => {
    lines.push(`\n## ${phase.phase_name || ['Beginner','Intermediate','Advanced'][idx]}`);
    if (phase.duration) lines.push(`**Duration:** ${phase.duration}`);
    const skills = Array.isArray(phase.skills_to_learn) ? phase.skills_to_learn : [];
    skills.forEach((skill) => {
      lines.push(`\n### ${skill.skill_name || 'Skill'}`);
      if (skill.concepts?.length) lines.push(`- **Concepts:** ${skill.concepts.join(', ')}`);
      if (skill.tools?.length) lines.push(`- **Tools:** ${skill.tools.join(', ')}`);
      if (skill.resources?.length) lines.push(`- **Resources:** ${skill.resources.join(', ')}`);
      if (skill.practice_projects?.length) lines.push(`- **Practice projects:** ${skill.practice_projects.join(', ')}`);
    });
  });

  const projects = Array.isArray(raw.real_world_projects) ? raw.real_world_projects : [];
  if (projects.length) {
    lines.push('\n## Real World Projects');
    projects.forEach((project) => {
      lines.push(`\n### ${project.name || 'Project'}`);
      if (project.description) lines.push(`${project.description}`);
      if (project.key_features?.length) lines.push(`- **Key features:** ${project.key_features.join(', ')}`);
      if (project.tech_stack?.length) lines.push(`- **Tech stack:** ${project.tech_stack.join(', ')}`);
    });
  }

  if (Array.isArray(raw.certifications) && raw.certifications.length) {
    lines.push('\n## Certifications');
    raw.certifications.forEach(cert => lines.push(`- ${cert}`));
  }

  if (raw.internship_guidance) lines.push(`\n## Internship Guidance\n${raw.internship_guidance}`);
  if (raw.portfolio_guidance) lines.push(`\n## Portfolio Guidance\n${raw.portfolio_guidance}`);

  if (raw.interview_preparation) {
    lines.push('\n## Interview Preparation');
    if (Array.isArray(raw.interview_preparation.technical_topics) && raw.interview_preparation.technical_topics.length) {
      lines.push('\n### Technical Topics');
      raw.interview_preparation.technical_topics.forEach(topic => lines.push(`- ${topic}`));
    }
    if (Array.isArray(raw.interview_preparation.system_design_topics) && raw.interview_preparation.system_design_topics.length) {
      lines.push('\n### System Design Topics');
      raw.interview_preparation.system_design_topics.forEach(topic => lines.push(`- ${topic}`));
    }
    if (Array.isArray(raw.interview_preparation.behavioral_preparation) && raw.interview_preparation.behavioral_preparation.length) {
      lines.push('\n### Behavioral Preparation');
      raw.interview_preparation.behavioral_preparation.forEach(topic => lines.push(`- ${topic}`));
    }
  }

  if (Array.isArray(raw.career_growth_path) && raw.career_growth_path.length) {
    lines.push('\n## Career Growth Path');
    raw.career_growth_path.forEach(item => lines.push(`- ${item}`));
  }

  if (Array.isArray(raw.common_mistakes_to_avoid) && raw.common_mistakes_to_avoid.length) {
    lines.push('\n## Common Mistakes to Avoid');
    raw.common_mistakes_to_avoid.forEach(item => lines.push(`- ${item}`));
  }

  if (raw.final_advice) lines.push(`\n## Final Advice\n${raw.final_advice}`);

  return lines.join('\n');
};

function CareerGuidance() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [roadmapData, setRoadmapData] = useState(null);
  const [dailyQuote, setDailyQuote] = useState(null);
  const [loadingQuote, setLoadingQuote] = useState(false);

  const { register, handleSubmit, reset, setValue } = useForm();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);



  const fetchQuote = async () => {
    setLoadingQuote(true);
    try {
      const response = await axiosClient.post("/career/quote", {
        mood: "need motivation for coding journey"
      });
      setDailyQuote(response.data.quote);
    } catch (error) {
      console.error("Error fetching quote:", error);
    } finally {
      setLoadingQuote(false);
    }
  };

  const onSubmit = async (data) => {
    const userMessage = { role: 'user', parts: [{ text: data.message }] };
    setMessages(prev => [...prev, userMessage]);
    reset();
    setIsLoading(true);

    try {
      const res = await axiosClient.post('/career/chat', {
        messages: [...messages, userMessage],
        topic: selectedTopic
      });

      const aiMessage = {
        role: 'model',
        parts: [{ text: res.data.message }]
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("API Error:", error);
      const errorMessage = {
        role: 'model',
        parts: [{ text: "⚠️ Sorry, I encountered an error. Please try again." }]
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (prompt) => {
    setValue("message", prompt);
  };

  const handleTopicSelect = async (topic) => {
    setSelectedTopic(topic.id);
    
    // Create a contextual message based on the topic
    const topicMessages = {
      stress: "I'd like to talk about mental wellness and managing stress as a developer. Can you help me with tips and guidance?",
      rejection: "I'm dealing with job rejections and feeling demotivated. Can you help me handle rejection better?",
      routine: "I want to build a productive daily routine for coding and career growth. Can you suggest an effective schedule?",
      faang: "I want to crack FAANG interviews. Can you guide me on how to prepare effectively?",
      confidence: "I struggle with self-confidence as a developer. How can I build more confidence in my skills?",
      fear: "I have fears about coding interviews and technical assessments. How can I overcome these fears?"
    };

    const userMessage = { 
      role: 'user', 
      parts: [{ text: topicMessages[topic.id] }] 
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const res = await axiosClient.post('/career/chat', {
        messages: [...messages, userMessage],
        topic: topic.id
      });

      const aiMessage = {
        role: 'model',
        parts: [{ text: res.data.message }]
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("API Error:", error);
      const errorMessage = {
        role: 'model',
        parts: [{ text: "⚠️ Sorry, I encountered an error. Please try again." }]
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateRoadmap = async () => {
    setShowRoadmap(true);
    setIsLoading(true);
    try {
      const response = await axiosClient.post("/career/roadmap", {
        goal: "Crack FAANG companies as a software engineer",
        currentLevel: "Intermediate",
        timeframe: "6 months"
      });
      
      const responseData = response.data;
      const roadmapPayload = responseData?.data || responseData?.roadmap || responseData;

      if (!roadmapPayload) {
        throw new Error("No roadmap data returned from server");
      }

      // If the backend returns structured roadmap data
      if (roadmapPayload.learning_phases) {
        const formatted = formatRoadmap(roadmapPayload);
        if (!formatted) {
          throw new Error("Unable to parse roadmap data");
        }
        setRoadmapData(formatRoadmap(roadmapPayload));
      } else if (roadmapPayload.textContent) {
        setRoadmapData(roadmapPayload.textContent);
      } else if (roadmapPayload.roadmap && typeof roadmapPayload.roadmap === 'object') {
        const roadmap = roadmapPayload.roadmap;
        let markdown = `# ${roadmap.title || 'Your Learning Roadmap'}\n\n`;
        
        if (roadmap.nodes && Array.isArray(roadmap.nodes)) {
          const levels = {};
          roadmap.nodes.forEach(node => {
            const level = node.level || 0;
            if (!levels[level]) levels[level] = [];
            levels[level].push(node);
          });
          Object.keys(levels).sort().forEach(level => {
            if (level == 0) {
              levels[level].forEach(node => {
                markdown += `## 🎯 ${node.label}\n${node.description || ''}\n\n`;
              });
            } else if (level == 1) {
              levels[level].forEach(node => {
                markdown += `### 📌 ${node.label}\n${node.description || ''}\n\n`;
              });
            } else {
              levels[level].forEach(node => {
                const icon = node.type === 'highlight' ? '⭐' : '•';
                markdown += `${icon} **${node.label}**: ${node.description || ''}\n\n`;
              });
            }
          });
        }
        setRoadmapData(markdown);
      } else {
        setRoadmapData("Roadmap generated successfully!");
      }
    } catch (error) {
      console.error("Roadmap Error:", error);
      setRoadmapData("Failed to generate roadmap. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="career-page">
      {/* Header */}
      <header className="career-header">
        {showRoadmap ? (
          <button onClick={() => setShowRoadmap(false)} className="back-btn">
            <ArrowLeft size={16} /> Back to Chat
          </button>
        ) : (
          <Link to="/" className="back-btn">
            <ArrowLeft size={16} /> Back Home
          </Link>
        )}
        <div className="header-center">
          <span className="animated-icon">🧠</span>
          <h1>Career Guidance</h1>
        </div>
        <div className="header-right"></div>
      </header>

      <div className="career-container">
        {/* Sidebar */}
        <aside className="career-sidebar">
          {/* Topic Selection */}
          <div className="sidebar-section">
            <h3><BookOpen size={16} /> Topics</h3>
            <div className="topics-grid">
              {topics.map(topic => (
                <button
                  key={topic.id}
                  className={`topic-btn ${selectedTopic === topic.id ? 'active' : ''}`}
                  onClick={() => handleTopicSelect(topic)}
                  style={{ '--topic-color': topic.color }}
                  disabled={isLoading}
                >
                  {topic.icon}
                  <span>{topic.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="sidebar-section">
            <h3><Zap size={16} /> Quick Actions</h3>
            <button className="action-btn roadmap" onClick={generateRoadmap}>
              <TrendingUp size={18} />
              Generate FAANG Roadmap
            </button>
            <button className="action-btn quote" onClick={fetchQuote}>
              <Quote size={18} />
              {loadingQuote ? 'Loading...' : 'Get Motivation'}
            </button>
          </div>

          {/* Daily Quote */}
          {dailyQuote && (
            <div className="quote-card">
              <Quote size={24} className="quote-icon" />
              <ReactMarkdown>{dailyQuote}</ReactMarkdown>
            </div>
          )}
        </aside>

        {/* Main Chat Area */}
        <main className="career-main">
          {showRoadmap ? (
            <div className="roadmap-view">
              <div className="roadmap-header">
                <h2><TrendingUp size={24} /> Your Learning Roadmap</h2>
              </div>
              <div className="roadmap-content">
                {isLoading ? (
                  <div className="loading-state">
                    <Loader2 size={40} className="spin" />
                    <p>Generating your personalized roadmap...</p>
                  </div>
                ) : (
                  <ReactMarkdown>{roadmapData}</ReactMarkdown>
                )}
              </div>
            </div>
          ) : (
            <>
              {messages.length === 0 ? (
                <div className="welcome-container">
                  <div className="welcome-content">
                    <div className="welcome-header">
                      <span className="welcome-icon">👋</span>
                      <h2>Welcome to Career Guidance!</h2>
                      <p>I'm your AI mentor here to help you with:</p>
                    </div>
                    
                    <div className="features-grid">
                      <div className="feature-item">
                        <span className="feature-icon">🧠</span>
                        <span><strong>Mental wellness</strong> & stress management</span>
                      </div>
                      <div className="feature-item">
                        <span className="feature-icon">💪</span>
                        <span><strong>Overcoming</strong> rejection & fear</span>
                      </div>
                      <div className="feature-item">
                        <span className="feature-icon">📅</span>
                        <span><strong>Building</strong> effective routines</span>
                      </div>
                      <div className="feature-item">
                        <span className="feature-icon">🎯</span>
                        <span><strong>Preparing</strong> for top companies</span>
                      </div>
                      <div className="feature-item">
                        <span className="feature-icon">⭐</span>
                        <span><strong>Boosting</strong> your confidence</span>
                      </div>
                    </div>

                    <p className="welcome-footer-text">
                      Select a topic from the sidebar or choose a question below. I'm here to support you. 💙
                    </p>

                    <div className="prompts-grid">
                      {quickPrompts.map((prompt, idx) => (
                        <button 
                          key={idx} 
                          className="prompt-card"
                          onClick={() => handleQuickPrompt(prompt)}
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="chat-messages">
                  {messages.map((msg, index) => (
                    <div 
                      key={index} 
                      className={`chat-message ${msg.role === "user" ? "user" : "ai"}`}
                    >
                      <div className="message-avatar">
                        {msg.role === "user" ? <User size={18} /> : <Bot size={18} />}
                      </div>
                      <div className="message-content">
                        <ReactMarkdown>{msg.parts[0].text}</ReactMarkdown>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="chat-message ai">
                      <div className="message-avatar">
                        <Bot size={18} />
                      </div>
                      <div className="message-content typing">
                        <div className="thinking-animation">
                          <div className="thinking-dots">
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                          </div>
                          <span className="thinking-text">AI is thinking</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              )}

              {/* Input */}
              <form onSubmit={handleSubmit(onSubmit)} className="chat-input-form">
                <div className="chat-input-wrapper">
                  <input 
                    placeholder="Ask about career, mental wellness, or motivation..." 
                    className="chat-input" 
                    disabled={isLoading}
                    {...register("message", { required: true })}
                  />
                  <button 
                    type="submit" 
                    className="chat-send-btn"
                    disabled={isLoading}
                  >
                    <Send size={18} />
                  </button>
                </div>
              </form>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default CareerGuidance;
