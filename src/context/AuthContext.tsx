
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
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const setupAuth = async () => {
      try {
        // First check for existing session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (currentSession?.user) {
          setSession(currentSession);
          setUser(currentSession.user);
          await checkUserAdmin(currentSession.user.id);
        }
      } catch (error) {
        console.error('Error checking initial session:', error);
        sonnerToast.error('Authentication error', { 
          description: 'Failed to check authentication state' 
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event, currentSession?.user?.email);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          await checkUserAdmin(currentSession.user.id);
        } else {
          setIsAdmin(false);
        }
      }
    );

    setupAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkUserAdmin = async (userId: string) => {
    try {
      console.log('Checking admin status for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching admin status:', error);
        sonnerToast.error('Error', {
          description: 'Could not verify admin permissions'
        });
        return;
      }

      console.log('Admin status result:', data);
      setIsAdmin(data?.is_admin || false);
    } catch (error) {
      console.error('Error checking admin status:', error);
      sonnerToast.error('Error', {
        description: 'Could not verify admin permissions'
      });
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('Attempting sign in for:', email);
      
      // Use the auth.signInWithPassword method with error handling
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error.message);
        sonnerToast.error('Authentication error', {
          description: error.message || 'Failed to sign in'
        });
        return;
      }

      if (!data.user) {
        sonnerToast.error('Authentication error', {
          description: 'No user found'
        });
        return;
      }

      // Check if the user is an admin
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', data.user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Error checking admin status:', profileError);
        sonnerToast.error('Error', {
          description: 'Could not verify admin permissions'
        });
        return;
      }

      if (!profileData?.is_admin) {
        // Sign out if not admin
        await supabase.auth.signOut();
        sonnerToast.error('Access denied', {
          description: 'Only administrators can access this site.'
        });
        return;
      }

      sonnerToast.success('Welcome back!', {
        description: 'You\'ve successfully signed in as administrator.'
      });
      
    } catch (error) {
      console.error('Error signing in:', error);
      sonnerToast.error('Authentication error', {
        description: 'An unexpected error occurred'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      sonnerToast.success('Signed out', {
        description: 'You\'ve been successfully signed out.'
      });
    } catch (error) {
      console.error('Error signing out:', error);
      sonnerToast.error('Error', {
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
