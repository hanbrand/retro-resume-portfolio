import { useEffect, useState, createContext, useContext, useRef } from 'react';
import { Gamepad, Headphones, Disc, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SkillsSection from './SkillsSection';
import ExperienceSection from './ExperienceSection';
import ProjectsSection from './ProjectsSection';
import ContactSection from './ContactSection';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Defined context interface for better type safety
interface NavigationContextType {
  currentSection: string;
  setTab: (section: string) => void;
}

// Create a context with a default value
export const NavigationContext = createContext<NavigationContextType>({
  currentSection: "about",
  setTab: () => {},
});

// Custom hook to use the navigation context
export const useNavigation = () => useContext(NavigationContext);

const ArcadeScreen = () => {
  const [loaded, setLoaded] = useState(false);
  const [currentSection, setCurrentSection] = useState("about");
  const tabsListRef = useRef<HTMLDivElement>(null);
  const tabsRefs = useRef<Record<string, HTMLElement | null>>({
    about: null,
    skills: null,
    experience: null,
    contact: null
  });

  // Function to explicitly focus a specific tab by id
  const focusTab = (tabId: string) => {
    const tabElement = document.getElementById(tabId);
    if (tabElement) {
      tabElement.click();
      setTimeout(() => {
        tabElement.focus();
      }, 10);
    }
  };

  // Unified tab change logic
  const setTab = (value: string) => {
    setCurrentSection(value);
    setTimeout(() => {
      const tabId = `${value}-tab`;
      focusTab(tabId);
      // Also scroll the content into view if needed
      const contentElement = document.getElementById(`${value}-content`);
      if (contentElement) {
        contentElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 10);
  };

  // Initialize tabs and focus handling
  useEffect(() => {
    // Simulate loading time for the retro effect
    const timer = setTimeout(() => {
      setLoaded(true);
      // Once loaded, initialize tab references
      setTimeout(() => {
        tabsRefs.current = {
          about: document.getElementById('about-tab'),
          skills: document.getElementById('skills-tab'),
          experience: document.getElementById('experience-tab'),
          contact: document.getElementById('contact-tab')
        };
        // Click the about tab to initialize it
        const aboutTab = tabsRefs.current.about;
        if (aboutTab) {
          aboutTab.click();
          aboutTab.focus();
        }
      }, 300);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Handler for tab changes from UI
  const handleTabChange = (value: string) => {
    setTab(value);
  };

  // Context value
  const navigationContextValue = {
    currentSection,
    setTab
  };

  return (
    <NavigationContext.Provider value={navigationContextValue}>
      <div className="relative w-full min-h-screen flex flex-col items-center bg-arcade-darkPurple overflow-x-hidden">
        {/* CRT overlay effect */}
        <div className="absolute inset-0 pointer-events-none crt z-10">
          <div className="scanline"></div>
        </div>
        {/* Content container */}
        <div className="relative w-full max-w-5xl px-4 py-8 z-0">
          {!loaded ? (
            <div className="h-screen flex flex-col items-center justify-center">
              <div className="text-4xl font-press-start text-arcade-pink animate-pulse mb-8">
                LOADING...
              </div>
              <div className="w-64 h-4 bg-arcade-darkPurple border border-arcade-cyan">
                <div className="h-full bg-arcade-cyan animate-pulse"></div>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="mb-8 text-center">
                <h1 className="text-2xl md:text-4xl font-press-start neon-text mb-2">BRANDON HAN</h1>
                <p className="text-sm md:text-base font-vt323 text-arcade-cyan">RESEARCH LAB MANAGER & ASPIRING ML ENGINEER</p>
              </div>
              {/* Main content */}
              <Tabs 
                value={currentSection} 
                onValueChange={handleTabChange} 
                className="w-full"
                defaultValue="about"
              >
                <div className="border-2 border-arcade-neonPink/50 rounded-md p-3 mb-8 bg-black/40 backdrop-blur">
                  <TabsList 
                    className="grid grid-cols-2 md:grid-cols-4 bg-transparent gap-2"
                    ref={tabsListRef}
                    role="tablist"
                    aria-label="Resume Sections"
                  >
                    <TabsTrigger
                      value="about"
                      className={`font-press-start text-xs flex gap-2 items-center data-[state=active]:bg-arcade-purple data-[state=active]:text-white bg-arcade-darkPurple text-white/70 border border-arcade-purple/50`}
                      id="about-tab"
                      role="tab"
                      aria-controls="about-content"
                      aria-selected={currentSection === "about"}
                      data-tab="about"
                    >
                      <Gamepad size={16} />
                      <span className="hidden sm:inline">About</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="skills"
                      className={`font-press-start text-xs flex gap-2 items-center data-[state=active]:bg-arcade-pink data-[state=active]:text-white bg-arcade-darkPurple text-white/70 border border-arcade-pink/50`}
                      id="skills-tab"
                      role="tab"
                      aria-controls="skills-content"
                      aria-selected={currentSection === "skills"}
                      data-tab="skills"
                    >
                      <Disc size={16} />
                      <span className="hidden sm:inline">Skills</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="experience"
                      className={`font-press-start text-xs flex gap-2 items-center data-[state=active]:bg-arcade-cyan data-[state=active]:text-black bg-arcade-darkPurple text-white/70 border border-arcade-cyan/50`}
                      id="experience-tab"
                      role="tab"
                      aria-controls="experience-content"
                      aria-selected={currentSection === "experience"}
                      data-tab="experience"
                    >
                      <Clock size={16} />
                      <span className="hidden sm:inline">Experience</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="contact"
                      className={`font-press-start text-xs flex gap-2 items-center data-[state=active]:bg-arcade-orange data-[state=active]:text-white bg-arcade-darkPurple text-white/70 border border-arcade-orange/50`}
                      id="contact-tab"
                      role="tab"
                      aria-controls="contact-content"
                      aria-selected={currentSection === "contact"}
                      data-tab="contact"
                    >
                      <Headphones size={16} />
                      <span className="hidden sm:inline">Contact</span>
                    </TabsTrigger>
                  </TabsList>
                </div>
                <div className="border-2 border-arcade-cyan/50 rounded-md p-4 bg-black/40 backdrop-blur min-h-[50vh]">
                  <TabsContent 
                    value="about" 
                    className="mt-0 focus-visible:outline-none"
                    id="about-content"
                    role="tabpanel"
                    aria-labelledby="about-tab"
                    tabIndex={0}
                  >
                    <div className="text-white font-vt323 space-y-4">
                      <h2 className="text-2xl font-press-start text-arcade-cyan mb-4">ABOUT ME</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1 flex justify-center">
                          <div className="w-48 h-48 border-4 border-arcade-neonPink relative overflow-hidden rounded-md">
                            {/* Profile avatar with arcade style */}
                            <Avatar className="w-full h-full">
                              <AvatarImage 
                                src="/lovable-uploads/23f92d99-2fa4-436e-b9d8-3c30361d23f6.png" 
                                alt="Brandon Han" 
                                className="object-cover w-full h-full"
                              />
                              <AvatarFallback className="bg-gradient-to-br from-arcade-purple to-arcade-pink">
                                <div className="text-6xl font-press-start text-white">BH</div>
                              </AvatarFallback>
                            </Avatar>
                            
                            {/* Scanline effect */}
                            <div className="absolute inset-0 scanline pointer-events-none"></div>
                          </div>
                        </div>
                        
                        <div className="md:col-span-2 space-y-4">
                          <p className="text-xl">
                            Research Lab Manager with 4+ years experience at UCLA, transitioning into an ML Engineering career after completing my Master's in Computer Science.
                          </p>
                          
                          <p>
                            I specialize in building AI-powered data processing systems and have developed numerous web applications and ML models to solve complex problems in healthcare and research.
                          </p>
                          
                          <div className="bg-arcade-darkPurple/50 border border-arcade-cyan/30 p-4 rounded-md">
                            <h3 className="text-arcade-cyan font-press-start text-sm mb-2">PLAYER STATS</h3>
                            <ul className="list-disc list-inside space-y-1">
                              <li>Expertise in Python, ML/DS Libraries, and Web Development</li>
                              <li>Secured $1.2M+ in funding for AI infrastructure development</li>
                              <li>Managed 120+ lab members and clients across multiple projects</li>
                              <li>Implemented AI-powered pipelines for data processing and analysis</li>
                              <li>Currently pursuing MS in Computer Science at USC (Expected Dec 2025)</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-8 p-4 border border-arcade-purple/30 rounded-md bg-gradient-to-r from-arcade-darkPurple to-black">
                        <h3 className="text-arcade-purple font-press-start text-sm mb-2">GAME CONTROLS</h3>
                        <p>Use the controller at the bottom of the screen or keyboard arrow keys to navigate through my resume.</p>
                        <ul className="mt-2 text-sm">
                          <li><span className="text-arcade-purple">Purple Button (A)</span>: About tab</li>
                          <li><span className="text-arcade-pink">Pink Button (X)</span>: Skills tab</li>
                          <li><span className="text-arcade-cyan">Cyan Button (Y)</span>: Experience tab</li>
                          <li><span className="text-arcade-orange">Orange Button (B)</span>: Contact tab</li>
                          <li><span className="text-white">D-pad Left/Right</span>: Navigate between tabs</li>
                          <li><span className="text-white">D-pad Up/Down</span>: Scroll content</li>
                        </ul>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent 
                    value="skills" 
                    className="mt-0 focus-visible:outline-none"
                    id="skills-content"
                    role="tabpanel"
                    aria-labelledby="skills-tab"
                    tabIndex={0}
                  >
                    <SkillsSection />
                  </TabsContent>

                  <TabsContent 
                    value="experience" 
                    className="mt-0 focus-visible:outline-none"
                    id="experience-content"
                    role="tabpanel"
                    aria-labelledby="experience-tab"
                    tabIndex={0}
                  >
                    <ExperienceSection />
                  </TabsContent>

                  <TabsContent 
                    value="contact" 
                    className="mt-0 focus-visible:outline-none"
                    id="contact-content"
                    role="tabpanel"
                    aria-labelledby="contact-tab"
                    tabIndex={0}
                  >
                    <ContactSection />
                  </TabsContent>
                </div>
              </Tabs>

              {/* Footer */}
              <div className="mt-8 text-center text-arcade-cyan font-vt323">
                <p className="animate-pulse">&copy; 2025 BRANDON HAN - RESUME ARCADE - INSERT COIN TO CONTINUE</p>
              </div>
            </>
          )}
        </div>
        
        {/* Ambient corners lighting */}
        <div className="fixed top-0 left-0 w-64 h-64 bg-arcade-pink/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="fixed bottom-0 right-0 w-64 h-64 bg-arcade-cyan/20 rounded-full blur-3xl pointer-events-none"></div>
      </div>
    </NavigationContext.Provider>
  );
};

export default ArcadeScreen;
