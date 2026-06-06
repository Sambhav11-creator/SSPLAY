import { Link } from 'react-router-dom';
import { Search, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const TopBar = () => {
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 px-6 py-4 glass rounded-2xl mx-4 mt-4 mb-2">
      <Link to="/search" className="flex-1 max-w-md flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-white/50 text-sm">
        <Search size={18} />
        Search songs, artists, albums...
      </Link>
      <div className="flex items-center gap-3">
        {user?.role === 'admin' && (
          <Link to="/admin" className="text-xs px-3 py-1 rounded-full border border-ss-purple/50 text-ss-purple-glow">
            Admin
          </Link>
        )}
        <Link
          to={user ? '/profile' : '/login'}
          className="w-10 h-10 rounded-full overflow-hidden border-2 border-ss-purple/50 flex items-center justify-center bg-white/10"
        >
          {user?.avatar ? (
            <img src={user.avatar} alt="" className="w-full h-full object-cover" />
          ) : (
            <User size={20} />
          )}
        </Link>
      </div>
    </header>
  );
};
