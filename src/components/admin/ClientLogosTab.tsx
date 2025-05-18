
import { useState, useEffect, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Edit, Plus, Trash } from 'lucide-react';

interface ClientLogo {
  id: string;
  name: string;
  logo_url: string;
}

const ClientLogosTab = () => {
  const [clientLogos, setClientLogos] = useState<ClientLogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchClientLogos();
  }, []);

  async function fetchClientLogos() {
    try {
      const { data, error } = await supabase
        .from('client_logos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClientLogos(data || []);
    } catch (error) {
      console.error('Error fetching client logos:', error);
      toast({
        title: "Error",
        description: "Failed to load client logos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast({
        title: "Error",
        description: "Please enter a client name.",
        variant: "destructive",
      });
      return;
    }

    if (!editingId && !logoFile) {
      toast({
        title: "Error",
        description: "Please upload a logo image.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      let logoUrl = '';

      // Upload logo if available
      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `logos/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('portfolio')
          .upload(filePath, logoFile);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('portfolio')
          .getPublicUrl(filePath);

        logoUrl = data.publicUrl;
      }

      if (editingId) {
        const updateData: { name: string; logo_url?: string } = { name };
        if (logoUrl) updateData.logo_url = logoUrl;
        
        const { error } = await supabase
          .from('client_logos')
          .update(updateData)
          .eq('id', editingId);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Client logo updated successfully.",
        });
      } else {
        const { error } = await supabase
          .from('client_logos')
          .insert([{ name, logo_url: logoUrl }]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Client logo added successfully.",
        });
      }

      resetForm();
      fetchClientLogos();
    } catch (error) {
      console.error('Error saving client logo:', error);
      toast({
        title: "Error",
        description: "Failed to save client logo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setIsDialogOpen(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this client logo?")) {
      setLoading(true);
      try {
        const { error } = await supabase
          .from('client_logos')
          .delete()
          .eq('id', id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Client logo deleted successfully.",
        });
        
        fetchClientLogos();
      } catch (error) {
        console.error('Error deleting client logo:', error);
        toast({
          title: "Error",
          description: "Failed to delete client logo.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (clientLogo: ClientLogo) => {
    setEditingId(clientLogo.id);
    setName(clientLogo.name);
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setLogoFile(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Client Logos</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Client Logo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Client Logo' : 'Add New Client Logo'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Client Name</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Enter client name" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="logo">{editingId ? 'Logo Image (optional)' : 'Logo Image'}</Label>
                <Input 
                  id="logo" 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => setLogoFile(e.target.files?.[0] || null)} 
                  required={!editingId}
                />
                {editingId && (
                  <p className="text-xs text-muted-foreground">Upload only if you want to change the existing logo.</p>
                )}
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : (editingId ? 'Update Logo' : 'Add Logo')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading && <p>Loading client logos...</p>}
      
      {!loading && clientLogos.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="text-muted-foreground mb-4">No client logos found. Add your first client logo.</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Client Logo
            </Button>
          </CardContent>
        </Card>
      )}
      
      {!loading && clientLogos.length > 0 && (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Logo</TableHead>
                <TableHead>Client Name</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientLogos.map((clientLogo) => (
                <TableRow key={clientLogo.id}>
                  <TableCell>
                    <img 
                      src={clientLogo.logo_url} 
                      alt={clientLogo.name} 
                      className="h-12 max-w-[100px] object-contain"
                    />
                  </TableCell>
                  <TableCell>{clientLogo.name}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(clientLogo)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(clientLogo.id)}>
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

export default ClientLogosTab;
