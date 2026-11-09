
import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../hooks/useAuth';

function GuestRoute() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-slate-500">
                    Checking authentication...
                </p>
            </div>
        );
    }

    // Authenticated users should not access guest-only pages.
    if (user) {
        const destination =
            user.role === 'teacher' ? '/teacher' : '/';

        return <Navigate to={destination} replace />;
    }

    return <Outlet />;
}

export default GuestRoute;
