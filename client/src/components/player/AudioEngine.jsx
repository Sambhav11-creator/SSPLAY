import { useEffect, useRef } from 'react';
import { Howl } from 'howler';
import Hls from 'hls.js';
import { usePlayerStore } from '../../store/playerStore';

export const AudioEngine = () => {
  const howlRef = useRef(null);
  const hlsRef = useRef(null);
  const audioRef = useRef(null);

  const track = usePlayerStore((s) => s.currentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const volume = usePlayerStore((s) => s.volume);
  const muted = usePlayerStore((s) => s.muted);
  const playbackSpeed = usePlayerStore((s) => s.playbackSpeed);
  const setProgress = usePlayerStore((s) => s.setProgress);
  const nextTrack = usePlayerStore((s) => s.nextTrack);

  useEffect(() => {
    if (howlRef.current) {
      howlRef.current.unload();
      howlRef.current = null;
    }
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const url = track?.url || track?.audioUrl || track?.previewUrl;
    if (!url) return;

    const onEnd = () => nextTrack();
    const tick = () => {
      if (howlRef.current?.playing()) {
        setProgress(howlRef.current.seek(), howlRef.current.duration());
      }
    };

    if (track?.type === 'hls' || url.includes('.m3u8') || url.includes('.mp4') || url.includes('saavncdn')) {
      const audio = new Audio();
      audioRef.current = audio;
      if (url.includes('.m3u8')) {
        if (Hls.isSupported()) {
          const hls = new Hls();
          hlsRef.current = hls;
          hls.loadSource(url);
          hls.attachMedia(audio);
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            if (isPlaying) audio.play();
          });
        } else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
          audio.src = url;
        }
      } else {
        audio.src = url;
      }
      audio.volume = muted ? 0 : volume;
      audio.playbackRate = playbackSpeed;
      audio.onended = onEnd;
      audio.ontimeupdate = () => setProgress(audio.currentTime, audio.duration);
      if (isPlaying) audio.play().catch(() => {});
      return () => audio.pause();
    }

    howlRef.current = new Howl({
      src: [url],
      html5: true,
      volume: muted ? 0 : volume,
      rate: playbackSpeed,
      onend: onEnd,
      onplay: () => {
        const id = setInterval(tick, 500);
        howlRef.current._tickId = id;
      },
      onstop: () => clearInterval(howlRef.current?._tickId),
    });

    if (isPlaying) howlRef.current.play();

    return () => {
      howlRef.current?.unload();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track?._id, track?.id, track?.url, track?.audioUrl]);

  useEffect(() => {
    const vol = muted ? 0 : volume;
    if (howlRef.current) howlRef.current.volume(vol);
    if (audioRef.current) audioRef.current.volume = vol;
  }, [volume, muted]);

  useEffect(() => {
    if (howlRef.current) {
      isPlaying ? howlRef.current.play() : howlRef.current.pause();
    }
    if (audioRef.current) {
      isPlaying ? audioRef.current.play().catch(() => {}) : audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (howlRef.current) howlRef.current.rate(playbackSpeed);
    if (audioRef.current) audioRef.current.playbackRate = playbackSpeed;
  }, [playbackSpeed]);

  return null;
};
