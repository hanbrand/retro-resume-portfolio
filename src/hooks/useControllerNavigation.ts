import { useState, useCallback } from 'react';
import { Direction } from '@/components/controller/DPad';
import { Button } from '@/components/controller/types';

export const useControllerNavigation = () => {
  const [activeDirection, setActiveDirection] = useState<Direction>('neutral');
  const [activeButton, setActiveButton] = useState<Button>(null);
  const [keyPressed, setKeyPressed] = useState<string | null>(null);
  
  // Simple scroll handling for up/down
  const handleScroll = useCallback((direction: 'up' | 'down') => {
    const scrollAmount = 150;
    window.scrollBy(0, direction === 'up' ? -scrollAmount : scrollAmount);
  }, []);

  // Function to handle D-pad button click
  const handleDPadClick = useCallback((direction: Direction) => {
    console.log(`D-pad clicked: ${direction}`);
    setActiveDirection(direction);
    
    switch (direction) {
      case 'up':
      case 'down':
        handleScroll(direction);
        break;
      case 'left':
      case 'right':
        // Navigation will be handled by RetroController
        break;
      default:
        break;
    }
    
    // Return to neutral position after a short delay
    setTimeout(() => {
      setActiveDirection('neutral');
    }, 200);
  }, [handleScroll]);

  // Function to handle action button click
  const handleButtonClick = useCallback((button: Button) => {
    console.log(`Button clicked: ${button}`);
    setActiveButton(button);
    
    // Reset button after a short delay
    setTimeout(() => {
      setActiveButton(null);
    }, 150);
  }, []);

  // Function to set key pressed state (for visual feedback)
  const setKeyPressedState = useCallback((key: string | null) => {
    setKeyPressed(key);
  }, []);

  // Function to set active direction (for keyboard visual feedback)
  const setActiveDirectionState = useCallback((direction: Direction) => {
    setActiveDirection(direction);
  }, []);

  // Function to set active button (for keyboard visual feedback)
  const setActiveButtonState = useCallback((button: Button) => {
    setActiveButton(button);
  }, []);

  return {
    activeDirection,
    activeButton,
    keyPressed,
    handleDPadClick,
    handleButtonClick,
    handleScroll,
    setKeyPressedState,
    setActiveDirectionState,
    setActiveButtonState
  };
};
