
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
        setIsLoading(true);
        
        // First check for existing session
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          return;
        }
        
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
      (event, currentSession) => {
        console.log('Auth state changed:', event, currentSession?.user?.email);
        
        // Update state synchronously first
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Then check admin status if needed
        if (currentSession?.user) {
          // Use setTimeout to prevent deadlocks
          setTimeout(() => {
            checkUserAdmin(currentSession.user.id);
          }, 0);
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
      
      // Use a more robust error handling approach
      const result = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      // Handle potential errors from signIn
      if (result.error) {
        console.error('Sign-in error:', result.error);
        throw new Error(result.error.message || 'Failed to authenticate');
      }
      
      // Verify user data exists
      if (!result.data?.user) {
        throw new Error('No user returned from authentication');
      }
      
      // Successful login - admin check happens in auth state change listener
      // which will redirect if necessary
      
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
