import { clsx } from 'clsx';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
}

export default function Badge({ variant = 'default', className, children }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        {
          'bg-surface-alt text-text-muted': variant === 'default',
          'bg-green-900/50 text-green-300': variant === 'success',
          'bg-yellow-900/50 text-yellow-300': variant === 'warning',
          'bg-red-900/50 text-red-300': variant === 'danger',
          'bg-blue-900/50 text-blue-300': variant === 'info',
        },
        className,
      )}
    >
      {children}
    </span>
  );
}
