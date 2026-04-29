import { type InputHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-text-muted">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            'h-10 w-full rounded-lg border bg-surface px-3 text-sm text-text placeholder:text-text-muted transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'read-only:bg-surface-alt read-only:cursor-default',
            error ? 'border-red-500' : 'border-border',
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';
export default Input;
