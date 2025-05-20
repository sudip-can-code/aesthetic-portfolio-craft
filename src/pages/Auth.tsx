
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Auth = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dbConfigIssue, setDbConfigIssue] = useState(false);
  const { signIn, user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user) {
      navigate('/admin');
    }
  }, [user, navigate]);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const createAdminUser = async (email: string) => {
    try {
      // Get user by email
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id, is_admin')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();
      
      if (userError) {
        console.error('Error fetching user:', userError);
        return false;
      }

      if (!userData) {
        console.error('User not found in profiles');
        return false;
      }

      // Update user to admin
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ is_admin: true })
        .eq('id', userData.id);

      if (updateError) {
        console.error('Error updating user to admin:', updateError);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error creating admin user:', error);
      return false;
    }
  };

  const onLoginSubmit = async (data: LoginFormValues) => {
    try {
      setIsSubmitting(true);
      await signIn(data.email, data.password);
      // Navigation happens in useEffect when user state changes
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle the database schema error which indicates an issue with the profiles setup
      if (error.message && error.message.includes('Database error querying schema')) {
        setDbConfigIssue(true);
        toast.error('Authentication error', {
          description: 'There is a database configuration issue. We'll try to fix it automatically.'
        });
        
        // Try to create admin user automatically
        const success = await createAdminUser(data.email);
        if (success) {
          toast.success('Admin user created', {
            description: 'Please try logging in again.'
          });
        } else {
          toast.error('Failed to create admin user', {
            description: 'Please check the Supabase dashboard and ensure the profiles table is set up correctly.'
          });
        }
      } else if (error.message && error.message.includes('Only administrators')) {
        toast.error('Access denied', {
          description: 'Only administrators can access this site.'
        });
      } else {
        toast.error('Failed to sign in', {
          description: error.message || 'Please check your credentials and try again.'
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading && user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Admin Access</CardTitle>
          <CardDescription>Sign in with your administrator credentials</CardDescription>
        </CardHeader>
        <CardContent>
          {dbConfigIssue && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Database Configuration Issue</AlertTitle>
              <AlertDescription>
                There appears to be an issue with the database configuration. 
                We've attempted to fix it automatically. Please try logging in again.
              </AlertDescription>
            </Alert>
          )}
          
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="admin@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : 'Sign In'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="justify-center text-sm text-muted-foreground">
          This area is restricted to administrators only
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;
