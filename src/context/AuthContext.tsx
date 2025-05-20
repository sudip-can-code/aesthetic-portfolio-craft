
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
        
        // First set up auth state listener
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
        
        // Then check for existing session
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

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error checking initial session:', error);
        sonnerToast.error('Authentication error', { 
          description: 'Failed to check authentication state' 
        });
      } finally {
        setIsLoading(false);
      }
    };

    setupAuth();
  }, []);

  const checkUserAdmin = async (userId: string) => {
    try {
      console.log('Checking admin status for user:', userId);
      
      // First try to query the profiles table
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', userId)
          .maybeSingle();

        if (error) {
          console.error('Error fetching admin status:', error);
          
          // If profiles table doesn't exist yet, try to create it
          if (error.message.includes('does not exist')) {
            console.log('Profiles table may not exist, attempting to create profile for user');
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({ id: userId, is_admin: true })
              .select();
              
            if (insertError) {
              console.error('Error creating profile:', insertError);
              sonnerToast.error('Error', {
                description: 'Could not create user profile'
              });
              return;
            } else {
              console.log('Created new profile with admin rights');
              setIsAdmin(true);
              sonnerToast.success('Admin access granted');
              return;
            }
          }
          
          sonnerToast.error('Error', {
            description: 'Could not verify admin permissions'
          });
          return;
        }

        console.log('Admin status result:', data);
        
        // If no profile exists or is_admin is null/false
        if (!data || data.is_admin !== true) {
          console.log('User is not an admin');
          setIsAdmin(false);
          
          // If the user has logged in but isn't an admin, sign them out
          if (session) {
            sonnerToast.error('Access denied', {
              description: 'Only administrators can access this site'
            });
            await signOut();
          }
        } else {
          console.log('User is an admin');
          setIsAdmin(true);
          sonnerToast.success('Welcome back, administrator');
        }
      } catch (innerError) {
        console.error('Error in profiles query:', innerError);
        throw innerError;
      }
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
        throw result.error;
      }
      
      // Verify user data exists
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
