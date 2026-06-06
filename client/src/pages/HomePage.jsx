import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { musicApi } from '../services/musicApi';
import { TrackCard, SectionHeader } from '../components/music/TrackCard';
import { CardSkeleton } from '../components/ui/Skeleton';
import { usePlayer } from '../context/PlayerContext';

const FALLBACK_BOLLYWOOD = [
  { _id: 'b1', title: 'Kesariya', artist: 'Arijit Singh', coverArt: 'https://picsum.photos/seed/kesariya/400/400', duration: 268, source: 'jiosaavn' },
  { _id: 'b2', title: 'Tum Hi Ho', artist: 'Arijit Singh', coverArt: 'https://picsum.photos/seed/tumhiho/400/400', duration: 262, source: 'jiosaavn' },
  { _id: 'b3', title: 'Apna Bana Le', artist: 'Arijit Singh', coverArt: 'https://picsum.photos/seed/apnabanale/400/400', duration: 264, source: 'jiosaavn' },
  { _id: 'b4', title: 'Chaleya', artist: 'Arijit Singh', coverArt: 'https://picsum.photos/seed/chaleya/400/400', duration: 200, source: 'jiosaavn' },
  { _id: 'b5', title: 'Kabira', artist: 'Arijit Singh', coverArt: 'https://picsum.photos/seed/kabira/400/400', duration: 223, source: 'jiosaavn' },
  { _id: 'b6', title: 'Hawayein', artist: 'Arijit Singh', coverArt: 'https://picsum.photos/seed/hawayein/400/400', duration: 289, source: 'jiosaavn' },
  { _id: 'b7', title: 'Channa Mereya', artist: 'Arijit Singh', coverArt: 'https://picsum.photos/seed/channamereya/400/400', duration: 289, source: 'jiosaavn' },
  { _id: 'b8', title: 'Ae Dil Hai Mushkil', artist: 'Arijit Singh', coverArt: 'https://picsum.photos/seed/aedil/400/400', duration: 269, source: 'jiosaavn' },
];

const FALLBACK_PUNJABI = [
  { _id: 'p1', title: 'Brown Munde', artist: 'AP Dhillon', coverArt: 'https://picsum.photos/seed/brownmunde/400/400', duration: 267, source: 'jiosaavn' },
  { _id: 'p2', title: 'Mi Amor', artist: 'Sharn', coverArt: 'https://picsum.photos/seed/miamor/400/400', duration: 210, source: 'jiosaavn' },
  { _id: 'p3', title: 'Excuses', artist: 'AP Dhillon', coverArt: 'https://picsum.photos/seed/excuses/400/400', duration: 176, source: 'jiosaavn' },
  { _id: 'p4', title: '295', artist: 'Sidhu Moose Wala', coverArt: 'https://picsum.photos/seed/295/400/400', duration: 270, source: 'jiosaavn' },
  { _id: 'p5', title: 'The Last Ride', artist: 'Sidhu Moose Wala', coverArt: 'https://picsum.photos/seed/lastride/400/400', duration: 252, source: 'jiosaavn' },
  { _id: 'p6', title: 'Lover', artist: 'Diljit Dosanjh', coverArt: 'https://picsum.photos/seed/lover/400/400', duration: 191, source: 'jiosaavn' },
  { _id: 'p7', title: 'G.O.A.T.', artist: 'Diljit Dosanjh', coverArt: 'https://picsum.photos/seed/goat/400/400', duration: 223, source: 'jiosaavn' },
  { _id: 'p8', title: 'Born to Shine', artist: 'Diljit Dosanjh', coverArt: 'https://picsum.photos/seed/borntoshine/400/400', duration: 213, source: 'jiosaavn' },
];

const FALLBACK_ROMANTIC = [
  { _id: 'r1', title: 'Raataan Lambiyan', artist: 'Jubin Nautiyal', coverArt: 'https://picsum.photos/seed/raataan/400/400', duration: 230, source: 'jiosaavn' },
  { _id: 'r2', title: 'Ranjha', artist: 'B Praak', coverArt: 'https://picsum.photos/seed/ranjha/400/400', duration: 228, source: 'jiosaavn' },
  { _id: 'r3', title: 'Dil Diyan Gallan', artist: 'Atif Aslam', coverArt: 'https://picsum.photos/seed/dildiyan/400/400', duration: 260, source: 'jiosaavn' },
  { _id: 'r4', title: 'Kaun Tujhe', artist: 'Palak Muchhal', coverArt: 'https://picsum.photos/seed/kauntujhe/400/400', duration: 241, source: 'jiosaavn' },
  { _id: 'r5', title: 'Dil Ko Karaar Aaya', artist: 'Yasser Desai', coverArt: 'https://picsum.photos/seed/dilko/400/400', duration: 273, source: 'jiosaavn' },
  { _id: 'r6', title: 'Tera Ban Jaunga', artist: 'Tulsi Kumar', coverArt: 'https://picsum.photos/seed/teraban/400/400', duration: 197, source: 'jiosaavn' },
  { _id: 'r7', title: 'Tujhe Kitna Chahne Lage', artist: 'Arijit Singh', coverArt: 'https://picsum.photos/seed/tujhekitna/400/400', duration: 284, source: 'jiosaavn' },
  { _id: 'r8', title: 'Bekhayali', artist: 'Sachet Tandon', coverArt: 'https://picsum.photos/seed/bekhayali/400/400', duration: 371, source: 'jiosaavn' },
];

const FALLBACK_TOLLYWOOD = [
  { _id: 't1', title: 'Naatu Naatu', artist: 'Rahul Sipligunj', coverArt: 'https://picsum.photos/seed/naatu/400/400', duration: 215, source: 'jiosaavn' },
  { _id: 't2', title: 'Arabic Kuthu', artist: 'Anirudh Ravichander', coverArt: 'https://picsum.photos/seed/arabic/400/400', duration: 280, source: 'jiosaavn' },
  { _id: 't3', title: 'Ranjithame', artist: 'Vijay', coverArt: 'https://picsum.photos/seed/ranjithame/400/400', duration: 288, source: 'jiosaavn' },
  { _id: 't4', title: 'Hukum', artist: 'Anirudh Ravichander', coverArt: 'https://picsum.photos/seed/hukum/400/400', duration: 207, source: 'jiosaavn' },
  { _id: 't5', title: 'Badass', artist: 'Anirudh Ravichander', coverArt: 'https://picsum.photos/seed/badass/400/400', duration: 229, source: 'jiosaavn' },
  { _id: 't6', title: 'Oo Antava Oo Oo Antava', artist: 'Indravathi Chauhan', coverArt: 'https://picsum.photos/seed/ooantava/400/400', duration: 223, source: 'jiosaavn' },
  { _id: 't7', title: 'Srivalli', artist: 'Sid Sriram', coverArt: 'https://picsum.photos/seed/srivalli/400/400', duration: 224, source: 'jiosaavn' },
  { _id: 't8', title: 'Butta Bomma', artist: 'Armaan Malik', coverArt: 'https://picsum.photos/seed/buttabomma/400/400', duration: 209, source: 'jiosaavn' },
];

const FALLBACK_INDIE = [
  { _id: 'i1', title: 'Baarishein', artist: 'Anuv Jain', coverArt: 'https://picsum.photos/seed/baarishein/400/400', duration: 207, source: 'jiosaavn' },
  { _id: 'i2', title: 'Alag Aasmaan', artist: 'Anuv Jain', coverArt: 'https://picsum.photos/seed/alagaasmaan/400/400', duration: 212, source: 'jiosaavn' },
  { _id: 'i3', title: 'Husn', artist: 'Anuv Jain', coverArt: 'https://picsum.photos/seed/husn/400/400', duration: 217, source: 'jiosaavn' },
  { _id: 'i4', title: 'Choo Lo', artist: 'The Local Train', coverArt: 'https://picsum.photos/seed/choolo/400/400', duration: 233, source: 'jiosaavn' },
  { _id: 'i5', title: 'Dil Mere', artist: 'The Local Train', coverArt: 'https://picsum.photos/seed/dilmere/400/400', duration: 209, source: 'jiosaavn' },
  { _id: 'i6', title: 'Kasoor', artist: 'Prateek Kuhad', coverArt: 'https://picsum.photos/seed/kasoor/400/400', duration: 197, source: 'jiosaavn' },
  { _id: 'i7', title: 'cold/mess', artist: 'Prateek Kuhad', coverArt: 'https://picsum.photos/seed/coldmess/400/400', duration: 246, source: 'jiosaavn' },
  { _id: 'i8', title: 'Tu Aake Dekhle', artist: 'King', coverArt: 'https://picsum.photos/seed/tuaakedekhle/400/400', duration: 270, source: 'jiosaavn' },
];

const SongRow = ({ title, subtitle, songs, playTrack }) => {
  if (!songs || songs.length === 0) return null;
  return (
    <section className="space-y-4">
      <SectionHeader title={title} subtitle={subtitle} />
      <div className="flex overflow-x-auto gap-5 pb-3 scrollbar-hide scroll-smooth snap-x snap-mandatory">
        {songs.map((t, i) => (
          <div key={t._id || i} className="w-[190px] shrink-0 snap-start">
            <TrackCard track={t} index={i} onClick={() => playTrack(t, songs)} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default function HomePage() {
  const { playTrack } = usePlayer();

  // Fetch 20 tracks for each Indian category
  const { data: bollywood, isLoading: bolLoading } = useQuery({
    queryKey: ['songs-bollywood'],
    queryFn: () => musicApi.getSongs({ genre: 'Bollywood', limit: 20 }).then((r) => r.data.data.results).catch(() => []),
    retry: 1,
  });

  const { data: punjabi, isLoading: punLoading } = useQuery({
    queryKey: ['songs-punjabi'],
    queryFn: () => musicApi.getSongs({ genre: 'Punjabi', limit: 20 }).then((r) => r.data.data.results).catch(() => []),
    retry: 1,
  });

  const { data: tollywood, isLoading: tolLoading } = useQuery({
    queryKey: ['songs-tollywood'],
    queryFn: () => musicApi.getSongs({ genre: 'Tollywood', limit: 20 }).then((r) => r.data.data.results).catch(() => []),
    retry: 1,
  });

  const { data: romantic, isLoading: romLoading } = useQuery({
    queryKey: ['songs-romantic'],
    queryFn: () => musicApi.getSongs({ genre: 'Romantic', limit: 20 }).then((r) => r.data.data.results).catch(() => []),
    retry: 1,
  });

  const { data: indie, isLoading: indLoading } = useQuery({
    queryKey: ['songs-indie'],
    queryFn: () => musicApi.getSongs({ genre: 'Indie', limit: 20 }).then((r) => r.data.data.results).catch(() => []),
    retry: 1,
  });

  const isLoading = bolLoading || punLoading || tolLoading || romLoading || indLoading;

  const bollywoodSongs = bollywood && bollywood.length > 0 ? bollywood : FALLBACK_BOLLYWOOD;
  const punjabiSongs = punjabi && punjabi.length > 0 ? punjabi : FALLBACK_PUNJABI;
  const tollywoodSongs = tollywood && tollywood.length > 0 ? tollywood : FALLBACK_TOLLYWOOD;
  const romanticSongs = romantic && romantic.length > 0 ? romantic : FALLBACK_ROMANTIC;
  const indieSongs = indie && indie.length > 0 ? indie : FALLBACK_INDIE;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10 pb-12">
      {/* Banner */}
      <section className="relative rounded-3xl overflow-hidden min-h-[260px] flex items-end p-8 glass">
        <div className="absolute inset-0 bg-gradient-to-r from-ss-purple/40 to-ss-blue/30" />
        <div className="relative z-10">
          <p className="text-sm text-white/70 mb-2">Welcome back</p>
          <h1 className="text-4xl font-black mb-4">Your cinematic soundtrack awaits</h1>
          <button
            onClick={() => bollywoodSongs?.[0] && playTrack(bollywoodSongs[0], bollywoodSongs)}
            className="px-6 py-3 rounded-full bg-white text-black font-semibold hover:scale-105 transition-transform cursor-pointer"
          >
            Play recommended mix
          </button>
        </div>
      </section>

      {/* Content rows (renders fallbacks instantly if API is not yet loaded/failed) */}
      <div className="space-y-10">
        <SongRow title="Bollywood Melodies" subtitle="Top romantic & cinematic hits" songs={bollywoodSongs} playTrack={playTrack} />
        <SongRow title="Punjabi Beats" subtitle="High-energy anthems" songs={punjabiSongs} playTrack={playTrack} />
        <SongRow title="Romantic Special" subtitle="Vibe to these romantic tunes" songs={romanticSongs} playTrack={playTrack} />
        <SongRow title="Tollywood Hits" subtitle="Best of South Indian soundtracks" songs={tollywoodSongs} playTrack={playTrack} />
        <SongRow title="Indie Pop & Lofi" subtitle="Relaxed lofi and indie tunes" songs={indieSongs} playTrack={playTrack} />
      </div>
    </motion.div>
  );
}
