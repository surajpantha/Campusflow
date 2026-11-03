import { Routes, Route, Link } from 'react-router';
import Dashboard from './pages/Dashboard';
import Assignments from './pages/Assignments';
import DashboardLayout from './layouts/Dashboardlayout';

function App() {
  return (


    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="assignments" element={<Assignments />} />
      </Route>
    </Routes>

  );
}

export default App;