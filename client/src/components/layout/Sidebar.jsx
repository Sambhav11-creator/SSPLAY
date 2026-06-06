import { NavLink } from 'react-router-dom';
import {
  Home,
  Compass,
  TrendingUp,
  Search,
  Library,
  Heart,
  Clock,
  Video,
  Mic2,
  Radio,
  Upload,
  Settings,
  Bell,
  Crown,
} from 'lucide-react';
import { cn } from '../../utils/cn';

const nav = [
  { to: '/home', icon: Home, label: 'Home' },
  { to: '/discover', icon: Compass, label: 'Discover' },
  { to: '/trending', icon: TrendingUp, label: 'Trending' },
  { to: '/search', icon: Search, label: 'Search' },
  { to: '/library', icon: Library, label: 'Library' },
  { to: '/liked', icon: Heart, label: 'Liked Songs' },
  { to: '/recent', icon: Clock, label: 'Recently Played' },
  { to: '/videos', icon: Video, label: 'Music Videos' },
  { to: '/podcasts', icon: Mic2, label: 'Podcasts' },
  { to: '/following', icon: Radio, label: 'Following' },
  { to: '/live', icon: Radio, label: 'Live Activity' },
  { to: '/upload', icon: Upload, label: 'Upload' },
  { to: '/premium', icon: Crown, label: 'Premium' },
  { to: '/notifications', icon: Bell, label: 'Notifications' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export const Sidebar = () => (
  <aside className="hidden lg:flex flex-col w-64 shrink-0 glass-strong h-[calc(100vh-24px)] m-3 mr-0 rounded-2xl p-4 overflow-y-auto scrollbar-hide">
    <NavLink to="/" className="mb-8 px-2">
      <span className="text-2xl font-black gradient-text tracking-tight">SSPLAY</span>
    </NavLink>
    <nav className="flex flex-col gap-1 flex-1">
      {nav.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all',
              isActive
                ? 'bg-gradient-to-r from-ss-purple/30 to-ss-blue/20 text-white font-medium'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            )
          }
        >
          <Icon size={20} />
          {label}
        </NavLink>
      ))}
    </nav>
  </aside>
);
