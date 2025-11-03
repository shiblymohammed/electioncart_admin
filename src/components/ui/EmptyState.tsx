import { ReactNode } from 'react';
import Button from './Button';

interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  illustration?: ReactNode;
  className?: string;
}

const EmptyState = ({
  title,
  message,
  actionLabel,
  onAction,
  illustration,
  className = '',
}: EmptyStateProps) => {
  // Default illustration (empty box icon)
  const defaultIllustration = (
    <svg
      className="mx-auto h-24 w-24 text-text-muted opacity-50"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
      />
    </svg>
  );

  return (
    <div className={`text-center py-12 px-4 animate-fade-in-up ${className}`}>
      {/* Illustration */}
      <div className="mb-6">{illustration || defaultIllustration}</div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-text mb-2">{title}</h3>

      {/* Message */}
      <p className="text-text-muted mb-6 max-w-md mx-auto">{message}</p>

      {/* Action button */}
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
