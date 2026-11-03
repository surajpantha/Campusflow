import { Outlet } from 'react-router';
import Navbar from '../components/Navbar';

function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-50">

      <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white p-6">
        <h1 className="text-2xl font-bold mb-10">
          CampusFlow
        </h1>

        <Navbar />
      </aside>

      <main className="ml-64 min-h-screen p-8">
        <Outlet />
      </main>

    </div>
  );
}

export default DashboardLayout;