import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerUser } from '../store/authSlice';
import { Button } from '../components/ui/Button';
import { OAuthButtons } from '../components/auth/OAuthButtons';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const result = await dispatch(registerUser(form));
    if (registerUser.fulfilled.match(result)) navigate('/home');
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <h2 className="text-xl font-bold text-center mb-6">Create account</h2>
      {['name', 'email', 'password'].map((f) => (
        <input
          key={f}
          type={f === 'password' ? 'password' : f === 'email' ? 'email' : 'text'}
          placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
          value={form[f]}
          onChange={(e) => setForm({ ...form, [f]: e.target.value })}
          required
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:ring-2 focus:ring-ss-purple/50"
        />
      ))}
      <Button type="submit" className="w-full">Create account</Button>
      <p className="text-center text-sm text-white/50">
        Have an account? <Link to="/login" className="text-ss-purple-glow">Sign in</Link>
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
