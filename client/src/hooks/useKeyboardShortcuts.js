import { useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';

export const useKeyboardShortcuts = () => {
  const player = usePlayer();

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          player?.toggle?.();
          break;
        case 'ArrowRight':
          player?.nextTrack?.();
          break;
        case 'ArrowLeft':
          player?.prevTrack?.();
          break;
        case 'KeyL':
          player?.toggleLyrics?.();
          break;
        case 'KeyF':
          player?.toggleFullscreen?.();
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [player]);
};
