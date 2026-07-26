import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../utils/axiosClient";
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import './ChatAi.css';

function ChatAi({ problem }) {
    const [messages, setMessages] = useState([
        { 
            role: 'model', 
            parts: [{ text: `👋 Hi! I'm your AI DSA tutor. I can help you with:\n\n• **Hints** - Get step-by-step guidance\n• **Debug** - Find bugs in your code\n• **Explain** - Understand the approach\n• **Optimize** - Improve your solution\n\nHow can I help you with "${problem?.title || 'this problem'}"?` }]
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const onSubmit = async (data) => {
        const userMessage = { role: 'user', parts: [{ text: data.message }] };
        setMessages(prev => [...prev, userMessage]);
        reset();
        setIsLoading(true);

        try {
            const res = await axiosClient.post('/ai/chat', {
                messages: [...messages, userMessage],
                title: problem?.title,
                description: problem?.description,
                testCases: JSON.stringify(problem?.visibleTestCases),
                startCode: JSON.stringify(problem?.startCode)
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

    return (
        <div className="chat-ai-container">
            {/* Header */}
            <div className="chat-header">
                <div className="chat-header-icon">
                    <Sparkles size={20} />
                </div>
                <div className="chat-header-info">
                    <h3>AI Tutor</h3>
                    <span className="chat-status">
                        <span className="status-dot"></span>
                        Online
                    </span>
                </div>
            </div>

            {/* Messages */}
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

            {/* Input */}
            <form onSubmit={handleSubmit(onSubmit)} className="chat-input-form">
                <div className="chat-input-wrapper">
                    <input 
                        placeholder="Ask about hints, approach, or debug help..." 
                        className="chat-input" 
                        disabled={isLoading}
                        {...register("message", { required: true, minLength: 2 })}
                    />
                    <button 
                        type="submit" 
                        className="chat-send-btn"
                        disabled={isLoading || errors.message}
                    >
                        <Send size={18} />
                    </button>
                </div>
                <div className="chat-input-hint">
                    Press Enter to send • Powered by AI
                </div>
            </form>
        </div>
    );
}

export default ChatAi;