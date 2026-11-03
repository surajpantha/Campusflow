import { Routes, Route } from 'react-router';
import Dashboard from './pages/Dashboard';
import Assignments from './pages/Assignments';
import DashboardLayout from './layouts/Dashboardlayout';
import { AssignmentProvider } from './context/AssignmentContext';

function App() {
  return (
    <AssignmentProvider>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="assignments" element={<Assignments />} />
        </Route>
      </Routes>
    </AssignmentProvider>

  );
}

export default App;