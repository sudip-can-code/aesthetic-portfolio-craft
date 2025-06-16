
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Plus, Edit, Trash2, Eye } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  category: string;
  image_url?: string;
  video_url?: string;
  created_at: string;
}

interface Testimonial {
  id: string;
  name: string;
  position: string;
  company: string;
  text: string;
  image_url?: string;
}

const ContentManagerTab = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [activeTab, setActiveTab] = useState<'projects' | 'testimonials'>('projects');

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const [projectsResponse, testimonialsResponse] = await Promise.all([
        supabase.from('projects').select('*').order('created_at', { ascending: false }),
        supabase.from('testimonials').select('*').order('created_at', { ascending: false })
      ]);

      if (projectsResponse.error) throw projectsResponse.error;
      if (testimonialsResponse.error) throw testimonialsResponse.error;

      setProjects(projectsResponse.data || []);
      setTestimonials(testimonialsResponse.data || []);
    } catch (error) {
      console.error('Error loading content:', error);
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const handleProjectSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const projectData = {
      title: formData.get('title') as string,
      category: formData.get('category') as string,
      image_url: formData.get('image_url') as string,
      video_url: formData.get('video_url') as string,
    };

    try {
      if (editingProject) {
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', editingProject.id);
        
        if (error) throw error;
        toast.success('Project updated successfully');
      } else {
        const { error } = await supabase
          .from('projects')
          .insert([projectData]);
        
        if (error) throw error;
        toast.success('Project created successfully');
      }
      
      setDialogOpen(false);
      setEditingProject(null);
      loadContent();
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Failed to save project');
    }
  };

  const handleTestimonialSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const testimonialData = {
      name: formData.get('name') as string,
      position: formData.get('position') as string,
      company: formData.get('company') as string,
      text: formData.get('text') as string,
      image_url: formData.get('image_url') as string,
    };

    try {
      if (editingTestimonial) {
        const { error } = await supabase
          .from('testimonials')
          .update(testimonialData)
          .eq('id', editingTestimonial.id);
        
        if (error) throw error;
        toast.success('Testimonial updated successfully');
      } else {
        const { error } = await supabase
          .from('testimonials')
          .insert([testimonialData]);
        
        if (error) throw error;
        toast.success('Testimonial created successfully');
      }
      
      setDialogOpen(false);
      setEditingTestimonial(null);
      loadContent();
    } catch (error) {
      console.error('Error saving testimonial:', error);
      toast.error('Failed to save testimonial');
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      toast.success('Project deleted successfully');
      loadContent();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    }
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    
    try {
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      if (error) throw error;
      toast.success('Testimonial deleted successfully');
      loadContent();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast.error('Failed to delete testimonial');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Content Manager</h2>
          <p className="text-muted-foreground">Manage your projects and testimonials</p>
        </div>
      </div>

      <div className="flex gap-2 border-b">
        <Button
          variant={activeTab === 'projects' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('projects')}
        >
          Projects ({projects.length})
        </Button>
        <Button
          variant={activeTab === 'testimonials' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('testimonials')}
        >
          Testimonials ({testimonials.length})
        </Button>
      </div>

      {activeTab === 'projects' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Projects</CardTitle>
                <CardDescription>Manage your portfolio projects</CardDescription>
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => {setEditingProject(null); setDialogOpen(true);}}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Project
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <form onSubmit={handleProjectSubmit}>
                    <DialogHeader>
                      <DialogTitle>
                        {editingProject ? 'Edit Project' : 'Add New Project'}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          name="title"
                          defaultValue={editingProject?.title || ''}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Input
                          id="category"
                          name="category"
                          defaultValue={editingProject?.category || ''}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="image_url">Image URL</Label>
                        <Input
                          id="image_url"
                          name="image_url"
                          type="url"
                          defaultValue={editingProject?.image_url || ''}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="video_url">Video URL</Label>
                        <Input
                          id="video_url"
                          name="video_url"
                          type="url"
                          defaultValue={editingProject?.video_url || ''}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">
                        {editingProject ? 'Update' : 'Create'} Project
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {projects.map((project) => (
                <div key={project.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  {project.image_url && (
                    <img 
                      src={project.image_url} 
                      alt={project.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold">{project.title}</h3>
                    <Badge variant="secondary">{project.category}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingProject(project);
                        setDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteProject(project.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'testimonials' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Testimonials</CardTitle>
                <CardDescription>Manage client testimonials</CardDescription>
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => {setEditingTestimonial(null); setDialogOpen(true);}}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Testimonial
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <form onSubmit={handleTestimonialSubmit}>
                    <DialogHeader>
                      <DialogTitle>
                        {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          name="name"
                          defaultValue={editingTestimonial?.name || ''}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="position">Position</Label>
                        <Input
                          id="position"
                          name="position"
                          defaultValue={editingTestimonial?.position || ''}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          name="company"
                          defaultValue={editingTestimonial?.company || ''}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="text">Testimonial Text</Label>
                        <Textarea
                          id="text"
                          name="text"
                          defaultValue={editingTestimonial?.text || ''}
                          rows={4}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="image_url">Profile Image URL</Label>
                        <Input
                          id="image_url"
                          name="image_url"
                          type="url"
                          defaultValue={editingTestimonial?.image_url || ''}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">
                        {editingTestimonial ? 'Update' : 'Create'} Testimonial
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="flex items-start gap-4 p-4 border rounded-lg">
                  {testimonial.image_url && (
                    <img 
                      src={testimonial.image_url} 
                      alt={testimonial.name}
                      className="w-12 h-12 object-cover rounded-full"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.position} at {testimonial.company}
                    </p>
                    <p className="text-sm mt-2 line-clamp-2">{testimonial.text}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingTestimonial(testimonial);
                        setDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteTestimonial(testimonial.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContentManagerTab;
