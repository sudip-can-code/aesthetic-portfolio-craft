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
import { PRIMARY_ADMIN_EMAIL } from '@/lib/admin';

const authSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type AuthFormValues = z.infer<typeof authSchema>;

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
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
      email: PRIMARY_ADMIN_EMAIL,
      password: '',
    },
  });

  const onSubmit = async (data: AuthFormValues) => {
    try {
      setIsSubmitting(true);

      if (isSignUp) {
        await signUp(data.email, data.password);
        toast.success('Account created! Please confirm your email, then sign in.');
        setIsSignUp(false);
        authForm.reset({ email: data.email, password: '' });
      } else {
        await signIn(data.email, data.password);
        navigate('/admin');
      }
    } catch (error: any) {
      console.error('Auth error:', error);

      let errorMessage = 'Authentication failed';
      let errorDescription = 'Please try again';

      if (error.message) {
        if (error.message.includes('Invalid login credentials') || error.message.includes('Invalid credentials')) {
          errorMessage = 'Invalid credentials';
          errorDescription = 'Check your password, or create the admin account first if it does not exist yet.';
        } else if (error.message.includes('User already registered') || error.message.includes('already registered')) {
          errorMessage = 'Account exists';
          errorDescription = 'Please sign in instead.';
          setIsSignUp(false);
        } else if (error.message.includes('administrator')) {
          errorMessage = 'Access denied';
          errorDescription = 'Only your approved admin Gmail can access this panel.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Email not confirmed';
          errorDescription = 'Please open the confirmation email, then try signing in again.';
        } else {
          errorDescription = error.message;
        }
      }

      toast.error(errorMessage, { description: errorDescription });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
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
          <div className="mb-4 flex justify-center">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Admin Access</CardTitle>
          <CardDescription>
            {isSignUp
              ? 'Create your administrator account'
              : 'Sign in with your administrator credentials'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...authForm}>
            <form onSubmit={authForm.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={authForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your admin Gmail" {...field} />
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
                      <Input type="password" placeholder="Enter your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isSignUp ? 'Creating account...' : 'Signing in...'}
                  </>
                ) : isSignUp ? (
                  'Create Admin Account'
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-4 text-center">
            <Button
              variant="link"
              onClick={() => {
                setIsSignUp(!isSignUp);
                authForm.reset({ email: authForm.getValues('email') || PRIMARY_ADMIN_EMAIL, password: '' });
              }}
              className="text-sm"
            >
              {isSignUp ? 'Already have an account? Sign in' : 'Need to create account? Click here'}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="justify-center text-center text-sm text-muted-foreground">
          Admin access is limited to your approved Gmail account.
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;
