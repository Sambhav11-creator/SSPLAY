import { useQuery } from '@tanstack/react-query';
import { musicApi } from '../services/musicApi';
import { TrackCard, SectionHeader } from '../components/music/TrackCard';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function LikedPage() {
  const { user } = useAuth();
  const { data } = useQuery({
    queryKey: ['liked'],
    queryFn: () => musicApi.getLiked().then((r) => r.data.data),
    enabled: !!user,
  });

  if (!user) return <p className="text-center text-white/50">Please <Link to="/login" className="text-ss-purple">log in</Link> to see liked songs.</p>;

  return (
    <div>
      <SectionHeader title="Liked Songs" />
      {data?.map((t, i) => <TrackCard key={t._id} track={t} layout="row" index={i} />)}
    </div>
  );
}
