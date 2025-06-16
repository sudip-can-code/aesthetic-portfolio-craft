
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
              // Check admin status without triggering database errors
              if (currentSession.user.email === ADMIN_EMAIL) {
                setIsAdmin(true);
                sonnerToast.success('Welcome back, Administrator');
              } else {
                setIsAdmin(false);
                sonnerToast.error('Access denied', {
                  description: 'Only the site administrator can access this panel'
                });
                await signOut();
              }
            } else {
              setIsAdmin(false);
            }
          }
        );
        
        // Check for existing session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (currentSession?.user) {
          setSession(currentSession);
          setUser(currentSession.user);
          if (currentSession.user.email === ADMIN_EMAIL) {
            setIsAdmin(true);
          }
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

  const signUp = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('Attempting sign up for:', email);
      
      // Check if email matches admin email before attempting sign up
      if (email !== ADMIN_EMAIL) {
        throw new Error('Only the site administrator can create an account');
      }
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`
        }
      });
      
      if (error) {
        console.error('Sign-up error:', error);
        throw error;
      }
      
      if (data.user && !data.session) {
        sonnerToast.success('Account created successfully', {
          description: 'Please check your email for verification'
        });
      } else if (data.session) {
        sonnerToast.success('Account created and logged in successfully');
      }
      
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
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Sign-in error:', error);
        throw error;
      }
      
      if (!data?.user) {
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
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setSession(null);
      setUser(null);
      setIsAdmin(false);
      sonnerToast.success('Signed out successfully');
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
