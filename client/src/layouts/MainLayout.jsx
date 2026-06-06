import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { TopBar } from '../components/layout/TopBar';
import { MusicPlayer } from '../components/player/MusicPlayer';
import { VideoBackground } from '../components/player/VideoBackground';
import { AudioEngine } from '../components/player/AudioEngine';
import { LyricsPanel } from '../components/player/LyricsPanel';
import { QueuePanel } from '../components/player/QueuePanel';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

export const MainLayout = () => {
  useKeyboardShortcuts();
  return (
    <div className="relative min-h-screen bg-ss-black">
      <VideoBackground />
      <AudioEngine />
      <div className="relative z-10 flex">
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-screen player-safe">
          <TopBar />
          <main className="flex-1 px-6 pb-6">
            <Outlet />
          </main>
        </div>
      </div>
      <MusicPlayer />
      <LyricsPanel />
      <QueuePanel />
    </div>
  );
};
