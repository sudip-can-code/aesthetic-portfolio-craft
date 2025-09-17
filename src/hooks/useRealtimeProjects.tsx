
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

type Project = {
  id: string;
  category: string;
  image_url: string;
  title: string;
  video_url?: string;
  display_order: number;
};

export const useRealtimeProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('display_order', { ascending: true });
        
      if (error) {
        throw error;
      }
      
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchProjects();

    // Set up real-time subscription
    const channel = supabase
      .channel('projects-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects'
        },
        (payload) => {
          console.log('Projects table changed:', payload);
          fetchProjects(); // Refetch when any change occurs
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { projects, loading, refetch: fetchProjects };
};
