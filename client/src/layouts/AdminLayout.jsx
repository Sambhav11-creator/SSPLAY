import { Outlet, NavLink, Navigate } from 'react-router-dom';
import { LayoutDashboard, Users, Music, BarChart3, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/cn';

const links = [
  { to: '/admin', icon: LayoutDashboard, label: 'Overview', end: true },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/songs', icon: Music, label: 'Songs' },
  { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/admin/api', icon: Activity, label: 'API Monitor' },
];

export const AdminLayout = () => {
  const { isAdmin, user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/home" />;

  return (
    <div className="min-h-screen bg-ss-black flex">
      <aside className="w-56 glass-strong m-4 rounded-2xl p-4">
        <p className="text-xl font-bold gradient-text mb-6">SSPLAY Admin</p>
        {links.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn('flex gap-2 px-3 py-2 rounded-lg mb-1 text-sm', isActive ? 'bg-ss-purple/30' : 'hover:bg-white/5')
            }
          >
            <Icon size={18} /> {label}
          </NavLink>
        ))}
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};
