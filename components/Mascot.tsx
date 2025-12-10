import React from 'react';

export const Mascot: React.FC<{ mood: 'happy' | 'thinking' | 'excited' }> = ({ mood }) => {
  return (
    <div className="w-32 h-32 relative mx-auto mb-4 animate-bounce-slow">
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
        {/* Body */}
        <circle cx="50" cy="50" r="45" fill="#fff" stroke="#333" strokeWidth="3" />
        
        {/* Ears */}
        <circle cx="20" cy="20" r="12" fill="#333" />
        <circle cx="80" cy="20" r="12" fill="#333" />
        
        {/* Eyes */}
        <ellipse cx="35" cy="45" rx="6" ry="8" fill="#333" />
        <ellipse cx="65" cy="45" rx="6" ry="8" fill="#333" />
        <circle cx="37" cy="43" r="2" fill="#fff" />
        <circle cx="67" cy="43" r="2" fill="#fff" />

        {/* Nose */}
        <path d="M45 55 Q50 60 55 55" stroke="#333" strokeWidth="3" fill="none" />

        {/* Mouth varies by mood */}
        {mood === 'happy' && (
           <path d="M40 65 Q50 75 60 65" stroke="#333" strokeWidth="3" fill="none" strokeLinecap="round" />
        )}
        {mood === 'excited' && (
           <path d="M40 65 Q50 80 60 65" stroke="#333" strokeWidth="3" fill="#ff9999" />
        )}
        {mood === 'thinking' && (
           <circle cx="55" cy="70" r="3" fill="#333" />
        )}

        {/* Cheeks */}
        <circle cx="25" cy="60" r="5" fill="#ffc4d6" opacity="0.6" />
        <circle cx="75" cy="60" r="5" fill="#ffc4d6" opacity="0.6" />
      </svg>
    </div>
  );
};
