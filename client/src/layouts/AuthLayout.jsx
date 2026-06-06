import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const AuthLayout = () => (
  <div className="min-h-screen flex items-center justify-center bg-ss-black relative overflow-hidden">
    <div className="absolute inset-0 gradient-bg animate-pulse-glow" />
    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-ss-purple/20 rounded-full blur-[120px]" />
    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-ss-blue/20 rounded-full blur-[120px]" />
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative z-10 w-full max-w-md glass-strong rounded-3xl p-8 m-4"
    >
      <Link to="/" className="block text-center text-3xl font-black gradient-text mb-8">
        SSPLAY
      </Link>
      <Outlet />
    </motion.div>
  </div>
);
