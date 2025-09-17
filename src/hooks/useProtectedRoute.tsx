
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export const useProtectedRoute = () => {
  const { user, isLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);
  const [checkingPermission, setCheckingPermission] = useState(true);

  const checkPermission = React.useCallback(async () => {
    try {
      setCheckingPermission(true);
      
      // Wait for auth loading to complete
      if (isLoading) return;
      
      console.log('Protected route check:', { user: user?.email, isAdmin });
      
      if (!user) {
        console.log('No user, redirecting to auth page');
        toast.error('Authentication required', {
          description: 'Please login to access this page'
        });
        navigate('/auth');
        return;
      }
      
      // Check if user is admin based on email
      const ADMIN_EMAIL = 'saronsun88@gmail.com';
      if (user.email === ADMIN_EMAIL || isAdmin) {
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
  }, [user, isLoading, isAdmin, navigate]);

  React.useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  return { 
    isLoading: isLoading || checkingPermission, 
    isAdmin, 
    user, 
    authorized 
  };
};
