import { useState } from 'react';
import { usePlayerStore } from '../store/playerStore';
import { SectionHeader } from '../components/music/TrackCard';

export default function SettingsPage() {
  const playbackSpeed = usePlayerStore((s) => s.playbackSpeed);
  const setPlaybackSpeed = usePlayerStore((s) => s.setPlaybackSpeed);
  const [crossfade, setCrossfade] = useState(0);

  return (
    <div className="max-w-xl space-y-6">
      <SectionHeader title="Settings" />
      <div className="glass rounded-2xl p-6 space-y-4">
        <div>
          <label className="text-sm text-white/60">Playback speed</label>
          <select
            value={playbackSpeed}
            onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
            className="w-full mt-2 bg-white/5 border border-white/10 rounded-lg px-4 py-2"
          >
            {[0.5, 0.75, 1, 1.25, 1.5, 2].map((s) => (
              <option key={s} value={s}>{s}x</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-white/60">Crossfade (seconds)</label>
          <input type="range" min="0" max="12" value={crossfade} onChange={(e) => setCrossfade(Number(e.target.value))} className="w-full mt-2 accent-ss-purple" />
          <span className="text-sm">{crossfade}s</span>
        </div>
      </div>
    </div>
  );
}
