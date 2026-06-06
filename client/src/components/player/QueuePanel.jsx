import { motion, AnimatePresence } from 'framer-motion';
import { usePlayerStore } from '../../store/playerStore';
import { TrackCard } from '../music/TrackCard';

export const QueuePanel = () => {
  const show = usePlayerStore((s) => s.showQueue);
  const toggle = usePlayerStore((s) => s.toggleQueuePanel);
  const queue = usePlayerStore((s) => s.queue);
  const queueIndex = usePlayerStore((s) => s.queueIndex);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          className="fixed bottom-28 right-4 w-80 max-h-96 z-50 glass-strong rounded-2xl p-4 overflow-hidden flex flex-col"
        >
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-semibold">Queue</h4>
            <button onClick={toggle} className="text-sm text-white/50 hover:text-white">Close</button>
          </div>
          <div className="overflow-y-auto flex-1 scrollbar-hide">
            {queue.map((t, i) => (
              <div key={i} className={i === queueIndex ? 'opacity-100' : 'opacity-60'}>
                <TrackCard track={t} layout="row" index={i} />
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
