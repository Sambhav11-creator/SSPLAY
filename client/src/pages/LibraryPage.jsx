import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { musicApi } from '../services/musicApi';
import { SectionHeader } from '../components/music/TrackCard';

export default function LibraryPage() {
  const { data: playlists } = useQuery({
    queryKey: ['playlists-public'],
    queryFn: () => musicApi.getPlaylists().then((r) => r.data.data),
  });
  const { data: albums } = useQuery({
    queryKey: ['albums'],
    queryFn: () => musicApi.getAlbums().then((r) => r.data.data),
  });

  const links = [
    { to: '/liked', label: 'Liked Songs', color: 'from-pink-500/30' },
    { to: '/recent', label: 'Recently Played', color: 'from-ss-blue/30' },
    { to: '/queue', label: 'Queue', color: 'from-ss-purple/30' },
  ];

  return (
    <div className="space-y-8">
      <SectionHeader title="Your Library" />
      <div className="grid sm:grid-cols-3 gap-4">
        {links.map((l) => (
          <Link key={l.to} to={l.to} className={`glass rounded-2xl p-6 bg-gradient-to-br ${l.color} to-transparent hover:scale-[1.02] transition-transform`}>
            <span className="font-bold text-lg">{l.label}</span>
          </Link>
        ))}
      </div>
      <section>
        <h3 className="font-semibold mb-4">Playlists</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {playlists?.map((p) => (
            <Link key={p._id} to={`/playlist/${p._id}`} className="glass rounded-xl p-4 hover:border-ss-purple/30">
              <img src={p.coverArt} alt="" className="aspect-square rounded-lg object-cover mb-2" />
              <p className="font-medium truncate">{p.name}</p>
            </Link>
          ))}
        </div>
      </section>
      <section>
        <h3 className="font-semibold mb-4">Albums</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {albums?.map((a) => (
            <Link key={a._id} to={`/album/${a._id}`}>
              <img src={a.coverArt} alt="" className="aspect-square rounded-xl object-cover mb-2" />
              <p className="font-medium truncate">{a.title}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
