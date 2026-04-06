import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SiteSettings {
  [key: string]: any;
}

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value');

      if (error) throw error;

      const settingsMap: SiteSettings = {};
      data?.forEach((item: { key: string; value: any }) => {
        let val = item.value;
        if (typeof val === 'string') {
          try { val = JSON.parse(val); } catch {}
        }
        settingsMap[item.key] = val;
      });
      setSettings(settingsMap);
    } catch (error) {
      console.error('Error fetching site settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();

    const channel = supabase
      .channel('site-settings-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_settings' }, () => {
        fetchSettings();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return { settings, loading };
};
