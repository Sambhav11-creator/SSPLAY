import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-ss-black overflow-hidden">
      <nav className="flex items-center justify-between px-8 py-6 relative z-10">
        <span className="text-2xl font-black gradient-text">SSPLAY</span>
        <div className="flex gap-4">
          <Link to="/login" className="text-white/70 hover:text-white">Log in</Link>
          <Link to="/register"><Button>Get Started</Button></Link>
        </div>
      </nav>

      <section className="relative px-8 pt-20 pb-32 text-center max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 text-sm text-ss-purple-glow">
            <Sparkles size={16} /> Cinematic music streaming
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
            <span className="gradient-text">Feel every beat</span>
            <br />
            in cinematic glory
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto mb-10">
            SSPLAY delivers premium dark-luxury streaming with AI discovery, unified search across
            global catalogs, and an immersive player built for billions of plays.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/home"><Button className="flex items-center gap-2"><Play size={18} /> Start Listening</Button></Link>
            <Link to="/premium"><Button variant="ghost">Go Premium</Button></Link>
          </div>
        </motion.div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-ss-purple/10 rounded-full blur-[100px] pointer-events-none" />
      </section>

      <section className="grid md:grid-cols-3 gap-6 px-8 max-w-6xl mx-auto pb-24">
        {[
          { title: 'Unified Search', desc: 'Spotify, Deezer, Audius, Jamendo & more in one engine.' },
          { title: 'Cinematic Player', desc: 'Video backgrounds, waveforms, lyrics & crossfade.' },
          { title: 'AI Discovery', desc: 'Personalized recommendations that evolve with you.' },
        ].map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-2xl p-6 hover:border-ss-purple/40 transition-colors"
          >
            <h3 className="text-xl font-bold mb-2 gradient-text">{f.title}</h3>
            <p className="text-white/60 text-sm">{f.desc}</p>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
