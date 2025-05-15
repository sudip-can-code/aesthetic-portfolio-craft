
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

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

  return (
    <section id="home" className="min-h-screen flex flex-col items-center justify-center pt-16">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className={`space-y-4 transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-10'}`}>
          <div className="flex justify-between mb-6">
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold mb-1">Project Experience</p>
              <p className="text-sm">VIDEO EDITING</p>
              <p className="text-sm">GRAPHICS DESIGNER</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wider font-semibold mb-1">Since 2020</p>
              <p className="text-sm">COMPLETED 1000+ PROJECT</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <div className={`relative animate-fade-in delay-300 duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="w-64 h-64 md:w-80 md:h-80 overflow-hidden">
              <img 
                src="/lovable-uploads/1021feb9-789c-49b6-8094-424f26c9afb3.png" 
                alt="Portfolio Portrait" 
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2 text-center mt-8 animate-fade-up">
          <p className="text-lg mb-2">Hi, I'M</p>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Your Name</h1>
          <div className="flex justify-center mt-12">
            <button 
              onClick={scrollToProjects}
              className="flex items-center text-sm uppercase tracking-widest">
              Projects
              <span className="ml-2 animate-bounce">
                <ChevronDown size={16} />
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
