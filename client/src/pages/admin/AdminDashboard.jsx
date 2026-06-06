import { useQuery } from '@tanstack/react-query';
import { musicApi } from '../../services/musicApi';
import { formatNumber } from '../../utils/formatTime';

export default function AdminDashboard() {
  const { data } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => musicApi.adminDashboard().then((r) => r.data.data),
  });

  const stats = data?.stats || {};

  return (
    <div>
      <h1 className="text-3xl font-bold gradient-text mb-8">Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Users', value: stats.users },
          { label: 'Songs', value: stats.songs },
          { label: 'Artists', value: stats.artists },
          { label: 'Total Plays', value: stats.plays },
        ].map((s) => (
          <div key={s.label} className="glass rounded-2xl p-6">
            <p className="text-white/50 text-sm">{s.label}</p>
            <p className="text-3xl font-bold mt-1">{formatNumber(s.value || 0)}</p>
          </div>
        ))}
      </div>
      <div className="glass rounded-2xl p-6">
        <h2 className="font-semibold mb-4">Pending uploads: {stats.pending || 0}</h2>
        <h3 className="text-sm text-white/50 mb-2">Recent users</h3>
        {data?.recentUsers?.map((u) => (
          <div key={u._id} className="flex justify-between py-2 border-b border-white/5 text-sm">
            <span>{u.name} ({u.email})</span>
            <span className="text-ss-purple">{u.role}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
