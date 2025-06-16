
import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast as sonnerToast } from 'sonner';

interface AuthContextProps {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Your specific admin email
  const ADMIN_EMAIL = 'sudeepsnwr8@gmail.com';

  useEffect(() => {
    const setupAuth = async () => {
      try {
        setIsLoading(true);
        
        // Set up auth state listener first
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, currentSession) => {
            console.log('Auth state changed:', event, currentSession?.user?.email);
            
            setSession(currentSession);
            setUser(currentSession?.user ?? null);
            
            if (currentSession?.user) {
              // Use setTimeout to prevent potential deadlocks
              setTimeout(() => {
                checkUserAdmin(currentSession.user);
              }, 0);
            } else {
              setIsAdmin(false);
            }
          }
        );
        
        // Check for existing session
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          sonnerToast.error('Session error', { 
            description: 'Failed to retrieve authentication session' 
          });
          return;
        }
        
        if (currentSession?.user) {
          setSession(currentSession);
          setUser(currentSession.user);
          await checkUserAdmin(currentSession.user);
        }

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error in auth setup:', error);
        sonnerToast.error('Authentication error', { 
          description: 'Failed to initialize authentication' 
        });
      } finally {
        setIsLoading(false);
      }
    };

    setupAuth();
  }, []);

  const checkUserAdmin = async (user: User) => {
    try {
      console.log('Checking admin status for user:', user.email);
      
      // Only allow your specific Gmail account
      if (user.email !== ADMIN_EMAIL) {
        console.log('User email does not match admin email');
        setIsAdmin(false);
        sonnerToast.error('Access denied', {
          description: 'Only the site administrator can access this panel'
        });
        await signOut();
        return;
      }

      // Check if profile exists in database
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError && !profileError.message.includes('No rows found')) {
        console.error('Error fetching profile:', profileError);
        sonnerToast.error('Profile error', {
          description: 'Could not verify admin permissions'
        });
        return;
      }

      if (!profileData) {
        // Create admin profile for your Gmail account
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({ 
            id: user.id,
            user_id: user.id,
            email: user.email,
            is_admin: true,
            full_name: 'Sudip Admin'
          });
          
        if (insertError) {
          console.error('Error creating admin profile:', insertError);
          sonnerToast.error('Profile creation error', {
            description: 'Could not create admin profile'
          });
          return;
        }
        
        console.log('Created admin profile for:', user.email);
        setIsAdmin(true);
        sonnerToast.success('Welcome Administrator!', {
          description: 'Your admin profile has been created'
        });
      } else if (profileData.is_admin) {
        console.log('User is confirmed admin');
        setIsAdmin(true);
        sonnerToast.success('Welcome back, Administrator');
      } else {
        console.log('User exists but is not admin');
        setIsAdmin(false);
        sonnerToast.error('Access denied', {
          description: 'Only administrators can access this site'
        });
        await signOut();
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      sonnerToast.error('Admin check error', {
        description: 'Could not verify admin permissions'
      });
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('Attempting sign up for:', email);
      
      // Check if email matches admin email before attempting sign up
      if (email !== ADMIN_EMAIL) {
        throw new Error('Only the site administrator can create an account');
      }
      
      const redirectUrl = `${window.location.origin}/auth`;
      
      const result = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });
      
      if (result.error) {
        console.error('Sign-up error:', result.error);
        throw result.error;
      }
      
      sonnerToast.success('Account created successfully', {
        description: 'Please check your email for verification'
      });
      
    } catch (error: any) {
      console.error('Error signing up:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('Attempting sign in for:', email);
      
      // Check if email matches admin email before attempting sign in
      if (email !== ADMIN_EMAIL) {
        throw new Error('Only the site administrator can access this panel');
      }
      
      const result = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (result.error) {
        console.error('Sign-in error:', result.error);
        throw result.error;
      }
      
      if (!result.data?.user) {
        throw new Error('No user returned from authentication');
      }
      
      // Admin check happens in auth state change listener
    } catch (error: any) {
      console.error('Error signing in:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
      setIsAdmin(false);
      sonnerToast.success('Signed out', {
        description: 'You\'ve been successfully signed out.'
      });
    } catch (error) {
      console.error('Error signing out:', error);
      sonnerToast.error('Sign out error', {
        description: 'Failed to sign out. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        isAdmin,
        isLoading,
        signIn,
        signOut,
        signUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
