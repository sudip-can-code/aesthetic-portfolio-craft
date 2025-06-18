
import { useState, useEffect, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Edit, Plus, Trash, Upload } from 'lucide-react';
import { useRealtimeSoftwareLogos } from '@/hooks/useRealtimeSoftwareLogos';

interface SoftwareLogo {
  id: string;
  name: string;
  logo_url: string;
}

const SoftwareLogosTab = () => {
  const { logos, loading, refetch } = useRealtimeSoftwareLogos();
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || (!logoFile && !logoUrl)) {
      toast({
        title: "Error",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    try {
      let finalLogoUrl = logoUrl;

      // Upload logo if file is provided
      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `software-logos/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('portfolio')
          .upload(filePath, logoFile);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('portfolio')
          .getPublicUrl(filePath);

        finalLogoUrl = data.publicUrl;
      }

      const logoData = {
        name,
        logo_url: finalLogoUrl,
      };

      if (editingId) {
        const { error } = await supabase
          .from('software_logos')
          .update(logoData)
          .eq('id', editingId);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Software logo updated successfully.",
        });
      } else {
        const { error } = await supabase
          .from('software_logos')
          .insert([logoData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Software logo created successfully.",
        });
      }

      resetForm();
      refetch();
    } catch (error) {
      console.error('Error saving software logo:', error);
      toast({
        title: "Error",
        description: "Failed to save software logo.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
      setIsDialogOpen(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this software logo?")) {
      setSaving(true);
      try {
        const { error } = await supabase
          .from('software_logos')
          .delete()
          .eq('id', id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Software logo deleted successfully.",
        });
        
        refetch();
      } catch (error) {
        console.error('Error deleting software logo:', error);
        toast({
          title: "Error",
          description: "Failed to delete software logo.",
          variant: "destructive",
        });
      } finally {
        setSaving(false);
      }
    }
  };

  const handleEdit = (logo: SoftwareLogo) => {
    setEditingId(logo.id);
    setName(logo.name);
    setLogoUrl(logo.logo_url);
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setLogoFile(null);
    setLogoUrl('');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Software Logos</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Software Logo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Software Logo' : 'Add New Software Logo'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Software Name</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Enter software name" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="logo">Logo Image (PNG recommended)</Label>
                <Input 
                  id="logo" 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => setLogoFile(e.target.files?.[0] || null)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="logoUrl">Or Logo URL</Label>
                <Input 
                  id="logoUrl" 
                  value={logoUrl} 
                  onChange={(e) => setLogoUrl(e.target.value)} 
                  placeholder="Enter logo URL" 
                />
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? 'Saving...' : (editingId ? 'Update Logo' : 'Add Logo')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading && <p>Loading software logos...</p>}
      
      {!loading && logos.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="text-muted-foreground mb-4">No software logos found. Add your first logo.</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Software Logo
            </Button>
          </CardContent>
        </Card>
      )}
      
      {!loading && logos.length > 0 && (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Logo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logos.map((logo) => (
                <TableRow key={logo.id}>
                  <TableCell>
                    <img 
                      src={logo.logo_url} 
                      alt={logo.name} 
                      className="h-12 w-12 object-contain"
                    />
                  </TableCell>
                  <TableCell>{logo.name}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(logo)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(logo.id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default SoftwareLogosTab;
