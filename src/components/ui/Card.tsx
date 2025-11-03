import { ReactNode, HTMLAttributes } from 'react';
import { CardPadding } from '../../types/ui.types';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hoverable?: boolean;
  glowOnHover?: boolean;
  padding?: CardPadding;
}

const Card = ({
  children,
  hoverable = false,
  glowOnHover = false,
  padding = 'md',
  className = '',
  ...props
}: CardProps) => {
  // Base glassmorphic styles
  const baseStyles = 'bg-dark-surface/80 backdrop-blur-lg border border-dark-border/50 rounded-card shadow-card transition-all duration-300';

  // Hover styles
  const hoverStyles = hoverable
    ? 'hover:shadow-card-hover hover:border-primary/30 cursor-pointer'
    : '';

  // Glow on hover
  const glowStyles = glowOnHover ? 'hover:shadow-glow-primary' : '';

  // Padding styles
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={`${baseStyles} ${hoverStyles} ${glowStyles} ${paddingStyles[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
