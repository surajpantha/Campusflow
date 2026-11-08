
import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../hooks/useAuth';

function ProtectedRoute({ allowedRoles }) {
  const { user, loading } = useAuth();

  // Wait until authentication restoration finishes.
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-500">Checking authentication...</p>
      </div>
    );
  }

  // User is not logged in.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // User is logged in but doesn't have the required role.
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
