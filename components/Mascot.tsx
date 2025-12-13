import React from 'react';

export const Mascot: React.FC<{ mood: 'happy' | 'thinking' | 'excited' }> = ({ mood }) => {
  // Using Sanrio GIFs hosted on GitHub User Content for authentic style
  // These are reliable links often used in developer profiles
  const images = {
    // Happy/Menu: Hello Kitty (Dancing/Happy)
    happy: "https://user-images.githubusercontent.com/14011726/94132137-7d4fc100-fe7c-11ea-8512-69f90cb65e48.gif",
    
    // Thinking/Waiting: Cinnamoroll (Floating peacefully)
    thinking: "https://user-images.githubusercontent.com/13468728/235327293-1320092c-567e-4043-bf6b-952467972767.gif",
    
    // Excited/Correct: Pompompurin (Dancing/Cheering)
    excited: "https://user-images.githubusercontent.com/13468728/235327303-c0d15197-0b04-482a-89a3-5c024508493e.gif"
  };

  return (
    <div className="w-40 h-40 relative mx-auto mb-2 animate-float filter drop-shadow-md flex items-center justify-center">
       <img 
         src={images[mood]} 
         alt={`Sanrio Character ${mood}`} 
         className="w-full h-full object-contain"
       />
    </div>
  );
};
