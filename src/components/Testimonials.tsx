
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useTheme } from "@/components/ThemeProvider";

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
    text: "Working with Sudeep was an absolute pleasure. His video editing skills are top-notch and the final product exceeded our expectations. Highly recommended for any corporate project!",
    image: "/placeholder.svg",
  },
  {
    id: 2,
    name: "Priya Tamang",
    position: "CEO",
    company: "Kathmandu Productions",
    text: "We've been working with Sudeep for over 2 years now and his service has always been excellent. His video editing skills are truly top-tier and he never misses a deadline.",
    image: "/placeholder.svg",
  },
  {
    id: 3,
    name: "Dipesh Gurung",
    position: "Event Manager",
    company: "Himalayan Events",
    text: "We hired Sudeep for our major event coverage and he delivered beyond our expectations. The quality of work and timely delivery make him our go-to person for all video editing needs.",
    image: "/placeholder.svg",
  },
  {
    id: 4,
    name: "Sanjana Thapa",
    position: "Creative Director",
    company: "Annapurna Studios",
    text: "Sudeep's attention to detail and creative approach to video editing has transformed our content. Our audience engagement has increased by 40% since working with him.",
    image: "/placeholder.svg",
  },
  {
    id: 5,
    name: "Rajesh Magar",
    position: "Marketing Manager",
    company: "Everest Digital",
    text: "The quality of graphics work Sudeep provides is outstanding. He understands our brand voice perfectly and translates it into compelling visual stories.",
    image: "/placeholder.svg",
  },
  {
    id: 6,
    name: "Anisha Rai",
    position: "Project Manager",
    company: "Pokhara Films",
    text: "Sudeep's professionalism and skill set are rare to find. He's been handling all our post-production needs for over a year now, and we couldn't be happier with the results.",
    image: "/placeholder.svg",
  },
  {
    id: 7,
    name: "Binod Shrestha",
    position: "Production Head",
    company: "Lumbini Productions",
    text: "I was impressed by how quickly Sudeep understood our requirements and delivered exactly what we needed. The editing flow and transitions were seamless and engaging.",
    image: "/placeholder.svg",
  },
  {
    id: 8,
    name: "Sabina Maharjan",
    position: "Social Media Director",
    company: "Nepali Influencers",
    text: "Our social media campaigns have seen tremendous success thanks to Sudeep's video editing expertise. He knows exactly how to create content that resonates with our target audience.",
    image: "/placeholder.svg",
  }
];

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  const { theme } = useTheme();
  
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
  const [autoplay, setAutoplay] = useState<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // Set up autoplay to change testimonials every 5 seconds
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    
    setAutoplay(interval);
    
    return () => {
      if (autoplay) clearInterval(autoplay);
    };
  }, []);

  return (
    <section id="testimonials" className="section bg-background">
      <div className="container mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Client Testimonials</h2>

        <div className="max-w-4xl mx-auto">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {TESTIMONIALS.map((testimonial) => (
                <CarouselItem key={testimonial.id} className="md:basis-1/3">
                  <TestimonialCard testimonial={testimonial} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-8">
              <CarouselPrevious className="relative static mr-2" />
              <CarouselNext className="relative static ml-2" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
