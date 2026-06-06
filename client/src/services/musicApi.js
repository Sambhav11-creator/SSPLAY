import api from '../api/axios';

export const musicApi = {
  getSongs: (params) => api.get('/songs', { params }),
  getSong: (id) => api.get(`/songs/${id}`),
  search: (q, params) => api.get('/search', { params: { q, ...params } }),
  getTrending: () => api.get('/trending'),
  getRecommendations: () => api.get('/recommendations/for-you'),
  getDiscoverWeekly: () => api.get('/recommendations/discover-weekly'),
  getArtists: () => api.get('/artists'),
  getArtist: (id) => api.get(`/artists/${id}`),
  getAlbums: () => api.get('/albums'),
  getAlbum: (id) => api.get(`/albums/${id}`),
  getPlaylists: (mine) => api.get('/playlists', { params: mine ? { mine: true } : {} }),
  getPlaylist: (id) => api.get(`/playlists/${id}`),
  getLiked: () => api.get('/users/me/liked'),
  getHistory: () => api.get('/history'),
  getLyrics: (id) => api.get(`/songs/${id}/lyrics`),
  getStream: (params) => api.get('/stream', { params }),
  getNotifications: () => api.get('/notifications'),
  getPodcasts: () => api.get('/podcasts'),
  adminDashboard: () => api.get('/admin/dashboard'),
};
