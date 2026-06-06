import { useQuery } from '@tanstack/react-query';
import { musicApi } from '../services/musicApi';
import { TrackCard, SectionHeader } from '../components/music/TrackCard';

export default function TrendingPage() {
  const { data } = useQuery({
    queryKey: ['trending'],
    queryFn: () => musicApi.getTrending().then((r) => r.data.data),
  });

  return (
    <div>
      <SectionHeader title="Trending" subtitle="What's hot on SSPLAY" />
      <div className="space-y-2">
        {data?.local?.map((t, i) => <TrackCard key={t._id} track={t} layout="row" index={i} />)}
      </div>
    </div>
  );
}
