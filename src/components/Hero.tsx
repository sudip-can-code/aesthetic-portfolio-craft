
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
    <section id="home" className="min-h-screen flex items-center justify-center pt-16">
      <div className="container mx-auto flex flex-col items-center">
        <div className={`relative animate-fade-in delay-300 duration-1000 mb-8 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-80 h-80 md:w-[400px] md:h-[400px] overflow-hidden rounded-full">
            <img 
              src="/lovable-uploads/5ed59e3a-ec61-4fe2-a1d9-fae8e0b50c95.png" 
              alt="Portfolio Portrait" 
              className="w-full h-full object-cover object-center grayscale"
            />
          </div>
        </div>
        
        <div className="mb-12 text-center">
          <p className="text-lg mb-2">Hi, I'M</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Sudeep</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-full max-w-3xl">
          <div className={`space-y-4 transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-10'}`}>
            <div className="mb-6">
              <p className="text-xs uppercase tracking-wider font-semibold mb-1">Project Experience</p>
              <p className="text-sm">VIDEO EDITING</p>
              <p className="text-sm">GRAPHICS DESIGNER</p>
            </div>
          </div>

          <div className={`space-y-4 text-right transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-10'}`}>
            <div className="mb-6">
              <p className="text-xs uppercase tracking-wider font-semibold mb-1">Since 2020</p>
              <p className="text-sm">COMPLETED 1000+ PROJECT</p>
            </div>
          </div>
        </div>
        
        <div className="mt-16 animate-fade-up">
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
    </section>
  );
};

export default Hero;
