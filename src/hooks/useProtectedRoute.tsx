
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export const useProtectedRoute = (adminOnly = false) => {
  const { user, isLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Only perform navigation after auth check is complete
    if (!isLoading) {
      console.log('Protected route check:', { user, isAdmin, adminOnly });
      
      if (!user) {
        console.log('No user, redirecting to auth page');
        navigate('/auth');
      } else if (adminOnly && !isAdmin) {
        console.log('User is not admin, redirecting to home page');
        navigate('/');
      } else {
        console.log('User authorized to access this route');
        setAuthorized(true);
      }
    }
  }, [user, isLoading, isAdmin, navigate, adminOnly]);

  return { isLoading, isAdmin, user, authorized };
};
