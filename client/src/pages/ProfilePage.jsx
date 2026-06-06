import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export default function ProfilePage() {
  const { user } = useAuth();
  if (!user) return <p className="text-white/50"><Link to="/login">Log in</Link> to view profile.</p>;

  return (
    <div className="max-w-lg">
      <div className="glass rounded-3xl p-8 text-center">
        <img
          src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
          alt=""
          className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-ss-purple/50"
        />
        <h1 className="text-2xl font-bold">{user.name}</h1>
        <p className="text-white/50">{user.email}</p>
        {user.isPremium && <span className="inline-block mt-2 px-3 py-1 rounded-full bg-ss-purple/30 text-ss-purple-glow text-sm">Premium</span>}
        <Link to="/settings" className="block mt-6"><Button variant="ghost">Edit Settings</Button></Link>
      </div>
    </div>
  );
}
