
import { useState } from 'react';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

import ProjectsTab from '@/components/admin/ProjectsTab';
import TestimonialsTab from '@/components/admin/TestimonialsTab';
import ClientLogosTab from '@/components/admin/ClientLogosTab';
import ProfileTab from '@/components/admin/ProfileTab';

const Admin = () => {
  const { isLoading, isAdmin } = useProtectedRoute(true);
  const [activeTab, setActiveTab] = useState('projects');
  const { signOut } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }
  
  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center flex-col gap-4">
        <h1 className="text-2xl font-bold">Unauthorized</h1>
        <p>You don't have permission to access this page.</p>
        <Button asChild>
          <Link to="/">Go Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to site
              </Link>
            </Button>
            <h1 className="text-xl font-semibold">Admin Dashboard</h1>
          </div>
          <Button variant="outline" size="sm" onClick={signOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </header>
      
      <main className="container py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
            <TabsTrigger value="clients">Client Logos</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>
          
          <Separator />
          
          <TabsContent value="projects" className="space-y-4">
            <ProjectsTab />
          </TabsContent>
          
          <TabsContent value="testimonials" className="space-y-4">
            <TestimonialsTab />
          </TabsContent>
          
          <TabsContent value="clients" className="space-y-4">
            <ClientLogosTab />
          </TabsContent>
          
          <TabsContent value="profile" className="space-y-4">
            <ProfileTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
