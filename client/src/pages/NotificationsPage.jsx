import { useQuery } from '@tanstack/react-query';
import { musicApi } from '../services/musicApi';
import { SectionHeader } from '../components/music/TrackCard';
import { Bell } from 'lucide-react';

export default function NotificationsPage() {
  const { data } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => musicApi.getNotifications().then((r) => r.data.data),
  });

  return (
    <div>
      <SectionHeader title="Notifications" />
      {data?.length ? data.map((n) => (
        <div key={n._id} className={`glass rounded-xl p-4 mb-2 flex gap-3 ${!n.read ? 'border-ss-purple/30' : ''}`}>
          <Bell size={20} className="text-ss-purple shrink-0" />
          <div>
            <p className="font-medium">{n.title}</p>
            <p className="text-sm text-white/50">{n.message}</p>
          </div>
        </div>
      )) : <p className="text-white/50">No notifications yet.</p>}
    </div>
  );
}
