import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { isAdminEmail } from '@/lib/admin';

export const useProtectedRoute = () => {
  const { user, isLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);
  const [checkingPermission, setCheckingPermission] = useState(true);

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      setAuthorized(false);
      setCheckingPermission(false);
      toast.error('Authentication required', {
        description: 'Please sign in to access the admin panel.',
      });
      navigate('/auth', { replace: true });
      return;
    }

    if (!isAdmin || !isAdminEmail(user.email)) {
      setAuthorized(false);
      setCheckingPermission(false);
      toast.error('Access denied', {
        description: 'Only the approved administrator can access this page.',
      });
      navigate('/auth', { replace: true });
      return;
    }

    setAuthorized(true);
    setCheckingPermission(false);
  }, [user, isLoading, isAdmin, navigate]);

  return {
    isLoading: isLoading || checkingPermission,
    isAdmin: authorized,
    user,
    authorized,
  };
};
