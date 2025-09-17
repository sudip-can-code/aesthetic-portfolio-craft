
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SoftwareLogo {
  id: string;
  name: string;
  logo_url: string;
  created_at: string;
  updated_at: string;
}

export const useRealtimeSoftwareLogos = () => {
  const [logos, setLogos] = useState<SoftwareLogo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    fetchLogos();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('software_logos_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'software_logos' }, 
        () => {
          fetchLogos(); // Refetch on any change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchLogos = async () => {
    try {
      const { data, error } = await supabase
        .from('software_logos')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setLogos(data || []);
    } catch (error) {
      console.error('Error fetching software logos:', error);
      setLogos([]);
    } finally {
      setLoading(false);
    }
  };

  return { logos, loading, refetch: fetchLogos };
};
