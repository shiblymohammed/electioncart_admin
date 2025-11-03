import { ReactNode } from 'react';
import { BadgeVariant, BadgeSize } from '../../types/ui.types';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  pulse?: boolean;
  size?: BadgeSize;
  className?: string;
}

const Badge = ({
  children,
  variant = 'default',
  pulse = false,
  size = 'md',
  className = '',
}: BadgeProps) => {
  // Base styles
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-pill transition-all duration-300';

  // Variant styles
  const variantStyles = {
    success: 'bg-success-surface text-success border border-success-border',
    warning: 'bg-warning-surface text-warning border border-warning-border',
    danger: 'bg-danger-surface text-danger border border-danger-border',
    info: 'bg-info-surface text-info border border-info-border',
    default: 'bg-dark-hover text-text-muted border border-dark-border',
  };

  // Size styles
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  // Pulse animation
  const pulseStyles = pulse ? 'animate-pulse-status' : '';

  return (
    <span
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${pulseStyles} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
