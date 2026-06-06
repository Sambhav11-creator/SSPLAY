import { useQuery } from '@tanstack/react-query';
import { musicApi } from '../services/musicApi';
import { TrackCard, SectionHeader } from '../components/music/TrackCard';

export default function RecentPage() {
  const { data } = useQuery({
    queryKey: ['history'],
    queryFn: () => musicApi.getHistory().then((r) => r.data.data),
  });

  return (
    <div>
      <SectionHeader title="Recently Played" />
      {data?.map((t, i) => <TrackCard key={`${t._id}-${i}`} track={t} layout="row" index={i} />)}
    </div>
  );
}
