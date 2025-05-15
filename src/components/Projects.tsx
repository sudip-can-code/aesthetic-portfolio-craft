
import { useState } from 'react';

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

const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <div className="project-card bg-secondary/20 aspect-video">
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

  const filteredProjects = activeCategory === 'ALL' 
    ? PROJECTS 
    : PROJECTS.filter(project => project.category === activeCategory);

  return (
    <section id="projects" className="section bg-background">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          <div className="flex justify-center flex-wrap gap-x-6 gap-y-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`text-sm py-1 px-2 transition-colors ${
                  activeCategory === category
                    ? 'font-semibold text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
