
const SOFTWARE_ICONS = [
  { name: 'Adobe Premiere Pro', icon: '/placeholder.svg' },
  { name: 'Adobe After Effects', icon: '/placeholder.svg' },
  { name: 'Avid Media Composer', icon: '/placeholder.svg' },
  { name: 'Final Cut Pro', icon: '/placeholder.svg' },
  { name: 'DaVinci Resolve', icon: '/placeholder.svg' },
  { name: 'Adobe Photoshop', icon: '/placeholder.svg' },
  { name: 'Adobe Illustrator', icon: '/placeholder.svg' },
];

const About = () => {
  return (
    <section id="about" className="section">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center">
            <div className="relative w-80 h-80 md:w-96 md:h-96">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-2xl"></div>
              <img 
                src="/lovable-uploads/1021feb9-789c-49b6-8094-424f26c9afb3.png" 
                alt="About Me Portrait" 
                className="w-full h-full object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              ABOUT ME
            </h2>
            
            <div className="space-y-4">
              <p className="text-xl font-semibold text-primary">HI, I'M YOUR NAME</p>
              
              <p className="text-muted-foreground text-lg leading-relaxed">
                I'M A NEW CREATIVE VIDEO EDITOR WITH A PASSION FOR VISUAL STORYTELLING.
                SPECIALIZED IN CREATING ENGAGING CONTENT ACROSS VARIOUS PLATFORMS, I BRING
                VISIONS TO LIFE THROUGH EFFECTS, EDITS, AND COMPELLING VISUAL STORIES.
              </p>
            </div>
            
            <div className="mt-12">
              <p className="text-sm uppercase tracking-wider font-semibold mb-6 text-primary">
                I USE THE SOFTWARE
              </p>
              <div className="flex flex-wrap gap-6">
                {SOFTWARE_ICONS.map((software, index) => (
                  <div 
                    key={index} 
                    className="w-12 h-12 grayscale hover:grayscale-0 transition-all duration-300 hover:scale-110"
                  >
                    <img 
                      src={software.icon} 
                      alt={software.name} 
                      className="w-full h-full object-contain filter drop-shadow-lg"
                      title={software.name}
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

export default About;
