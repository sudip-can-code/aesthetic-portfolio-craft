
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

type Testimonial = {
  id: number;
  name: string;
  position: string;
  company: string;
  text: string;
  image: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Aarav Sharma",
    position: "Marketing Director",
    company: "Nepal Digital Media",
    text: "मैले यो पोर्टफोलियो देखेर आश्चर्यचकित भएँ। उनीहरूको काम गुणस्तरीय र व्यावसायिक छ। म उनीहरूसँग फेरि काम गर्न पाउँदा खुसी हुनेछु।",
    image: "/placeholder.svg",
  },
  {
    id: 2,
    name: "Priya Tamang",
    position: "CEO",
    company: "Kathmandu Productions",
    text: "हामीले विगत २ वर्षदेखि यो कम्पनीसँग काम गरिरहेका छौं र उनीहरूको सेवा सधैं उत्कृष्ट रहेको छ। उनीहरूको भिडियो सम्पादन सीप वास्तवमै उच्चस्तरको छ।",
    image: "/placeholder.svg",
  },
  {
    id: 3,
    name: "Dipesh Gurung",
    position: "Event Manager",
    company: "Himalayan Events",
    text: "हामीले यो कम्पनीसँग हाम्रो ठूलो कार्यक्रमको कभरेज गराएका थियौं र उनीहरूले हाम्रो अपेक्षा भन्दा धेरै राम्रो काम गरे। समयमै गुणस्तरीय काम गर्ने यो कम्पनी सबैलाई सिफारिस गर्दछौं।",
    image: "/placeholder.svg",
  },
];

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  return (
    <Card className="h-full">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
            <img
              src={testimonial.image}
              alt={testimonial.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h4 className="font-semibold">{testimonial.name}</h4>
            <p className="text-sm text-muted-foreground">
              {testimonial.position}, {testimonial.company}
            </p>
          </div>
        </div>
        <p className="text-muted-foreground italic flex-1">"{testimonial.text}"</p>
      </CardContent>
    </Card>
  );
};

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="testimonials" className="section bg-background">
      <div className="container mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Client Testimonials</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
