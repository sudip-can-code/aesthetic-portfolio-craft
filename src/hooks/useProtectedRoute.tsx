
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useProtectedRoute = () => {
  const { user, isLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);
  const [checkingPermission, setCheckingPermission] = useState(true);

  useEffect(() => {
    const checkPermission = async () => {
      try {
        setCheckingPermission(true);
        
        // Wait for auth loading to complete
        if (isLoading) return;
        
        console.log('Protected route check:', { user, isAdmin });
        
        if (!user) {
          console.log('No user, redirecting to auth page');
          toast.error('Authentication required', {
            description: 'Please login to access this page'
          });
          navigate('/auth');
          return;
        }
        
        // Double-check admin status directly from database
        // This helps when the context might not have the latest data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .maybeSingle();
          
        if (profileError && !profileError.message.includes('No rows found')) {
          console.error('Error checking admin status:', profileError);
        }
        
        // If profile exists and is admin, or context says user is admin
        if ((profileData && profileData.is_admin) || isAdmin) {
          console.log('Admin access confirmed');
          setAuthorized(true);
        } else {
          console.log('User is not admin, redirecting to auth page');
          toast.error('Access denied', {
            description: 'Only administrators can access this page'
          });
          navigate('/auth');
        }
      } catch (error) {
        console.error('Error checking protected route:', error);
        toast.error('Access error', {
          description: 'There was an error verifying your permissions'
        });
        navigate('/auth');
      } finally {
        setCheckingPermission(false);
      }
    };
    
    checkPermission();
  }, [user, isLoading, isAdmin, navigate]);

  return { 
    isLoading: isLoading || checkingPermission, 
    isAdmin, 
    user, 
    authorized 
  };
};
