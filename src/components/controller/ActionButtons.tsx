import React from 'react';
import { Gamepad, Headphones, Disc, Clock } from 'lucide-react';
import { Button } from '@/components/controller/types';

interface ActionButtonsProps {
  activeButton: Button;
  onButtonClick: (button: Button) => void;
}

const ActionButtons = ({ activeButton, onButtonClick }: ActionButtonsProps) => {
  // Enhanced click handlers
  const handleButtonClick = (button: Button, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`Clicking action button: ${button}`);
    onButtonClick(button);
  };

  return (
    <div className="absolute right-6 top-1/2 -translate-y-1/2 w-24 h-24 bg-gray-500 rounded-full flex items-center justify-center">
      <div className="relative w-20 h-20">
        {/* Y button - Top - Experience */}
        <button 
          className={`absolute w-8 h-8 rounded-full top-0 left-1/2 -translate-x-1/2 -translate-y-1/4 
          ${activeButton === 'y' ? 'bg-arcade-cyan border-2 border-gray-800' : 'bg-arcade-cyan hover:bg-arcade-cyan/80'}`}
          onClick={(e) => handleButtonClick('y', e)}
          aria-label="Experience"
        >
          <Clock size={16} className="absolute inset-0 m-auto text-black" />
        </button>
        
        {/* X button - Left - Skills */}
        <button 
          className={`absolute w-8 h-8 rounded-full top-1/2 left-0 -translate-y-1/2 -translate-x-1/4 
          ${activeButton === 'x' ? 'bg-arcade-pink border-2 border-gray-800' : 'bg-arcade-pink hover:bg-arcade-pink/80'}`}
          onClick={(e) => handleButtonClick('x', e)}
          aria-label="Skills"
        >
          <Disc size={16} className="absolute inset-0 m-auto text-black" />
        </button>
        
        {/* B button - Right - Contact */}
        <button 
          className={`absolute w-8 h-8 rounded-full top-1/2 right-0 -translate-y-1/2 translate-x-1/4 
          ${activeButton === 'b' ? 'bg-arcade-orange border-2 border-gray-800' : 'bg-arcade-orange hover:bg-arcade-orange/80'}`}
          onClick={(e) => handleButtonClick('b', e)}
          aria-label="Contact"
        >
          <Headphones size={16} className="absolute inset-0 m-auto text-black" />
        </button>
        
        {/* A button - Bottom - About */}
        <button 
          className={`absolute w-8 h-8 rounded-full bottom-0 left-1/2 -translate-x-1/2 translate-y-1/4 
          ${activeButton === 'a' ? 'bg-arcade-purple border-2 border-gray-800' : 'bg-arcade-purple hover:bg-arcade-purple/80'}`}
          onClick={(e) => handleButtonClick('a', e)}
          aria-label="About"
        >
          <Gamepad size={16} className="absolute inset-0 m-auto text-black" />
        </button>
      </div>
    </div>
  );
};

export default ActionButtons;
