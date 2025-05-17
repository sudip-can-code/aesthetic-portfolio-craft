
import { useEffect, useRef } from "react";

const CLIENT_LOGOS = [
  { id: 1, name: "Google", logo: "/placeholder.svg" },
  { id: 2, name: "Microsoft", logo: "/placeholder.svg" },
  { id: 3, name: "Apple", logo: "/placeholder.svg" },
  { id: 4, name: "Amazon", logo: "/placeholder.svg" },
  { id: 5, name: "Meta", logo: "/placeholder.svg" },
  { id: 6, name: "Netflix", logo: "/placeholder.svg" },
  { id: 7, name: "IBM", logo: "/placeholder.svg" },
  { id: 8, name: "Tesla", logo: "/placeholder.svg" },
  { id: 9, name: "Oracle", logo: "/placeholder.svg" },
  { id: 10, name: "Intel", logo: "/placeholder.svg" },
];

const ClientLogos = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;
    
    let animationId: number;
    let scrollPos = 0;
    const totalWidth = scrollContainer.scrollWidth;
    const visibleWidth = scrollContainer.clientWidth;
    
    const scroll = () => {
      if (!scrollContainer) return;
      
      scrollPos += 0.5; // Adjust speed here
      
      // Reset position when we've scrolled through all logos
      if (scrollPos >= totalWidth / 2) {
        scrollPos = 0;
      }
      
      scrollContainer.style.transform = `translateX(-${scrollPos}px)`;
      animationId = requestAnimationFrame(scroll);
    };
    
    animationId = requestAnimationFrame(scroll);
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <section className="py-16 bg-secondary/20 overflow-hidden">
      <div className="container mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Worked with</h2>
        
        <div className="relative w-full">
          <div className="flex overflow-hidden">
            <div 
              ref={scrollRef}
              className="flex animate-loop whitespace-nowrap"
            >
              {/* First set of logos */}
              <div className="flex">
                {CLIENT_LOGOS.map((client) => (
                  <div key={client.id} className="flex items-center justify-center min-w-[150px] md:min-w-[200px] px-4 py-6">
                    <img
                      src={client.logo}
                      alt={`${client.name} logo`}
                      className="h-8 md:h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                ))}
              </div>
              
              {/* Duplicate set for seamless scrolling */}
              <div className="flex">
                {CLIENT_LOGOS.map((client) => (
                  <div key={`dup-${client.id}`} className="flex items-center justify-center min-w-[150px] md:min-w-[200px] px-4 py-6">
                    <img
                      src={client.logo}
                      alt={`${client.name} logo`}
                      className="h-8 md:h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientLogos;
