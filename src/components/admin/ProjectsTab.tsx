import { useState, useEffect, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Edit, Plus, Trash } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  category: string;
  image_url?: string;
  video_url?: string;
}

const ProjectsTab = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const categories = ["CORPORATE", "COMMERCIAL", "SHORT", "MOTION GRAPHICS", "THUMBNAIL", "DESIGN", "CINEMATIC", "YOUTUBE VIDEO"];

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error",
        description: "Failed to load projects.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title || !category) {
      toast({
        title: "Error",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      let imageUrl = '';

      // Upload image if available
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `projects/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('portfolio')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('portfolio')
          .getPublicUrl(filePath);

        imageUrl = data.publicUrl;
      }

      const projectData = {
        title,
        category,
        image_url: imageUrl || undefined,
        video_url: videoUrl || undefined,
      };

      if (editingId) {
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', editingId);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Project updated successfully.",
        });
      } else {
        const { error } = await supabase
          .from('projects')
          .insert([projectData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Project created successfully.",
        });
      }

      resetForm();
      fetchProjects();
    } catch (error) {
      console.error('Error saving project:', error);
      toast({
        title: "Error",
        description: "Failed to save project.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setIsDialogOpen(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      setLoading(true);
      try {
        const { error } = await supabase
          .from('projects')
          .delete()
          .eq('id', id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Project deleted successfully.",
        });
        
        fetchProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
        toast({
          title: "Error",
          description: "Failed to delete project.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setTitle(project.title);
    setCategory(project.category);
    setVideoUrl(project.video_url || '');
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setCategory('');
    setImageFile(null);
    setVideoUrl('');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Projects</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Project' : 'Add New Project'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title</Label>
                <Input 
                  id="title" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="Enter project title" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={category} 
                  onValueChange={setCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image">Project Image</Label>
                <Input 
                  id="image" 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="videoUrl">Video URL (optional)</Label>
                <Input 
                  id="videoUrl" 
                  value={videoUrl} 
                  onChange={(e) => setVideoUrl(e.target.value)} 
                  placeholder="e.g. YouTube or Vimeo URL" 
                />
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : (editingId ? 'Update Project' : 'Add Project')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading && <p>Loading projects...</p>}
      
      {!loading && projects.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="text-muted-foreground mb-4">No projects found. Add your first project.</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Project
            </Button>
          </CardContent>
        </Card>
      )}
      
      {!loading && projects.length > 0 && (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    {project.image_url ? (
                      <img 
                        src={project.image_url} 
                        alt={project.title} 
                        className="h-12 w-20 object-cover rounded"
                      />
                    ) : (
                      <div className="h-12 w-20 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                        No image
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{project.title}</TableCell>
                  <TableCell>{project.category}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(project)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(project.id)}>
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

export default ProjectsTab;
