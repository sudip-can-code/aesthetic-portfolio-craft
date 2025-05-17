
import { Card } from "@/components/ui/card";

const CLIENT_LOGOS = [
  { id: 1, name: "Nepal Media", logo: "/placeholder.svg" },
  { id: 2, name: "Kathmandu Productions", logo: "/placeholder.svg" },
  { id: 3, name: "Himalayan Films", logo: "/placeholder.svg" },
  { id: 4, name: "Everest Studios", logo: "/placeholder.svg" },
  { id: 5, name: "Sagarmatha Digital", logo: "/placeholder.svg" },
  { id: 6, name: "Annapurna Creations", logo: "/placeholder.svg" },
];

const ClientLogos = () => {
  return (
    <section className="py-16 bg-secondary/20">
      <div className="container mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Worked with</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {CLIENT_LOGOS.map((client) => (
            <Card key={client.id} className="flex items-center justify-center p-6 hover:shadow-md transition-shadow duration-300">
              <img
                src={client.logo}
                alt={`${client.name} logo`}
                className="h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
              />
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientLogos;
