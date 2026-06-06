import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { SectionHeader } from '../components/music/TrackCard';
import { Radio } from 'lucide-react';

export default function LiveActivityPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
      auth: { token: localStorage.getItem('ssplay_token') },
    });
    socket.on('live:activity', (data) => {
      setEvents((prev) => [{ ...data, id: Date.now() }, ...prev].slice(0, 30));
    });
    return () => socket.disconnect();
  }, []);

  return (
    <div>
      <SectionHeader title="Live Activity" subtitle="Real-time listening across SSPLAY" />
      <div className="space-y-2">
        {events.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center text-white/50">
            <Radio className="mx-auto mb-4 animate-pulse" />
            Waiting for live activity...
          </div>
        ) : (
          events.map((e) => (
            <div key={e.id} className="glass rounded-xl px-4 py-3 flex justify-between text-sm">
              <span><strong>{e.user}</strong> is playing <strong>{e.title}</strong></span>
              <span className="text-white/40">{new Date(e.at).toLocaleTimeString()}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
