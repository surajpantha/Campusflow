
import { Routes, Route } from 'react-router';

import Dashboard from './pages/Dashboard';
import Assignments from './pages/Assignments';
import Login from './pages/Login';
import Register from './pages/Register';
import Unauthorized from './pages/Unauthorized';
import TeacherDashboard from './pages/TeacherDashboard';

import DashboardLayout from './layouts/Dashboardlayout';
import ProtectedRoute from './components/ProtectedRoute';

import { AssignmentProvider } from './context/AssignmentContext';

function App() {
  return (
    <AssignmentProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Student routes */}
        <Route element={<ProtectedRoute allowedRoles={['student']} />}>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="assignments" element={<Assignments />} />
          </Route>
        </Route>

        {/* Teacher routes */}
        <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
          <Route
            path="/teacher"
            element={<TeacherDashboard />}
          />
        </Route>
      </Routes>
    </AssignmentProvider>
  );
}

export default App;
