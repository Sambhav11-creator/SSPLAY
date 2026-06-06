import { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { usePlayerStore } from '../../store/playerStore';

export const WaveformVisualizer = ({ height = 48 }) => {
  const containerRef = useRef(null);
  const wsRef = useRef(null);
  const track = usePlayerStore((s) => s.currentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);

  useEffect(() => {
    if (!containerRef.current) return;
    wsRef.current = WaveSurfer.create({
      container: containerRef.current,
      height,
      waveColor: 'rgba(168, 85, 247, 0.4)',
      progressColor: '#a855f7',
      cursorColor: '#60a5fa',
      barWidth: 2,
      barGap: 1,
      normalize: true,
      interact: false,
    });
    return () => wsRef.current?.destroy();
  }, [height]);

  useEffect(() => {
    const url = track?.url || track?.audioUrl;
    if (url && wsRef.current) {
      wsRef.current.load(url).catch(() => {});
    }
  }, [track]);

  useEffect(() => {
    if (!wsRef.current) return;
    isPlaying ? wsRef.current.play() : wsRef.current.pause();
  }, [isPlaying]);

  return <div ref={containerRef} className="w-full max-w-xs hidden md:block" />;
};
