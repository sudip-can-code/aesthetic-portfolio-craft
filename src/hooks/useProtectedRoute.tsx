
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export const useProtectedRoute = () => {
  const { user, isLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Only perform navigation after auth check is complete
    if (!isLoading) {
      console.log('Protected route check:', { user, isAdmin });
      
      if (!user) {
        console.log('No user, redirecting to auth page');
        toast.error('Authentication required', {
          description: 'Please login to access this page'
        });
        navigate('/auth');
      } else if (!isAdmin) {
        console.log('User is not admin, redirecting to auth page');
        toast.error('Access denied', {
          description: 'Only administrators can access this page'
        });
        navigate('/auth');
      } else {
        console.log('Admin authorized to access this route');
        setAuthorized(true);
      }
    }
  }, [user, isLoading, isAdmin, navigate]);

  return { isLoading, isAdmin, user, authorized };
};
