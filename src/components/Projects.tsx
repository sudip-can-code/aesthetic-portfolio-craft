
import { useState, useEffect, useRef } from 'react';

type Project = {
  id: number;
  category: string;
  image: string;
  title: string;
};

const PROJECTS: Project[] = [
  { id: 1, category: 'CORPORATE', image: '/placeholder.svg', title: 'Corporate Project 1' },
  { id: 2, category: 'DOCUMENTARY', image: '/placeholder.svg', title: 'Documentary 1' },
  { id: 3, category: 'WEDDING', image: '/placeholder.svg', title: 'Wedding Video 1' },
  { id: 4, category: 'MUSIC', image: '/placeholder.svg', title: 'Music Video 1' },
  { id: 5, category: 'COMMERCIAL', image: '/placeholder.svg', title: 'Commercial 1' },
  { id: 6, category: 'EVENT', image: '/placeholder.svg', title: 'Event Coverage 1' },
];

const CATEGORIES = ['ALL', 'CORPORATE', 'DOCUMENTARY', 'WEDDING', 'MUSIC', 'COMMERCIAL', 'EVENT', 'SHORT'];

const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, index * 150); // Staggered animation
        }
      },
      { threshold: 0.1 }
    );
    
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    
    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [index]);
  
  return (
    <div 
      ref={cardRef}
      className={`project-card bg-secondary/20 aspect-video transition-all duration-700 ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="absolute inset-0">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <div className="text-white text-center p-4">
          <p className="text-xs uppercase tracking-wider mb-2">{project.category}</p>
          <h3 className="text-lg font-medium">{project.title}</h3>
        </div>
      </div>
    </div>
  );
};

const Projects = () => {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const filteredProjects = activeCategory === 'ALL' 
    ? PROJECTS 
    : PROJECTS.filter(project => project.category === activeCategory);

  return (
    <section id="projects" ref={sectionRef} className="section bg-background">
      <div className="container mx-auto">
        <div className={`mb-12 text-center transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <h2 className="text-3xl font-bold relative inline-block">
            Projects
            <span className="absolute -bottom-2 left-0 w-full h-1 bg-primary scale-x-100 origin-left transition-transform"></span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 gap-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>

          <div className={`flex justify-center flex-wrap gap-x-6 gap-y-2 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`text-sm py-1 px-2 transition-colors ${
                  activeCategory === category
                    ? 'font-semibold text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                } relative group`}
              >
                {category}
                <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-primary transform ${
                  activeCategory === category ? 'scale-x-100' : 'scale-x-0'
                } group-hover:scale-x-100 transition-transform duration-300 origin-left`}></span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
