import { ButtonHTMLAttributes, ReactNode } from 'react';
import { ButtonVariant, ButtonSize } from '../../types/ui.types';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const Button = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) => {
  // Base styles - Requirement 8.2: Touch-friendly UI with minimum tap target size
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-btn transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation active:scale-95';

  // Variant styles
  const variantStyles = {
    primary: 'bg-primary text-primary-content hover:bg-primary-hover focus:ring-primary shadow-glow-primary hover:shadow-glow-primary',
    secondary: 'bg-secondary text-secondary-content hover:bg-secondary-hover focus:ring-secondary',
    accent: 'bg-accent text-accent-content hover:bg-accent-hover focus:ring-accent shadow-glow-accent hover:shadow-glow-accent',
    danger: 'bg-danger text-danger-content hover:bg-red-600 focus:ring-danger',
    ghost: 'bg-transparent border border-dark-border text-text hover:bg-dark-hover focus:ring-primary',
  };

  // Size styles - Requirement 8.2: Ensure minimum 44x44px touch targets
  const sizeStyles = {
    sm: 'px-3 py-2 text-sm gap-1.5 min-h-[36px]', // Slightly smaller but still touch-friendly
    md: 'px-4 py-2.5 text-base gap-2 min-h-[44px]', // Standard touch target
    lg: 'px-6 py-3 text-lg gap-2.5 min-h-[48px]', // Larger touch target
  };

  // Width styles
  const widthStyles = fullWidth ? 'w-full' : '';

  // Loading spinner
  const spinner = (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? spinner : leftIcon}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
};

export default Button;
