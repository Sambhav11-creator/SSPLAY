import { cn } from '../../utils/cn';

export const Button = ({ children, variant = 'primary', className, ...props }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-ss-purple to-ss-blue hover:opacity-90 text-white neon-glow',
    ghost: 'bg-transparent hover:bg-white/10 text-white border border-white/10',
    glass: 'glass hover:border-ss-purple/40 text-white',
  };
  return (
    <button
      className={cn(
        'px-5 py-2.5 rounded-full font-medium transition-all duration-300 disabled:opacity-50',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
