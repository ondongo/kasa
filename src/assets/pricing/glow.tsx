import { cn } from '@/lib/utils';

type GlowGradientProps = {
  className?: string;
};

export default function GlowGradient({ className }: GlowGradientProps) {
  return (
    <div
      className={cn(
        'w-[500px] h-[500px] bg-gradient-to-br from-primary-500/20 to-purple-500/20 blur-3xl rounded-full',
        className
      )}
    />
  );
}

