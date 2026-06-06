import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/authSlice';
import { Button } from '../components/ui/Button';
import { OAuthButtons } from '../components/auth/OAuthButtons';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loading, error } = useSelector((s) => s.auth);
  const oauthError = searchParams.get('error') === 'oauth_failed';

  const submit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) navigate('/home');
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <h2 className="text-xl font-bold text-center mb-6">Welcome back</h2>
      {(error || oauthError) && (
        <p className="text-red-400 text-sm text-center">
          {oauthError ? 'OAuth sign-in failed. Try again or use email.' : error}
        </p>
      )}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-ss-purple/50 outline-none"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-ss-purple/50 outline-none"
      />
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Signing in...' : 'Sign in'}
      </Button>
      <p className="text-center text-sm text-white/50">
        No account? <Link to="/register" className="text-ss-purple-glow">Register</Link>
      </p>
      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center text-xs text-white/40">
          <span className="px-2 bg-transparent">or</span>
        </div>
      </div>
      <OAuthButtons />
    </form>
  );
}
