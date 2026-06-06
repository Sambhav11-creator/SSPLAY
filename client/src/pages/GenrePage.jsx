import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { musicApi } from '../services/musicApi';
import { TrackCard, SectionHeader } from '../components/music/TrackCard';

export default function GenrePage() {
  const { genre } = useParams();
  const { data } = useQuery({
    queryKey: ['genre', genre],
    queryFn: () => musicApi.getSongs({ genre, limit: 40 }).then((r) => r.data.data),
  });

  return (
    <div>
      <SectionHeader title={decodeURIComponent(genre || '')} subtitle="Genre collection" />
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {data?.map((t, i) => <TrackCard key={t._id} track={t} index={i} />)}
      </div>
    </div>
  );
}
