import { useRef, useEffect, useCallback } from 'react';
import ControllerBody from './controller/ControllerBody';
import { useControllerNavigation } from '@/hooks/useControllerNavigation';
import { useControllerVisibility } from '@/hooks/useControllerVisibility';
import { Direction } from './controller/DPad';
import { Button } from './controller/types';
import { useNavigation } from './ArcadeScreen';
import { TAB_ORDER, BUTTON_TO_TAB_MAP } from '@/constants/navigation';

const RetroController = () => {
  const controllerRef = useRef<HTMLDivElement>(null);
  const { currentSection, setCurrentSection } = useNavigation();
  const { 
    activeDirection, 
    activeButton, 
    keyPressed, 
    handleDPadClick, 
    handleButtonClick,
    handleScroll,
    setKeyPressedState,
    setActiveDirectionState,
    setActiveButtonState
  } = useControllerNavigation();
  const { isVisible } = useControllerVisibility(controllerRef);

  // Handle directional navigation
  const handleDirectionalNav = useCallback((direction: 'left' | 'right') => {
    const currentIndex = TAB_ORDER.indexOf(currentSection as any);
    let newIndex;
    
    if (direction === 'left') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : TAB_ORDER.length - 1;
    } else {
      newIndex = currentIndex < TAB_ORDER.length - 1 ? currentIndex + 1 : 0;
    }
    
    setCurrentSection(TAB_ORDER[newIndex]);
  }, [currentSection, setCurrentSection]);

  // Enhanced handler for button clicks
  const onButtonClick = useCallback((button: Button) => {
    console.log(`RetroController: Button clicked: ${button}`);
    
    // Handle navigation for mapped buttons
    if (button && BUTTON_TO_TAB_MAP[button as keyof typeof BUTTON_TO_TAB_MAP]) {
      setCurrentSection(BUTTON_TO_TAB_MAP[button as keyof typeof BUTTON_TO_TAB_MAP]);
    }
    
    // Also call the original handler for visual feedback
    handleButtonClick(button);
  }, [handleButtonClick, setCurrentSection]);

  // Enhanced handler for D-pad clicks
  const onDirectionClick = useCallback((direction: Direction) => {
    console.log(`RetroController: Direction clicked: ${direction}`);
    
    // Handle left/right navigation
    if (direction === 'left' || direction === 'right') {
      handleDirectionalNav(direction);
    }
    
    // Call the original handler for up/down scrolling and visual feedback
    handleDPadClick(direction);
  }, [handleDPadClick, handleDirectionalNav]);

  // Handle keyboard navigation with proper visual feedback
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      console.log(`Key pressed: ${key}`);
      
      // Handle directional keys
      switch (key) {
        case 'arrowleft':
          setActiveDirectionState('left');
          setKeyPressedState('left');
          handleDirectionalNav('left');
          break;
        case 'arrowright':
          setActiveDirectionState('right');
          setKeyPressedState('right');
          handleDirectionalNav('right');
          break;
        case 'arrowup':
          setActiveDirectionState('up');
          setKeyPressedState('up');
          handleScroll('up');
          break;
        case 'arrowdown':
          setActiveDirectionState('down');
          setKeyPressedState('down');
          handleScroll('down');
          break;
        case 'a':
        case 'b':
        case 'x':
        case 'y':
          setActiveButtonState(key as Button);
          if (BUTTON_TO_TAB_MAP[key as keyof typeof BUTTON_TO_TAB_MAP]) {
            setCurrentSection(BUTTON_TO_TAB_MAP[key as keyof typeof BUTTON_TO_TAB_MAP]);
          }
          break;
        default:
          break;
      }
    };

    const handleKeyUp = () => {
      setActiveDirectionState('neutral');
      setActiveButtonState(null);
      setKeyPressedState(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleDirectionalNav, setCurrentSection, handleScroll, setKeyPressedState, setActiveDirectionState, setActiveButtonState]);

  return (
    <div 
      ref={controllerRef} 
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-20'}`}
    >
      <ControllerBody 
        activeDirection={activeDirection}
        activeButton={activeButton}
        keyPressed={keyPressed}
        onDirectionClick={onDirectionClick}
        onButtonClick={onButtonClick}
      />
    </div>
  );
};

export default RetroController;
