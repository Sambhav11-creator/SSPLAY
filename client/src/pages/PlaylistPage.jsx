import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { musicApi } from '../services/musicApi';
import { TrackCard } from '../components/music/TrackCard';
import { usePlayer } from '../context/PlayerContext';
import { Button } from '../components/ui/Button';

export default function PlaylistPage() {
  const { id } = useParams();
  const { playTrack } = usePlayer();
  const { data: playlist } = useQuery({
    queryKey: ['playlist', id],
    queryFn: () => musicApi.getPlaylist(id).then((r) => r.data.data),
  });

  if (!playlist) return <p className="text-white/50">Loading...</p>;

  return (
    <div>
      <div className="flex gap-6 items-end mb-8">
        <img src={playlist.coverArt} alt="" className="w-48 h-48 rounded-2xl object-cover neon-glow" />
        <div>
          <p className="text-sm text-white/50 uppercase">Playlist</p>
          <h1 className="text-4xl font-bold mb-2">{playlist.name}</h1>
          <p className="text-white/60 mb-4">{playlist.description}</p>
          <Button onClick={() => playlist.songs?.[0] && playTrack(playlist.songs[0], playlist.songs)}>Play all</Button>
        </div>
      </div>
      <div className="space-y-1">
        {playlist.songs?.map((t, i) => <TrackCard key={t._id} track={t} layout="row" index={i} />)}
      </div>
    </div>
  );
}
