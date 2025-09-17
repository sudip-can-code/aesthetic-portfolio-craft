
import React, { useState, useEffect } from 'react';
import { ThemeToggle } from "@/components/ThemeToggle";

const Navbar = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      const scrollPosition = window.scrollY + 100;

      sections.forEach(section => {
        const sectionTop = (section as HTMLElement).offsetTop;
        const sectionHeight = (section as HTMLElement).offsetHeight;
        const sectionId = section.getAttribute('id') || '';
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setActiveSection(sectionId);
        }
      });

      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-background/90 backdrop-blur-sm shadow-sm' : 'bg-transparent'}`}>
      <div className="container mx-auto flex justify-between items-center py-4">
        <div></div> {/* Empty div for flexbox spacing */}
        <nav>
          <ul className="flex space-x-8 text-sm font-medium">
            <li>
              <a 
                href="#home" 
                className={`nav-link ${activeSection === 'home' ? 'active-nav-link' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('home');
                }}
              >
                Home
              </a>
            </li>
            <li>
              <a 
                href="#projects" 
                className={`nav-link ${activeSection === 'projects' ? 'active-nav-link' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('projects');
                }}
              >
                Projects
              </a>
            </li>
            <li>
              <a 
                href="#contact" 
                className={`nav-link ${activeSection === 'contact' ? 'active-nav-link' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('contact');
                }}
              >
                Contact
              </a>
            </li>
          </ul>
        </nav>
        <div className="flex items-center">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
