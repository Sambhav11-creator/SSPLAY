import { Check } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { SectionHeader } from '../components/music/TrackCard';

const plans = [
  { name: 'Free', price: '$0', features: ['Ads-supported streaming', 'Standard quality', 'Mobile app'] },
  { name: 'Premium', price: '$9.99/mo', features: ['Lossless audio', 'Offline downloads', 'No ads', 'Video backgrounds', 'AI Discovery+'], highlight: true },
  { name: 'Family', price: '$14.99/mo', features: ['Up to 6 accounts', 'All Premium features', 'Family mix'] },
];

export default function PremiumPage() {
  return (
    <div>
      <SectionHeader title="SSPLAY Premium" subtitle="Elevate your listening" />
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((p) => (
          <div key={p.name} className={`glass rounded-3xl p-8 ${p.highlight ? 'neon-glow border-ss-purple/50' : ''}`}>
            <h3 className="text-xl font-bold gradient-text">{p.name}</h3>
            <p className="text-3xl font-black my-4">{p.price}</p>
            <ul className="space-y-2 mb-6">
              {p.features.map((f) => (
                <li key={f} className="flex gap-2 text-sm text-white/70"><Check size={16} className="text-ss-purple" />{f}</li>
              ))}
            </ul>
            <Button variant={p.highlight ? 'primary' : 'ghost'} className="w-full">Choose {p.name}</Button>
          </div>
        ))}
      </div>
    </div>
  );
}
