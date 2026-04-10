import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast as sonnerToast } from 'sonner';
import { isAdminEmail } from '@/lib/admin';

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

  useEffect(() => {
    let isMounted = true;

    const applySession = async (currentSession: Session | null) => {
      if (!isMounted) return;

      const currentUser = currentSession?.user ?? null;
      const adminAccess = isAdminEmail(currentUser?.email);

      setSession(currentSession);
      setUser(currentUser);
      setIsAdmin(adminAccess);
      setIsLoading(false);

      if (currentUser && !adminAccess) {
        sonnerToast.error('Access denied - only your approved admin email can access this panel.');
        await supabase.auth.signOut();
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      void applySession(currentSession);
    });

    const getInitialSession = async () => {
      try {
        const {
          data: { session: initialSession },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error('Error getting initial session:', error);
          return;
        }

        await applySession(initialSession);
      } catch (error) {
        console.error('Error in getInitialSession:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void getInitialSession();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();

    try {
      setIsLoading(true);

      if (!isAdminEmail(normalizedEmail)) {
        throw new Error('Only the approved administrator email can create an account');
      }

      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) throw error;

      if (data.user) {
        sonnerToast.success('Account created successfully! Please check your email to confirm.');
      }
    } catch (error) {
      console.error('Error in signUp:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();

    try {
      setIsLoading(true);

      if (!isAdminEmail(normalizedEmail)) {
        throw new Error('Only the approved administrator can sign in');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error) throw error;

      if (data?.user) {
        sonnerToast.success('Signed in successfully!');
      }
    } catch (error) {
      console.error('Error in signIn:', error);
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
      sonnerToast.error('Sign out failed');
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
