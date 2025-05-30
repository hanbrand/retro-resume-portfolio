import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

export type Direction = 'up' | 'down' | 'left' | 'right' | 'neutral';

interface DPadProps {
  activeDirection: Direction;
  keyPressed: string | null;
  onDirectionClick: (direction: Direction) => void;
}

const DPad = ({ activeDirection, keyPressed, onDirectionClick }: DPadProps) => {
  // Enhanced click handlers
  const handleDirectionClick = (direction: Direction, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`Clicking D-pad direction: ${direction}`);
    onDirectionClick(direction);
  };

  return (
    <div className="absolute left-6 top-1/2 -translate-y-1/2 w-20 h-20 bg-gray-400 rounded-full flex items-center justify-center">
      {/* D-pad cross */}
      <div className="relative w-16 h-16 bg-gray-300 rounded-sm">
        {/* D-pad border outline */}
        <div className="absolute inset-0 border-2 border-black rounded-sm"></div>
        
        {/* Up button */}
        <button 
          onClick={(e) => handleDirectionClick('up', e)}
          className={`absolute w-5 h-5 top-0 left-1/2 -translate-x-1/2 -translate-y-0 flex items-center justify-center bg-gray-300 hover:bg-gray-400 ${
            activeDirection === 'up' || keyPressed === 'up' ? 'text-arcade-cyan' : 'text-gray-600'
          }`}
          aria-label="Move up"
        >
          <ArrowUp size={14} className={`${keyPressed === 'up' || activeDirection === 'up' ? 'text-black' : 'text-gray-600'}`} />
        </button>
        
        {/* Down button */}
        <button 
          onClick={(e) => handleDirectionClick('down', e)}
          className={`absolute w-5 h-5 bottom-0 left-1/2 -translate-x-1/2 translate-y-0 flex items-center justify-center bg-gray-300 hover:bg-gray-400 ${
            activeDirection === 'down' || keyPressed === 'down' ? 'text-arcade-cyan' : 'text-gray-600'
          }`}
          aria-label="Move down"
        >
          <ArrowDown size={14} className={`${keyPressed === 'down' || activeDirection === 'down' ? 'text-black' : 'text-gray-600'}`} />
        </button>
        
        {/* Left button - enhanced for navigation */}
        <button 
          onClick={(e) => handleDirectionClick('left', e)}
          className={`absolute w-5 h-5 left-0 top-1/2 -translate-y-1/2 -translate-x-0 flex items-center justify-center bg-gray-300 hover:bg-gray-400 ${
            activeDirection === 'left' || keyPressed === 'left' ? 'text-arcade-cyan' : 'text-gray-600'
          }`}
          aria-label="Move left"
        >
          <ArrowLeft size={14} className={`${keyPressed === 'left' || activeDirection === 'left' ? 'text-black' : 'text-gray-600'}`} />
        </button>
        
        {/* Right button - enhanced for navigation */}
        <button 
          onClick={(e) => handleDirectionClick('right', e)}
          className={`absolute w-5 h-5 right-0 top-1/2 -translate-y-1/2 translate-x-0 flex items-center justify-center bg-gray-300 hover:bg-gray-400 ${
            activeDirection === 'right' || keyPressed === 'right' ? 'text-arcade-cyan' : 'text-gray-600'
          }`}
          aria-label="Move right"
        >
          <ArrowRight size={14} className={`${keyPressed === 'right' || activeDirection === 'right' ? 'text-black' : 'text-gray-600'}`} />
        </button>

        {/* Center circle */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gray-400 rounded-full"></div>
      </div>
    </div>
  );
};

export default DPad;
