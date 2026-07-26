import React, { useState } from 'react';
import GeminiTutorModal from './GeminiTutorModal';

/**
 * Ask AI Tutor Button - Opens Gemini Tutor modal with explanations
 */
const AskTutorButton = ({ topic = 'default' }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button className="ask-tutor-btn" onClick={() => setIsModalOpen(true)}>
        <span className="tutor-icon">✨</span>
        Ask AI Tutor
      </button>
      
      <GeminiTutorModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        topic={topic}
      />
    </>
  );
};

export default AskTutorButton;
