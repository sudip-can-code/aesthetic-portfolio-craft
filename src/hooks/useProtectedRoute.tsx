import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export const useProtectedRoute = () => {
  const { user, isLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);
  const [checkingPermission, setCheckingPermission] = useState(true);
  const hasChecked = useRef(false);

  useEffect(() => {
    // Prevent multiple checks
    if (isLoading) return;
    if (hasChecked.current) return;

    const checkPermission = async () => {
      try {
        setCheckingPermission(true);
        hasChecked.current = true;
        
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
    };

    checkPermission();
  }, [user, isLoading, isAdmin, navigate]);

  // Reset check flag when user changes
  useEffect(() => {
    hasChecked.current = false;
  }, [user?.email]);

  return { 
    isLoading: isLoading || checkingPermission, 
    isAdmin, 
    user, 
    authorized 
  };
};