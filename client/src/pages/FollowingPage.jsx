import { SectionHeader } from '../components/music/TrackCard';
import { Users } from 'lucide-react';

export default function FollowingPage() {
  return (
    <div>
      <SectionHeader title="Following Feed" subtitle="Activity from artists you follow" />
      <div className="glass rounded-2xl p-12 text-center text-white/50">
        <Users className="mx-auto mb-4 opacity-40" size={48} />
        <p>Follow artists to see their latest releases here.</p>
      </div>
    </div>
  );
}
