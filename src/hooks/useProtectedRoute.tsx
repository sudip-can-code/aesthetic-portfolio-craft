
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export const useProtectedRoute = (adminOnly = false) => {
  const { user, isLoading, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate('/auth');
      } else if (adminOnly && !isAdmin) {
        navigate('/');
      }
    }
  }, [user, isLoading, isAdmin, navigate, adminOnly]);

  return { isLoading, isAdmin, user };
};
