import { useQuery } from '@tanstack/react-query';
import { musicApi } from '../services/musicApi';
import { SectionHeader } from '../components/music/TrackCard';
import { Mic2 } from 'lucide-react';

export default function PodcastsPage() {
  const { data } = useQuery({
    queryKey: ['podcasts'],
    queryFn: () => musicApi.getPodcasts().then((r) => r.data.data),
  });

  return (
    <div>
      <SectionHeader title="Podcasts" />
      <div className="grid md:grid-cols-3 gap-4">
        {data?.length ? data.map((p) => (
          <div key={p._id} className="glass rounded-2xl p-4 flex gap-4">
            <img src={p.coverArt} alt="" className="w-20 h-20 rounded-xl object-cover" />
            <div>
              <p className="font-bold">{p.title}</p>
              <p className="text-sm text-white/50 line-clamp-2">{p.description}</p>
            </div>
          </div>
        )) : (
          <div className="col-span-full glass rounded-2xl p-12 text-center text-white/50">
            <Mic2 className="mx-auto mb-4 opacity-50" size={48} />
            Podcasts coming soon on SSPLAY
          </div>
        )}
      </div>
    </div>
  );
}
