import { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMe, logout as logoutAction } from '../store/authSlice';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((s) => s.auth);

  useEffect(() => {
    if (localStorage.getItem('ssplay_token')) dispatch(fetchMe());
  }, [dispatch]);

  const logout = () => dispatch(logoutAction());

  return (
    <AuthContext.Provider value={{ user, loading, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
