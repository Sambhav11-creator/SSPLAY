import { useQuery } from '@tanstack/react-query';
import { musicApi } from '../../services/musicApi';

export default function AdminApiMonitor() {
  const { data } = useQuery({
    queryKey: ['admin-api'],
    queryFn: () => musicApi.adminDashboard().then((r) => r.data.data.apiStatus),
  });

  return (
    <div>
      <h1 className="text-2xl font-bold gradient-text mb-6">API Monitor</h1>
      <div className="grid gap-3 max-w-md">
        {data && Object.entries(data).map(([k, v]) => (
          <div key={k} className="glass rounded-xl px-4 py-3 flex justify-between">
            <span className="capitalize">{k}</span>
            <span className={v ? 'text-green-400' : 'text-red-400'}>{v ? 'Online' : 'Offline'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
