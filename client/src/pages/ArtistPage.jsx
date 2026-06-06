import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { musicApi } from '../services/musicApi';
import { TrackCard } from '../components/music/TrackCard';
import { formatNumber } from '../utils/formatTime';

export default function ArtistPage() {
  const { id } = useParams();
  const { data } = useQuery({
    queryKey: ['artist', id],
    queryFn: () => musicApi.getArtist(id).then((r) => r.data.data),
  });

  if (!data) return null;
  const { artist, songs } = data;

  return (
    <div>
      <div className="relative h-64 rounded-3xl overflow-hidden mb-6">
        <img src={artist.banner || artist.image} alt="" className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-ss-black to-transparent" />
        <div className="absolute bottom-6 left-6 flex items-end gap-4">
          <img src={artist.image} alt="" className="w-32 h-32 rounded-full border-4 border-ss-black object-cover" />
          <div>
            <h1 className="text-4xl font-bold">{artist.name}</h1>
            <p className="text-white/60">{formatNumber(artist.monthlyListeners)} monthly listeners</p>
          </div>
        </div>
      </div>
      <p className="text-white/70 mb-6 max-w-2xl">{artist.bio}</p>
      <h2 className="text-xl font-bold mb-4">Popular</h2>
      {songs?.map((t, i) => <TrackCard key={t._id} track={t} layout="row" index={i} />)}
    </div>
  );
}
