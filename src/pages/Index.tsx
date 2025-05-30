import { useState } from 'react';
import ArcadeMachine from '@/components/ArcadeMachine';
import ArcadeScreen from '@/components/ArcadeScreen';
import RetroController from '@/components/RetroController';
import { NavigationContext } from '@/components/ArcadeScreen';

const Index = () => {
  const [showResume, setShowResume] = useState(false);
  const [currentSection, setCurrentSection] = useState("about");

  const handleZoomComplete = () => {
    setShowResume(true);
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-arcade-darkPurple">
      {!showResume ? (
        <ArcadeMachine onZoomComplete={handleZoomComplete} />
      ) : (
        <NavigationContext.Provider value={{ currentSection, setCurrentSection }}>
          <ArcadeScreen />
          <RetroController />
        </NavigationContext.Provider>
      )}
    </div>
  );
};

export default Index;
