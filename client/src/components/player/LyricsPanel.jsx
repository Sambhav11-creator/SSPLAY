import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { usePlayerStore } from '../../store/playerStore';
import { useQuery } from '@tanstack/react-query';
import { musicApi } from '../../services/musicApi';

export const LyricsPanel = () => {
  const show = usePlayerStore((s) => s.showLyrics);
  const toggle = usePlayerStore((s) => s.toggleLyrics);
  const track = usePlayerStore((s) => s.currentTrack);

  const { data } = useQuery({
    queryKey: ['lyrics', track?._id],
    queryFn: async () => {
      if (!track?._id) return null;
      const res = await musicApi.getLyrics(track._id);
      return res.data.data;
    },
    enabled: !!track?._id && show,
  });

  const lyrics = track?.lyrics || data?.lyrics;

  return (
    <AnimatePresence>
      {show && (
        <motion.aside
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          className="fixed right-0 top-0 bottom-24 w-full max-w-md z-50 glass-strong p-6 overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold gradient-text">Lyrics</h3>
            <button onClick={toggle} className="p-2 hover:bg-white/10 rounded-full">
              <X size={20} />
            </button>
          </div>
          {lyrics ? (
            <pre className="whitespace-pre-wrap text-white/80 leading-relaxed font-sans text-sm">
              {lyrics}
            </pre>
          ) : data?.lyricsUrl ? (
            <a href={data.lyricsUrl} target="_blank" rel="noreferrer" className="text-ss-blue hover:underline">
              View lyrics on Genius
            </a>
          ) : (
            <p className="text-white/50">No lyrics available for this track.</p>
          )}
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
