import { AnimatePresence, motion } from 'framer-motion';
import { usePlayerStore } from '../../store/playerStore';

export const VideoBackground = () => {
  const track = usePlayerStore((s) => s.currentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const videoUrl = track?.videoUrl;

  if (!isPlaying || !videoUrl) return null;

  return (
    <AnimatePresence>
      <motion.div
        key={videoUrl}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.2 }}
        className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      >
        <video
          src={videoUrl}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover scale-110 blur-3xl opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ss-black/80 via-ss-black/60 to-ss-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.15),transparent_60%)]" />
      </motion.div>
    </AnimatePresence>
  );
};
