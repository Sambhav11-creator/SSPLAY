import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { formatTime } from '../../utils/formatTime';

export const TrackCard = ({ track, index = 0, layout = 'grid', onClick }) => {
  const { playTrack } = usePlayer();
  const artistName = track.artist?.name || track.artist || 'Unknown';

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    } else {
      playTrack(track);
    }
  };

  if (layout === 'row') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.03 }}
        className="group flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 cursor-pointer"
        onClick={handleClick}
      >
        <span className="w-6 text-sm text-white/40 group-hover:hidden">{index + 1}</span>
        <button className="hidden group-hover:flex w-6 h-6 items-center justify-center text-ss-purple">
          <Play size={16} fill="currentColor" />
        </button>
        <img src={track.coverArt} alt="" className="w-12 h-12 rounded-lg object-cover" />
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{track.title}</p>
          <p className="text-sm text-white/50 truncate">{artistName}</p>
        </div>
        <span className="text-sm text-white/40">{formatTime(track.duration)}</span>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="group cursor-pointer p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 flex flex-col min-w-0"
      onClick={handleClick}
    >
      <div className="relative aspect-square rounded-lg overflow-hidden mb-4 shadow-lg">
        <img src={track.coverArt} alt={track.title} className="w-full h-full object-cover" />
        <div className="absolute bottom-3 right-3 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <div className="w-12 h-12 rounded-full bg-ss-purple flex items-center justify-center shadow-2xl hover:scale-105 transition-transform">
            <Play size={20} fill="white" className="text-white ml-0.5" />
          </div>
        </div>
      </div>
      <div className="min-w-0">
        <p className="font-bold text-white truncate text-sm mb-1">{track.title}</p>
        <p className="text-xs text-white/50 truncate">{artistName}</p>
      </div>
    </motion.div>
  );
};

export const SectionHeader = ({ title, subtitle, action }) => (
  <div className="flex items-end justify-between mb-6">
    <div>
      <h2 className="text-2xl font-bold gradient-text">{title}</h2>
      {subtitle && <p className="text-white/50 text-sm mt-1">{subtitle}</p>}
    </div>
    {action}
  </div>
);
