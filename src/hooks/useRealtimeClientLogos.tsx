
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

type ClientLogo = {
  id: string;
  name: string;
  logo_url: string;
};

export const useRealtimeClientLogos = () => {
  const [clientLogos, setClientLogos] = useState<ClientLogo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClientLogos = async () => {
    try {
      const { data, error } = await supabase
        .from('client_logos')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      setClientLogos(data || []);
    } catch (error) {
      console.error('Error fetching client logos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchClientLogos();

    // Set up real-time subscription
    const channel = supabase
      .channel('client-logos-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'client_logos'
        },
        (payload) => {
          console.log('Client logos table changed:', payload);
          fetchClientLogos(); // Refetch when any change occurs
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { clientLogos, loading, refetch: fetchClientLogos };
};
