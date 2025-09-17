
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useTheme } from "@/components/ThemeProvider";
import { useRealtimeTestimonials } from "@/hooks/useRealtimeTestimonials";

type Testimonial = {
  id: string;
  name: string;
  position: string;
  company: string;
  text: string;
  image_url?: string;
};

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  const { theme } = useTheme();
  
  return (
    <Card className="h-full">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
            <img
              src={testimonial.image_url || "/placeholder.svg"}
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
  const { testimonials, loading } = useRealtimeTestimonials();
  
  useEffect(() => {
    if (testimonials.length > 0) {
      // Set up autoplay to change testimonials every 5 seconds
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % testimonials.length);
      }, 5000);
      
      setAutoplay(interval);
      
      return () => {
        if (autoplay) clearInterval(autoplay);
      };
    }
  }, [testimonials.length]);

  if (loading) {
    return (
      <section id="testimonials" className="section bg-background">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Client Testimonials</h2>
          <div className="flex justify-center items-center h-32">
            <p>Loading testimonials...</p>
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return (
      <section id="testimonials" className="section bg-background">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Client Testimonials</h2>
          <div className="flex justify-center items-center h-32">
            <p className="text-muted-foreground">No testimonials available.</p>
          </div>
        </div>
      </section>
    );
  }

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
              {testimonials.map((testimonial) => (
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
