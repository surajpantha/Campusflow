import { Routes, Route } from 'react-router';

import Dashboard from './pages/Dashboard';
import Assignments from './pages/Assignments';
import Login from './pages/Login';
import Register from './pages/Register';
import Unauthorized from './pages/Unauthorized';
import TeacherDashboard from './pages/TeacherDashboard';
import CourseCatalogue from './pages/CourseCatalogue';
import MyCourses from './pages/MyCourses';

import DashboardLayout from './layouts/Dashboardlayout';
import ProtectedRoute from './components/ProtectedRoute';
import GuestRoute from './components/GuestRoute';

import { AssignmentProvider } from './context/AssignmentProvider';
import { StudentCourseProvider } from './context/StudentCourseProvider';
import CourseDetail from "./pages/CourseDetail";

function App() {
    return (
        <Routes>
            <Route element={<GuestRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Route>

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
                            <StudentCourseProvider>
                                <DashboardLayout />
                            </StudentCourseProvider>
                        </AssignmentProvider>
                    }
                >
                    <Route index element={<Dashboard />} />
                    <Route path="assignments" element={<Assignments />} />
                    <Route path="courses" element={<CourseCatalogue />} />
                    <Route path="courses/:courseId" element={<CourseDetail />} />
                    <Route path="my-courses" element={<MyCourses />} />
                </Route>
            </Route>

            {/* Teacher routes */}
            <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
                <Route path="/teacher" element={<DashboardLayout />}>
                    <Route index element={<TeacherDashboard />} />
                </Route>
            </Route>
        </Routes>
    );
}

export default App;