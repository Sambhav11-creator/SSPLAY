import { cn } from '../../utils/cn';

export const Skeleton = ({ className }) => (
  <div className={cn('animate-pulse rounded-lg bg-white/5', className)} />
);

export const CardSkeleton = () => (
  <div className="space-y-3">
    <Skeleton className="aspect-square w-full" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-3 w-1/2" />
  </div>
);
