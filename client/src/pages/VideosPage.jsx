import { useQuery } from '@tanstack/react-query';
import { musicApi } from '../services/musicApi';
import { usePlayer } from '../context/PlayerContext';
import { SectionHeader } from '../components/music/TrackCard';

export default function VideosPage() {
  const { playTrack } = usePlayer();
  const { data } = useQuery({
    queryKey: ['videos'],
    queryFn: () => musicApi.getSongs({ limit: 20 }).then((r) => r.data.data?.filter((s) => s.videoUrl) || r.data.data),
  });

  return (
    <div>
      <SectionHeader title="Music Videos" subtitle="Cinematic visuals" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.map((t) => (
          <button
            key={t._id}
            onClick={() => playTrack(t)}
            className="glass rounded-2xl overflow-hidden text-left hover:neon-glow transition-shadow"
          >
            <div className="aspect-video relative">
              <img src={t.coverArt} alt="" className="w-full h-full object-cover" />
              <span className="absolute bottom-2 left-2 text-xs bg-black/60 px-2 py-1 rounded">VIDEO</span>
            </div>
            <div className="p-4">
              <p className="font-semibold">{t.title}</p>
              <p className="text-sm text-white/50">{t.artist?.name}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
