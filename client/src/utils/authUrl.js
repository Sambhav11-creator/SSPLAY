/** Build OAuth start URL (works with Vite proxy or absolute VITE_API_URL). */
export const getOAuthUrl = (provider) => {
  const api = import.meta.env.VITE_API_URL || '/api';
  const base = api.startsWith('http') ? api.replace(/\/$/, '') : `${window.location.origin}${api}`;
  return `${base}/auth/${provider}`;
};
