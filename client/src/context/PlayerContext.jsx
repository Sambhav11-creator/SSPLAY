import { createContext, useContext, useCallback } from 'react';
import { usePlayerStore } from '../store/playerStore';
import api from '../api/axios';

const PlayerContext = createContext(null);

export const PlayerProvider = ({ children }) => {
  const store = usePlayerStore();

  const playTrack = useCallback(
    async (track, queue = null) => {
      let enriched = track;
      if (track._id && !track.audioUrl) {
        try {
          const { data } = await api.get('/stream', {
            params: { songId: track._id },
          });
          enriched = { ...track, ...data.data };
        } catch {
          /* use track as-is */
        }
      } else if (track.source && track.externalIds) {
        const extKey = Object.keys(track.externalIds)[0];
        try {
          const { data } = await api.get('/stream', {
            params: { source: track.source, externalId: track.externalIds[extKey] },
          });
          enriched = { ...track, ...data.data };
        } catch {
          enriched = { ...track, audioUrl: track.previewUrl || track.audioUrl };
        }
      }
      store.setTrack(enriched, queue || [enriched]);
      if (track._id) api.post(`/songs/${track._id}/play`).catch(() => {});
    },
    [store]
  );

  return (
    <PlayerContext.Provider value={{ ...store, playTrack }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
