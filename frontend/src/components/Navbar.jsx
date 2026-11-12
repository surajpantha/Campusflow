import { NavLink } from 'react-router';
import {
    LayoutDashboard,
    ClipboardList,
    BookOpen,
    Library,
} from 'lucide-react';

const navigationByRole = {
    student: [
        {
            label: 'Dashboard',
            path: '/',
            icon: LayoutDashboard,
            end: true,
        },
        {
            label: 'Assignments',
            path: '/assignments',
            icon: ClipboardList,
        },
        {
            label: 'Course Catalogue',
            path: '/courses',
            icon: BookOpen,
        },
        {
            label: 'My Courses',
            path: '/my-courses',
            icon: Library,
        },
    ],

    teacher: [
        {
            label: 'Dashboard',
            path: '/teacher',
            icon: LayoutDashboard,
            end: true,
        },
    ],
};

function Navbar({ role }) {
    const navigation = navigationByRole[role] || [];

    const linkClasses = ({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
            isActive
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
        }`;

    return (
        <nav className="flex flex-col gap-2">
            {navigation.map(item => {
                const Icon = item.icon;

                return (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.end}
                        className={linkClasses}
                    >
                        <Icon size={20} />
                        <span>{item.label}</span>
                    </NavLink>
                );
            })}
        </nav>
    );
}

export default Navbar;