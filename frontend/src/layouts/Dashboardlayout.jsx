
import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { ChevronDown, UserRound, Settings, LogOut } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../hooks/useAuth';

function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  const initials = user?.username
    ?.slice(0, 2)
    .toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 p-6 text-white">
        <h1 className="mb-10 text-2xl font-bold">CampusFlow</h1>
        <Navbar />
      </aside>

      <main className="ml-64 min-h-screen">
        <header className="flex h-20 items-center justify-end border-b border-slate-200 bg-white px-8">
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((previous) => !previous)}
              className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-slate-100"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700">
                {initials}
              </div>

              <div className="text-left">
                <p className="font-semibold text-slate-800">
                  {user?.username}
                </p>
                <p className="text-xs capitalize text-slate-500">
                  {user?.role}
                </p>
              </div>

              <ChevronDown
                size={18}
                className={`text-slate-500 transition-transform ${
                  menuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                <div className="border-b border-slate-100 px-3 py-2">
                  <p className="font-semibold text-slate-800">
                    {user?.username}
                  </p>
                  <p className="text-sm text-slate-500">
                    {user?.email}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate('/profile');
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                >
                  <UserRound size={17} />
                  Profile
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate('/settings');
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                >
                  <Settings size={17} />
                  Settings
                </button>

                <div className="my-1 border-t border-slate-100" />

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut size={17} />
                  Log out
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;
