import { Routes, Route } from 'react-router';

import Dashboard from './pages/Dashboard';
import Assignments from './pages/Assignments';
import Login from './pages/Login';
import Register from './pages/Register';
import Unauthorized from './pages/Unauthorized';
import TeacherDashboard from './pages/TeacherDashboard';

import DashboardLayout from './layouts/Dashboardlayout';
import ProtectedRoute from './components/ProtectedRoute';
import GuestRoute from './components/GuestRoute';

import { AssignmentProvider } from './context/AssignmentProvider';

function App() {
    return (
        <Routes>

            {/* Guest-only routes */}
            <Route element={<GuestRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Route>

            {/* Public route */}
            <Route
                path="/unauthorized"
                element={<Unauthorized />}
            />

            {/* Student routes */}
            <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                <Route
                    path="/"
                    element={
                        <AssignmentProvider>
                            <DashboardLayout />
                        </AssignmentProvider>
                    }
                >
                    <Route index element={<Dashboard />} />

                    <Route
                        path="assignments"
                        element={<Assignments />}
                    />
                </Route>
            </Route>

            {/* Teacher routes */}
            <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
                <Route
                    path="/teacher"
                    element={<DashboardLayout />}
                >
                    <Route index element={<TeacherDashboard />} />
                </Route>
            </Route>

        </Routes>
    );
}

export default App;