
import { ChevronDown, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";
import TypingAnimation from "./TypingAnimation";
import { Button } from "./ui/button";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToProjects = () => {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      window.scrollTo({
        top: projectsSection.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  const handleDownloadCV = () => {
    window.open('https://drive.google.com/drive/folders/1oiS7SySJeBGRDFnrAB-WXxL_1EWrNOJt?usp=sharing', '_blank');
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-16 relative">
      {/* Large Typing Animation Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="text-center mt-16">
          <TypingAnimation />
        </div>
      </div>

      <div className="container mx-auto flex flex-col items-center relative z-10">
        {/* Recent Role/Position and Since 2020 sections - positioned closer to neck */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start w-full max-w-4xl mb-8">
          <div className={`space-y-4 transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-10'} mt-24`}>
            <div className="mb-6">
              <p className="text-xs uppercase tracking-wider font-semibold mb-1">Recent Role/Position:</p>
              <p className="text-sm">Project Manager</p>
              <p className="text-sm">Project Supervisor</p>
            </div>
          </div>

          {/* Profile Picture - Center with smooth hover animation */}
          <div className={`relative animate-fade-in delay-300 duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'} flex justify-center`}>
            <div 
              className="relative w-[400px] h-[400px] md:w-[500px] md:h-[500px] overflow-hidden rounded-full mx-auto transition-all duration-700 ease-in-out hover:scale-110 cursor-pointer"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <img 
                src={theme === 'dark' ? "/lovable-uploads/f238441a-c29f-4a57-9bb8-f436bbb07a1b.png" : "/lovable-uploads/5ed59e3a-ec61-4fe2-a1d9-fae8e0b50c95.png"}
                alt="Portfolio Portrait" 
                className={`w-full h-full object-cover object-center ${theme === 'dark' ? 'grayscale' : 'grayscale'}`}
              />
            </div>
          </div>

          {/* Since 2020 - Right side positioned closer to neck */}
          <div className={`space-y-4 text-right transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-10'} mt-24`}>
            <div className="mb-6">
              <p className="text-xs uppercase tracking-wider font-semibold mb-1">Since 2020</p>
              <p className="text-sm">COMPLETED 2500+ PROJECTS</p>
            </div>
          </div>
        </div>
        
        {/* Name directly below profile picture - comes to front on hover */}
        <div className={`text-center -mt-6 transition-all duration-700 ease-in-out ${isHovered ? 'z-50 scale-110' : 'z-20'}`}>
          <h1 className="text-4xl md:text-5xl font-bold">Hi, I'm Sudip</h1>
        </div>
        
        {/* Download CV Button with shining effect */}
        <div className="mt-6 animate-fade-up">
          <Button 
            onClick={handleDownloadCV}
            className="relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 group"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></span>
            <Download className="mr-2 h-4 w-4" />
            Download My CV
          </Button>
        </div>
        
        {/* Animated down arrow only */}
        <div className="mt-8 animate-fade-up">
          <button 
            onClick={scrollToProjects}
            className="flex items-center justify-center p-2 rounded-full hover:bg-muted/50 transition-colors"
          >
            <span className="animate-bounce">
              <ChevronDown size={24} />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
