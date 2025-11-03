import { useEffect, useState, ReactNode } from 'react';
import { countUp } from '../../utils/animations';
import { ColorVariant, StatTrend } from '../../types/ui.types';
import Card from './Card';

interface StatCardProps {
  label: string;
  value: number;
  icon: ReactNode;
  trend?: StatTrend;
  color?: ColorVariant;
  onClick?: () => void;
  className?: string;
}

const StatCard = ({
  label,
  value,
  icon,
  trend,
  color = 'primary',
  onClick,
  className = '',
}: StatCardProps) => {
  const [displayValue, setDisplayValue] = useState(0);

  // Count up animation on mount or value change
  useEffect(() => {
    const cleanup = countUp(0, value, 1000, setDisplayValue);
    return cleanup;
  }, [value]);

  // Color classes
  const colorClasses = {
    primary: 'text-primary bg-primary/10',
    secondary: 'text-secondary bg-secondary/10',
    success: 'text-success bg-success-surface',
    warning: 'text-warning bg-warning-surface',
    danger: 'text-danger bg-danger-surface',
    info: 'text-info bg-info-surface',
  };

  const glowClasses = {
    primary: 'shadow-glow-primary',
    secondary: 'shadow-glow-primary',
    success: 'shadow-glow-primary',
    warning: 'shadow-glow-primary',
    danger: 'shadow-glow-primary',
    info: 'shadow-glow-primary',
  };

  return (
    <Card
      hoverable={!!onClick}
      className={`cursor-${onClick ? 'pointer' : 'default'} transition-transform hover:scale-105 ${className}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-text-muted mb-2">{label}</p>
          <p className="text-3xl font-bold text-text mb-2">{displayValue.toLocaleString()}</p>
          
          {trend && (
            <div className="flex items-center gap-1">
              {trend.isPositive ? (
                <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              )}
              <span className={`text-sm font-medium ${trend.isPositive ? 'text-success' : 'text-danger'}`}>
                {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-text-muted">vs last week</span>
            </div>
          )}
        </div>

        {/* Icon */}
        <div className={`p-3 rounded-lg ${colorClasses[color]} ${glowClasses[color]}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
