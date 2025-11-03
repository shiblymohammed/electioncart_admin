interface ProgressBarProps {
  progress: number; // 0-100
  label?: string;
  showPercentage?: boolean;
  variant?: 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const ProgressBar = ({ 
  progress, 
  label, 
  showPercentage = true,
  variant = 'primary',
  size = 'md'
}: ProgressBarProps) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));
  
  const variantClasses = {
    primary: 'bg-primary',
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-danger'
  };
  
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };
  
  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-2">
          {label && <span className="text-sm text-text">{label}</span>}
          {showPercentage && (
            <span className="text-sm text-text-muted font-medium">
              {Math.round(clampedProgress)}%
            </span>
          )}
        </div>
      )}
      
      <div className={`w-full bg-dark-hover rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`${variantClasses[variant]} ${sizeClasses[size]} rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${clampedProgress}%` }}
        >
          {size === 'lg' && (
            <div className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse-status" />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
