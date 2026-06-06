import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-ss-black text-center px-4">
      <h1 className="text-8xl font-black gradient-text">404</h1>
      <p className="text-white/60 mt-4 mb-8">This track got lost in the void.</p>
      <Link to="/"><Button>Back to SSPLAY</Button></Link>
    </div>
  );
}
