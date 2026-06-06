import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import { musicApi } from '../services/musicApi';
import { TrackCard, SectionHeader } from '../components/music/TrackCard';
import { usePlayer } from '../context/PlayerContext';

export default function SearchPage() {
  const [q, setQ] = useState('');
  const debounced = useDebounce(q);
  const { playTrack } = usePlayer();

  const { data, isFetching } = useQuery({
    queryKey: ['search', debounced],
    queryFn: () => musicApi.search(debounced).then((r) => r.data.data),
    enabled: debounced.length > 1,
  });

  const playCombined = (track, all) => playTrack(track, all);

  return (
    <div>
      <SectionHeader title="Search" subtitle="Unified catalog across APIs" />
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search millions of tracks..."
          className="w-full pl-12 pr-4 py-4 rounded-2xl glass text-lg focus:outline-none focus:ring-2 focus:ring-ss-purple/50"
        />
      </div>
      {isFetching && <p className="text-white/50">Searching...</p>}
      {data?.local?.length > 0 && (
        <section className="mb-8">
          <h3 className="font-semibold mb-4">SSPLAY Library</h3>
          <div className="space-y-1">
            {data.local.map((t, i) => (
              <TrackCard key={t._id || i} track={t} layout="row" index={i} />
            ))}
          </div>
        </section>
      )}
      {data?.external?.length > 0 && (
        <section>
          <h3 className="font-semibold mb-4">Global Catalog</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data.combined?.map((t, i) => (
              <TrackCard
                key={t._id || t.id || i}
                track={t}
                index={i}
                onClick={() => playCombined(t, data.combined)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
