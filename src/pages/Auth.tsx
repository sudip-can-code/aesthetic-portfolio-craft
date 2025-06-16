
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, Shield } from 'lucide-react';
import { toast } from 'sonner';

const authSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type AuthFormValues = z.infer<typeof authSchema>;

const Auth = () => {
  const [isSignInMode, setIsSignInMode] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, signUp, user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user) {
      navigate('/admin');
    }
  }, [user, navigate]);

  const authForm = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: 'sudeepsnwr8@gmail.com',
      password: '',
    },
  });

  const onSubmit = async (data: AuthFormValues) => {
    try {
      setIsSubmitting(true);
      
      if (isSignInMode) {
        await signIn(data.email, data.password);
      } else {
        await signUp(data.email, data.password);
      }
      
      // Navigation happens in useEffect when user state changes
    } catch (error: any) {
      console.error('Auth error:', error);
      
      let errorMessage = 'An error occurred during authentication';
      let errorDescription = 'Please try again';
      
      if (error.message) {
        if (error.message.includes('Invalid login credentials') || error.message.includes('Invalid email or password')) {
          errorMessage = 'Invalid credentials';
          errorDescription = 'Please check your email and password';
        } else if (error.message.includes('Only the site administrator')) {
          errorMessage = 'Access denied';
          errorDescription = 'Only the site administrator can access this panel';
        } else if (error.message.includes('User already registered') || error.message.includes('already been registered')) {
          errorMessage = 'Account exists';
          errorDescription = 'This account already exists. Please sign in instead';
          setIsSignInMode(true);
        } else if (error.message.includes('Database error') || error.message.includes('confirmation_token')) {
          errorMessage = 'Authentication system ready';
          errorDescription = 'Please try signing in or creating an account';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Email not confirmed';
          errorDescription = 'Please check your email and click the confirmation link';
        } else {
          errorMessage = isSignInMode ? 'Sign in failed' : 'Sign up failed';
          errorDescription = error.message;
        }
      }
      
      toast.error(errorMessage, { description: errorDescription });
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
          <CardDescription>
            {isSignInMode 
              ? 'Sign in with your administrator credentials' 
              : 'Create your administrator account'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={isSignInMode ? 'signin' : 'signup'} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger 
                value="signin" 
                onClick={() => setIsSignInMode(true)}
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger 
                value="signup" 
                onClick={() => setIsSignInMode(false)}
              >
                Sign Up
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin" className="mt-4">
              <Form {...authForm}>
                <form onSubmit={authForm.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={authForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="sudeepsnwr8@gmail.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={authForm.control}
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
            </TabsContent>
            
            <TabsContent value="signup" className="mt-4">
              <Form {...authForm}>
                <form onSubmit={authForm.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={authForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="sudeepsnwr8@gmail.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={authForm.control}
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
                        Creating account...
                      </>
                    ) : 'Create Account'}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="justify-center text-sm text-muted-foreground">
          This area is restricted to administrators only
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;
