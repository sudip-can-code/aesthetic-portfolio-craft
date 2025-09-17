
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

type Testimonial = {
  id: string;
  name: string;
  position: string;
  company: string;
  text: string;
  image_url?: string;
};

export const useRealtimeTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchTestimonials();

    // Set up real-time subscription
    const channel = supabase
      .channel('testimonials-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'testimonials'
        },
        (payload) => {
          console.log('Testimonials table changed:', payload);
          fetchTestimonials(); // Refetch when any change occurs
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { testimonials, loading, refetch: fetchTestimonials };
};
