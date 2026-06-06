import { SectionHeader } from '../components/music/TrackCard';
import { TrackCard } from '../components/music/TrackCard';
import { usePlayerStore } from '../store/playerStore';

export default function QueuePage() {
  const queue = usePlayerStore((s) => s.queue);
  const queueIndex = usePlayerStore((s) => s.queueIndex);

  return (
    <div>
      <SectionHeader title="Queue" subtitle="Up next" />
      {queue.length === 0 ? (
        <p className="text-white/50">Queue is empty. Play something to get started.</p>
      ) : (
        queue.map((t, i) => (
          <div key={i} className={i === queueIndex ? 'ring-1 ring-ss-purple rounded-xl' : ''}>
            <TrackCard track={t} layout="row" index={i} />
          </div>
        ))
      )}
    </div>
  );
}
