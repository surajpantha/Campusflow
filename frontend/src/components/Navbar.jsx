import { NavLink } from 'react-router';
import {
  LayoutDashboard,
  ClipboardList,
  CalendarDays,
  BookOpen,
  Settings,
} from 'lucide-react';

function Navbar() {
  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
      isActive
        ? 'bg-indigo-600 text-white shadow-md'
        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
    }`;

  return (
    <nav className="flex flex-col gap-2">

      <NavLink to="/" end className={linkClasses}>
        <LayoutDashboard size={20} />
        <span>Dashboard</span>
      </NavLink>

      <NavLink to="/assignments" className={linkClasses}>
        <ClipboardList size={20} />
        <span>Assignments</span>
      </NavLink>

      <NavLink to="/calendar" className={linkClasses}>
        <CalendarDays size={20} />
        <span>Calendar</span>
      </NavLink>

      <NavLink to="/courses" className={linkClasses}>
        <BookOpen size={20} />
        <span>Courses</span>
      </NavLink>

      <div className="mt-8 mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
        Preferences
      </div>

      <NavLink to="/settings" className={linkClasses}>
        <Settings size={20} />
        <span>Settings</span>
      </NavLink>

    </nav>
  );
}

export default Navbar;