
import { useState } from 'react';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, LogOut, Settings, FileText, Users, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

import ProjectsTab from '@/components/admin/ProjectsTab';
import TestimonialsTab from '@/components/admin/TestimonialsTab';
import ClientLogosTab from '@/components/admin/ClientLogosTab';
import ProfileTab from '@/components/admin/ProfileTab';
import SiteSettingsTab from '@/components/admin/SiteSettingsTab';
import ContentManagerTab from '@/components/admin/ContentManagerTab';

const Admin = () => {
  const { isLoading, isAdmin } = useProtectedRoute();
  const [activeTab, setActiveTab] = useState('site-settings');
  const { signOut, user } = useAuth();
  
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
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {user?.email}
            </span>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="site-settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Website</span>
            </TabsTrigger>
            <TabsTrigger value="content-manager" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Content</span>
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              <span className="hidden sm:inline">Projects</span>
            </TabsTrigger>
            <TabsTrigger value="testimonials" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Reviews</span>
            </TabsTrigger>
            <TabsTrigger value="clients" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              <span className="hidden sm:inline">Clients</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
          </TabsList>
          
          <Separator />
          
          <TabsContent value="site-settings" className="space-y-4">
            <SiteSettingsTab />
          </TabsContent>
          
          <TabsContent value="content-manager" className="space-y-4">
            <ContentManagerTab />
          </TabsContent>
          
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
