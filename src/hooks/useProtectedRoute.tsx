
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

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
        navigate('/auth');
      } else if (!isAdmin) {
        console.log('User is not admin, redirecting to auth page');
        navigate('/auth');
      } else {
        console.log('Admin authorized to access this route');
        setAuthorized(true);
      }
    }
  }, [user, isLoading, isAdmin, navigate]);

  return { isLoading, isAdmin, user, authorized };
};
