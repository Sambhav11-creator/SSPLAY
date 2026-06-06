import { motion } from 'framer-motion';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
  ListMusic,
  Maximize2,
  Mic2,
} from 'lucide-react';
import { usePlayerStore } from '../../store/playerStore';
import { usePlayer } from '../../context/PlayerContext';
import { formatTime } from '../../utils/formatTime';
import { WaveformVisualizer } from './WaveformVisualizer';
import { cn } from '../../utils/cn';

export const MusicPlayer = () => {
  const track = usePlayerStore((s) => s.currentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const progress = usePlayerStore((s) => s.progress);
  const duration = usePlayerStore((s) => s.duration);
  const volume = usePlayerStore((s) => s.volume);
  const shuffle = usePlayerStore((s) => s.shuffle);
  const repeat = usePlayerStore((s) => s.repeat);
  const fullscreen = usePlayerStore((s) => s.fullscreen);
  const {
    toggle,
    nextTrack,
    prevTrack,
    toggleShuffle,
    cycleRepeat,
    setVolume,
    toggleLyrics,
    toggleFullscreen,
    toggleQueuePanel,
  } = usePlayerStore();
  const { playTrack } = usePlayer();

  if (!track) return null;

  const artist = track.artist?.name || track.artist || 'Unknown';
  const pct = duration ? (progress / duration) * 100 : 0;

  if (fullscreen) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-[60] flex flex-col items-center justify-center glass-strong p-12"
      >
        <img src={track.coverArt} alt="" className="w-80 h-80 rounded-3xl object-cover neon-glow mb-8" />
        <h1 className="text-4xl font-bold mb-2">{track.title}</h1>
        <p className="text-xl text-white/60 mb-8">{artist}</p>
        <div className="flex items-center gap-6">
          <button onClick={prevTrack} className="p-4 hover:bg-white/10 rounded-full"><SkipBack size={32} /></button>
          <button onClick={toggle} className="w-20 h-20 rounded-full bg-ss-purple flex items-center justify-center neon-glow">
            {isPlaying ? <Pause size={36} /> : <Play size={36} fill="white" className="ml-1" />}
          </button>
          <button onClick={nextTrack} className="p-4 hover:bg-white/10 rounded-full"><SkipForward size={32} /></button>
        </div>
        <button onClick={toggleFullscreen} className="absolute top-6 right-6 text-sm text-white/50 hover:text-white">
          Exit fullscreen
        </button>
      </motion.div>
    );
  }

  return (
    <motion.footer
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-4"
    >
      <div className="glass-strong rounded-2xl px-4 py-3 max-w-[1600px] mx-auto neon-glow">
        <div className="w-full h-1 bg-white/10 rounded-full mb-3 cursor-pointer group"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const ratio = (e.clientX - rect.left) / rect.width;
            usePlayerStore.getState().setProgress(ratio * (duration || track.duration || 0));
          }}
        >
          <div className="h-full bg-gradient-to-r from-ss-purple to-ss-blue rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-3 min-w-[200px] flex-1 cursor-pointer" onClick={() => playTrack(track)}>
            <img src={track.coverArt} alt="" className="w-14 h-14 rounded-lg object-cover" />
            <div className="min-w-0">
              <p className="font-semibold truncate text-sm">{track.title}</p>
              <p className="text-xs text-white/50 truncate">{artist}</p>
            </div>
          </div>

          <div className="flex flex-col items-center flex-1 gap-1">
            <div className="flex items-center gap-2">
              <button onClick={toggleShuffle} className={cn('p-2 rounded-full', shuffle && 'text-ss-purple')}>
                <Shuffle size={18} />
              </button>
              <button onClick={prevTrack} className="p-2 hover:bg-white/10 rounded-full"><SkipBack size={20} /></button>
              <button onClick={toggle} className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform">
                {isPlaying ? <Pause size={20} /> : <Play size={20} fill="black" className="ml-0.5" />}
              </button>
              <button onClick={nextTrack} className="p-2 hover:bg-white/10 rounded-full"><SkipForward size={20} /></button>
              <button onClick={cycleRepeat} className={cn('p-2 rounded-full', repeat !== 'off' && 'text-ss-purple')}>
                <Repeat size={18} />
              </button>
            </div>
            <span className="text-xs text-white/40">{formatTime(progress)} / {formatTime(duration || track.duration)}</span>
          </div>

          <WaveformVisualizer />

          <div className="flex items-center gap-2 min-w-[180px] justify-end">
            <button onClick={toggleLyrics} className="p-2 hover:bg-white/10 rounded-full hidden sm:block">
              <Mic2 size={18} />
            </button>
            <button onClick={toggleQueuePanel} className="p-2 hover:bg-white/10 rounded-full">
              <ListMusic size={18} />
            </button>
            <Volume2 size={18} className="text-white/50 hidden sm:block" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-20 accent-ss-purple hidden sm:block"
            />
            <button onClick={toggleFullscreen} className="p-2 hover:bg-white/10 rounded-full">
              <Maximize2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};
