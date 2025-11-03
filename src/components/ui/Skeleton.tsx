interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string;
  height?: string;
  animation?: 'pulse' | 'wave' | 'none';
}

const Skeleton = ({ 
  className = '', 
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse'
}: SkeletonProps) => {
  const baseClasses = 'bg-dark-hover';
  
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg'
  };
  
  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-pulse-status',
    none: ''
  };
  
  const style = {
    width: width || '100%',
    height: height || (variant === 'text' ? '1rem' : '100%')
  };
  
  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
    />
  );
};

export default Skeleton;
