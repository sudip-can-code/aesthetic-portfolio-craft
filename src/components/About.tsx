
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
            <div className="w-64 h-64 md:w-80 md:h-80 overflow-hidden">
              <img 
                src="/lovable-uploads/1021feb9-789c-49b6-8094-424f26c9afb3.png" 
                alt="About Me Portrait" 
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-6">ABOUT ME</h2>
            
            <p className="text-lg font-medium mb-2">HI, I'M YOUR NAME</p>
            
            <p className="text-muted-foreground">
              I'M A NEW CREATIVE VIDEO EDITOR WITH A PASSION FOR VISUAL STORYTELLING.
              SPECIALIZED IN CREATING ENGAGING CONTENT ACROSS VARIOUS PLATFORMS, I BRING
              VISIONS TO LIFE THROUGH EFFECTS, EDITS, AND COMPELLING VISUAL STORIES.
            </p>
            
            <div className="mt-8">
              <p className="text-sm uppercase tracking-wider font-semibold mb-4">I USE THE SOFTWARE</p>
              <div className="flex flex-wrap gap-4">
                {SOFTWARE_ICONS.map((software, index) => (
                  <div key={index} className="w-8 h-8 grayscale hover:grayscale-0 transition-all">
                    <img 
                      src={software.icon} 
                      alt={software.name} 
                      className="w-full h-full object-contain"
                      title={software.name}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24">
          <h3 className="text-xl font-medium text-center mb-12">COMPANIES I'VE WORKED WITH</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((col) => (
              <div key={col} className="border border-border rounded-md p-6">
                <ul className="space-y-2">
                  {[1, 2, 3, 4, 5].map((row) => (
                    <li key={row} className="text-sm text-muted-foreground">
                      {`Company Name (Project ${col}-${row})`}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="mt-16 flex justify-center">
            <div className="flex flex-wrap justify-center gap-6">
              {SOFTWARE_ICONS.map((software, index) => (
                <div key={index} className="w-10 h-10 grayscale hover:grayscale-0 transition-all">
                  <img 
                    src={software.icon} 
                    alt={software.name} 
                    className="w-full h-full object-contain"
                    title={software.name}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
