import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { getOAuthUrl } from '../../utils/authUrl';

export const OAuthButtons = () => {
  const [providers, setProviders] = useState({ google: false, github: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/auth/providers')
      .then((res) => setProviders(res.data.data || {}))
      .catch(() => setProviders({ google: false, github: false }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (!providers.google && !providers.github) {
    return (
      <p className="text-center text-xs text-white/40 pt-4">
        Add Google or GitHub credentials in server/.env to enable OAuth.
      </p>
    );
  }

  return (
    <div className="flex gap-2 pt-4">
      {providers.google && (
        <a
          href={getOAuthUrl('google')}
          className="flex-1 text-center py-2.5 rounded-xl glass text-sm font-medium hover:border-ss-purple/40 transition-colors"
        >
          Continue with Google
        </a>
      )}
      {providers.github && (
        <a
          href={getOAuthUrl('github')}
          className="flex-1 text-center py-2.5 rounded-xl glass text-sm font-medium hover:border-ss-blue/40 transition-colors"
        >
          Continue with GitHub
        </a>
      )}
    </div>
  );
};
