import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { musicApi } from '../services/musicApi';
import { TrackCard } from '../components/music/TrackCard';
import { usePlayer } from '../context/PlayerContext';
import { Button } from '../components/ui/Button';

export default function AlbumPage() {
  const { id } = useParams();
  const { playTrack } = usePlayer();
  const { data: album } = useQuery({
    queryKey: ['album', id],
    queryFn: () => musicApi.getAlbum(id).then((r) => r.data.data),
  });

  if (!album) return null;

  return (
    <div>
      <div className="flex gap-6 mb-8">
        <img src={album.coverArt} alt="" className="w-56 h-56 rounded-2xl object-cover" />
        <div className="flex flex-col justify-end">
          <p className="text-sm text-white/50">Album</p>
          <h1 className="text-4xl font-bold">{album.title}</h1>
          <p className="text-white/60">{album.artist?.name}</p>
          <Button className="mt-4 w-fit" onClick={() => album.songs?.[0] && playTrack(album.songs[0], album.songs)}>
            Play
          </Button>
        </div>
      </div>
      {album.songs?.map((t, i) => <TrackCard key={t._id} track={t} layout="row" index={i} />)}
    </div>
  );
}
