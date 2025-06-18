
import { useEffect, useRef, useState } from "react";
import { useRealtimeClientLogos } from "@/hooks/useRealtimeClientLogos";

const ClientLogos = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { clientLogos, loading } = useRealtimeClientLogos();
  
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
  
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || clientLogos.length === 0) return;
    
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
  }, [clientLogos]);

  if (loading) {
    return (
      <section ref={sectionRef} className="py-16 bg-secondary/20 overflow-hidden">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Worked with</h2>
          <div className="flex justify-center items-center h-16">
            <p>Loading client logos...</p>
          </div>
        </div>
      </section>
    );
  }

  if (clientLogos.length === 0) {
    return (
      <section ref={sectionRef} className="py-16 bg-secondary/20 overflow-hidden">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Worked with</h2>
          <div className="flex justify-center items-center h-16">
            <p className="text-muted-foreground">No client logos available.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="py-16 bg-secondary/20 overflow-hidden">
      <div className="container mx-auto">
        <h2 className={`text-2xl md:text-3xl font-bold text-center mb-12 transition-all duration-700 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}>Worked with</h2>
        
        <div className={`relative w-full transition-all duration-700 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="flex overflow-hidden">
            <div 
              ref={scrollRef}
              className="flex animate-loop whitespace-nowrap"
            >
              {/* First set of logos */}
              <div className="flex">
                {clientLogos.map((client) => (
                  <div key={client.id} className="flex items-center justify-center min-w-[150px] md:min-w-[200px] px-4 py-6">
                    <img
                      src={client.logo_url}
                      alt={`${client.name} logo`}
                      className="h-8 md:h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                ))}
              </div>
              
              {/* Duplicate set for seamless scrolling */}
              <div className="flex">
                {clientLogos.map((client) => (
                  <div key={`dup-${client.id}`} className="flex items-center justify-center min-w-[150px] md:min-w-[200px] px-4 py-6">
                    <img
                      src={client.logo_url}
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
