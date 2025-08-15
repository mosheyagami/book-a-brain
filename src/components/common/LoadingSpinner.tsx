import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  message?: string;
}

export const LoadingSpinner = ({ 
  size = 'md', 
  className,
  message 
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div 
        className={cn(
          'animate-spin rounded-full border-2 border-border border-t-primary',
          sizeClasses[size],
          className
        )}
        role="status"
        aria-label="Loading"
      />
      {message && (
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
      )}
    </div>
  );
};