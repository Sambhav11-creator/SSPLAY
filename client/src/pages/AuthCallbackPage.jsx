import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/authSlice';
import api from '../api/axios';

export default function AuthCallbackPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = params.get('token');
    if (token) {
      localStorage.setItem('ssplay_token', token);
      api.get('/auth/me').then((res) => {
        dispatch(setUser(res.data.data));
        navigate('/home');
      }).catch(() => navigate('/login'));
    } else navigate('/login');
  }, [params, navigate, dispatch]);

  return <p className="text-center text-white/50">Completing sign in...</p>;
}
