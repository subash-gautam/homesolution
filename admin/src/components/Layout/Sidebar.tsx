import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Calendar,
  CheckCircle,
} from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Users, label: 'Users', path: '/users' },
    { icon: Briefcase, label: 'Services', path: '/services' },
    { icon: CheckCircle, label: 'Provider Verification', path: '/providers' },
    { icon: Calendar, label: 'Bookings', path: '/bookings' },
  ];

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-blue-600">HomeSolution</h1>
      </div>
      <nav className="mt-8">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${
                    isActive ? 'bg-blue-50 text-blue-600' : ''
                  }`
                }
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;