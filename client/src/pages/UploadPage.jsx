import { useState } from 'react';
import api from '../api/axios';
import { SectionHeader } from '../components/music/TrackCard';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function UploadPage() {
  const { user } = useAuth();
  const [form, setForm] = useState({ title: '', artistName: '', duration: '', genre: '' });
  const [files, setFiles] = useState({ audio: null, cover: null });
  const [status, setStatus] = useState('');

  if (!user) return <p className="text-white/50"><Link to="/login">Log in</Link> to upload music.</p>;

  const submit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (files.audio) fd.append('audio', files.audio);
    if (files.cover) fd.append('cover', files.cover);
    try {
      await api.post('/upload/song', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setStatus('Upload submitted for review!');
    } catch (err) {
      setStatus(err.response?.data?.message || 'Upload failed');
    }
  };

  return (
    <div className="max-w-lg">
      <SectionHeader title="Upload Music" />
      <form onSubmit={submit} className="glass rounded-2xl p-6 space-y-4">
        <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10" />
        <input placeholder="Artist name" value={form.artistName} onChange={(e) => setForm({ ...form, artistName: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10" />
        <input placeholder="Duration (seconds)" type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} required className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10" />
        <input placeholder="Genre" value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10" />
        <input type="file" accept="audio/*" onChange={(e) => setFiles({ ...files, audio: e.target.files[0] })} />
        <input type="file" accept="image/*" onChange={(e) => setFiles({ ...files, cover: e.target.files[0] })} />
        <Button type="submit" className="w-full">Upload</Button>
        {status && <p className="text-sm text-ss-purple-glow">{status}</p>}
      </form>
    </div>
  );
}
