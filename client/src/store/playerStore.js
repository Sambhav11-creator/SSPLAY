import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialState = {
  currentTrack: null,
  queue: [],
  queueIndex: 0,
  isPlaying: false,
  volume: 0.85,
  muted: false,
  shuffle: false,
  repeat: 'off',
  progress: 0,
  duration: 0,
  playbackSpeed: 1,
  crossfade: 0,
  showLyrics: false,
  fullscreen: false,
  miniPlayer: true,
  showQueue: false,
};

export const usePlayerStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      setTrack: (track, queue = null) => {
        const q = queue || [track];
        const idx = q.findIndex((t) => (t._id || t.id) === (track._id || track.id));
        set({
          currentTrack: track,
          queue: q,
          queueIndex: idx >= 0 ? idx : 0,
          isPlaying: true,
          progress: 0,
        });
      },

      play: () => set({ isPlaying: true }),
      pause: () => set({ isPlaying: false }),
      toggle: () => set({ isPlaying: !get().isPlaying }),

      setProgress: (progress, duration) => set({ progress, ...(duration != null && { duration }) }),

      setVolume: (volume) => set({ volume, muted: volume === 0 }),

      toggleShuffle: () => set({ shuffle: !get().shuffle }),

      cycleRepeat: () => {
        const order = ['off', 'all', 'one'];
        const next = order[(order.indexOf(get().repeat) + 1) % order.length];
        set({ repeat: next });
      },

      nextTrack: () => {
        const { queue, queueIndex, shuffle, repeat } = get();
        if (!queue.length) return;
        let next = queueIndex + 1;
        if (shuffle) next = Math.floor(Math.random() * queue.length);
        if (next >= queue.length) {
          if (repeat === 'all') next = 0;
          else if (repeat === 'one') next = queueIndex;
          else return set({ isPlaying: false });
        }
        set({ queueIndex: next, currentTrack: queue[next], progress: 0, isPlaying: true });
      },

      prevTrack: () => {
        const { queue, queueIndex, progress } = get();
        if (progress > 3) return set({ progress: 0 });
        const prev = queueIndex > 0 ? queueIndex - 1 : queue.length - 1;
        set({ queueIndex: prev, currentTrack: queue[prev], progress: 0 });
      },

      addToQueue: (track) => set({ queue: [...get().queue, track] }),

      setQueue: (queue, index = 0) =>
        set({ queue, queueIndex: index, currentTrack: queue[index] || null }),

      toggleLyrics: () => set({ showLyrics: !get().showLyrics }),
      toggleFullscreen: () => set({ fullscreen: !get().fullscreen }),
      toggleQueuePanel: () => set({ showQueue: !get().showQueue }),
      setPlaybackSpeed: (playbackSpeed) => set({ playbackSpeed }),
    }),
    { name: 'ssplay-player', partialize: (s) => ({ volume: s.volume, shuffle: s.shuffle, repeat: s.repeat }) }
  )
);
