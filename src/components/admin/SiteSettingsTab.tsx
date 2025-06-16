
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Save, Upload, Image as ImageIcon } from 'lucide-react';

interface SiteSetting {
  id: string;
  key: string;
  value: any;
  section: string;
  description: string;
}

const SiteSettingsTab = () => {
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    loadSettings();
    ensureStorageBucket();
  }, []);

  const ensureStorageBucket = async () => {
    try {
      // Check if bucket exists, create if it doesn't
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === 'website-assets');
      
      if (!bucketExists) {
        console.log('Creating website-assets bucket...');
        // The bucket will be created via SQL if needed
      }
    } catch (error) {
      console.error('Storage bucket check error:', error);
    }
  };

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('section', { ascending: true });

      if (error) throw error;
      setSettings(data || []);
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: any) => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('site_settings')
        .update({ value: JSON.stringify(value) })
        .eq('key', key);

      if (error) throw error;
      
      setSettings(prev => prev.map(setting => 
        setting.key === key ? { ...setting, value } : setting
      ));
      
      toast.success('Setting updated successfully');
    } catch (error) {
      console.error('Error updating setting:', error);
      toast.error('Failed to update setting');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (key: string, file: File) => {
    try {
      setSaving(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `images/${fileName}`;

      // For now, just use a placeholder since we need to set up storage properly
      // You can upload to any image hosting service or use the existing images
      const reader = new FileReader();
      reader.onload = async (e) => {
        const result = e.target?.result as string;
        // For demo purposes, we'll store the data URL
        // In production, you'd upload to proper storage
        await updateSetting(key, result);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setSaving(false);
    }
  };

  const renderSettingInput = (setting: SiteSetting) => {
    const value = typeof setting.value === 'string' 
      ? setting.value.replace(/^"|"$/g, '') 
      : setting.value;

    if (setting.key.includes('image') || setting.key.includes('avatar')) {
      return (
        <div className="space-y-2">
          <Label htmlFor={setting.key}>{setting.description}</Label>
          <div className="flex items-center gap-4">
            {value && (
              <img 
                src={value} 
                alt="Preview" 
                className="w-20 h-20 object-cover rounded border"
              />
            )}
            <div className="flex-1">
              <Input
                id={setting.key}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(setting.key, file);
                }}
                className="mb-2"
              />
              <Input
                value={value || ''}
                onChange={(e) => updateSetting(setting.key, e.target.value)}
                placeholder="Or enter image URL"
              />
            </div>
          </div>
        </div>
      );
    }

    if (setting.key.includes('description') || setting.key === 'about_description') {
      return (
        <div className="space-y-2">
          <Label htmlFor={setting.key}>{setting.description}</Label>
          <Textarea
            id={setting.key}
            value={value || ''}
            onChange={(e) => updateSetting(setting.key, e.target.value)}
            rows={4}
            className="resize-none"
          />
        </div>
      );
    }

    if (setting.key === 'social_links') {
      const socialLinks = typeof value === 'object' ? value : {};
      return (
        <div className="space-y-2">
          <Label>{setting.description}</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['linkedin', 'twitter', 'instagram', 'github'].map((platform) => (
              <div key={platform} className="space-y-1">
                <Label className="text-sm capitalize">{platform}</Label>
                <Input
                  value={socialLinks[platform] || ''}
                  onChange={(e) => {
                    const newLinks = { ...socialLinks, [platform]: e.target.value };
                    updateSetting(setting.key, newLinks);
                  }}
                  placeholder={`${platform} URL`}
                />
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (setting.key === 'theme_colors') {
      const colors = typeof value === 'object' ? value : {};
      return (
        <div className="space-y-2">
          <Label>{setting.description}</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['primary', 'secondary', 'accent'].map((colorType) => (
              <div key={colorType} className="space-y-1">
                <Label className="text-sm capitalize">{colorType}</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={colors[colorType] || '#000000'}
                    onChange={(e) => {
                      const newColors = { ...colors, [colorType]: e.target.value };
                      updateSetting(setting.key, newColors);
                    }}
                    className="w-16 h-10"
                  />
                  <Input
                    value={colors[colorType] || ''}
                    onChange={(e) => {
                      const newColors = { ...colors, [colorType]: e.target.value };
                      updateSetting(setting.key, newColors);
                    }}
                    placeholder="#000000"
                    className="flex-1"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <Label htmlFor={setting.key}>{setting.description}</Label>
        <Input
          id={setting.key}
          value={value || ''}
          onChange={(e) => updateSetting(setting.key, e.target.value)}
          placeholder={setting.description}
        />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  const settingsBySection = settings.reduce((acc, setting) => {
    if (!acc[setting.section]) acc[setting.section] = [];
    acc[setting.section].push(setting);
    return acc;
  }, {} as Record<string, SiteSetting[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Website Settings</h2>
          <p className="text-muted-foreground">Manage your website content and appearance</p>
        </div>
        {saving && <Loader2 className="h-5 w-5 animate-spin" />}
      </div>

      {Object.entries(settingsBySection).map(([section, sectionSettings]) => (
        <Card key={section}>
          <CardHeader>
            <CardTitle className="capitalize">{section} Settings</CardTitle>
            <CardDescription>
              Configure your {section} section content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {sectionSettings.map((setting) => (
              <div key={setting.key}>
                {renderSettingInput(setting)}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SiteSettingsTab;
