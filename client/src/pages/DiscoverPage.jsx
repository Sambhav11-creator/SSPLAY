import { useQuery } from '@tanstack/react-query';
import { musicApi } from '../services/musicApi';
import { TrackCard, SectionHeader } from '../components/music/TrackCard';

export default function DiscoverPage() {
  const { data: weekly } = useQuery({
    queryKey: ['discover-weekly'],
    queryFn: () => musicApi.getDiscoverWeekly().then((r) => r.data.data),
  });
  const { data: artists } = useQuery({
    queryKey: ['artists'],
    queryFn: () => musicApi.getArtists().then((r) => r.data.data),
  });

  return (
    <div className="space-y-10">
      <SectionHeader title="Discover" subtitle="New worlds of sound" />
      <section>
        <h3 className="text-lg font-semibold mb-4">Discover Weekly</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {weekly?.map((t, i) => <TrackCard key={t._id} track={t} index={i} />)}
        </div>
      </section>
      <section>
        <h3 className="text-lg font-semibold mb-4">Top Artists</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {artists?.map((a) => (
            <a key={a._id} href={`/artist/${a.slug || a._id}`} className="text-center group">
              <img src={a.image} alt="" className="w-full aspect-square rounded-full object-cover group-hover:neon-glow transition-shadow" />
              <p className="mt-2 font-medium truncate">{a.name}</p>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
