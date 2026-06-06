import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { AdminLayout } from '../layouts/AdminLayout';

const LandingPage = lazy(() => import('../pages/LandingPage'));
const HomePage = lazy(() => import('../pages/HomePage'));
const DiscoverPage = lazy(() => import('../pages/DiscoverPage'));
const TrendingPage = lazy(() => import('../pages/TrendingPage'));
const SearchPage = lazy(() => import('../pages/SearchPage'));
const LibraryPage = lazy(() => import('../pages/LibraryPage'));
const PlaylistPage = lazy(() => import('../pages/PlaylistPage'));
const AlbumPage = lazy(() => import('../pages/AlbumPage'));
const ArtistPage = lazy(() => import('../pages/ArtistPage'));
const GenrePage = lazy(() => import('../pages/GenrePage'));
const LikedPage = lazy(() => import('../pages/LikedPage'));
const RecentPage = lazy(() => import('../pages/RecentPage'));
const QueuePage = lazy(() => import('../pages/QueuePage'));
const VideosPage = lazy(() => import('../pages/VideosPage'));
const PodcastsPage = lazy(() => import('../pages/PodcastsPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const SettingsPage = lazy(() => import('../pages/SettingsPage'));
const NotificationsPage = lazy(() => import('../pages/NotificationsPage'));
const PremiumPage = lazy(() => import('../pages/PremiumPage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));
const AuthCallbackPage = lazy(() => import('../pages/AuthCallbackPage'));
const UploadPage = lazy(() => import('../pages/UploadPage'));
const FollowingPage = lazy(() => import('../pages/FollowingPage'));
const LiveActivityPage = lazy(() => import('../pages/LiveActivityPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const AdminUsers = lazy(() => import('../pages/admin/AdminUsers'));
const AdminSongs = lazy(() => import('../pages/admin/AdminSongs'));
const AdminAnalytics = lazy(() => import('../pages/admin/AdminAnalytics'));
const AdminApiMonitor = lazy(() => import('../pages/admin/AdminApiMonitor'));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[40vh]">
    <div className="w-10 h-10 border-2 border-ss-purple border-t-transparent rounded-full animate-spin" />
  </div>
);

export const AppRoutes = () => (
  <Suspense fallback={<PageLoader />}>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
      </Route>
      <Route element={<MainLayout />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/trending" element={<TrendingPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/playlist/:id" element={<PlaylistPage />} />
        <Route path="/album/:id" element={<AlbumPage />} />
        <Route path="/artist/:id" element={<ArtistPage />} />
        <Route path="/genre/:genre" element={<GenrePage />} />
        <Route path="/liked" element={<LikedPage />} />
        <Route path="/recent" element={<RecentPage />} />
        <Route path="/queue" element={<QueuePage />} />
        <Route path="/videos" element={<VideosPage />} />
        <Route path="/podcasts" element={<PodcastsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/premium" element={<PremiumPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/following" element={<FollowingPage />} />
        <Route path="/live" element={<LiveActivityPage />} />
      </Route>
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/songs" element={<AdminSongs />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/admin/api" element={<AdminApiMonitor />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Suspense>
);
