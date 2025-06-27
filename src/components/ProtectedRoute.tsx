
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/presentation/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, loading, userType, session } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!user || !session) {
    return <Navigate to="/auth/login" state={{ from: location.pathname }} replace />;
  }

  // Check if user has required role
  if (requiredRole && userType !== requiredRole) {
    return <Navigate to="/dashboard" state={{ error: 'You do not have permission to access this page' }} replace />;
  }

  // Check session validity
  if (session.expires_at && new Date(session.expires_at * 1000) <= new Date()) {
    return <Navigate to="/auth/login" state={{ error: 'Your session has expired. Please log in again.' }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
