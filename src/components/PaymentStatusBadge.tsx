import { PaymentStatus } from '../types/manualOrder';

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const PaymentStatusBadge = ({ status, showLabel = true, size = 'md' }: PaymentStatusBadgeProps) => {
  const statuses: { 
    value: PaymentStatus; 
    label: string; 
    shortLabel: string;
    bgColor: string;
    textColor: string;
    borderColor: string;
    icon: string;
  }[] = [
    { 
      value: 'unpaid', 
      label: 'Unpaid', 
      shortLabel: 'Unpaid',
      bgColor: 'bg-danger-surface',
      textColor: 'text-danger',
      borderColor: 'border-danger-border',
      icon: '💳'
    },
    { 
      value: 'partial', 
      label: 'Partially Paid', 
      shortLabel: 'Partial',
      bgColor: 'bg-warning-surface',
      textColor: 'text-warning',
      borderColor: 'border-warning-border',
      icon: '⏳'
    },
    { 
      value: 'paid', 
      label: 'Fully Paid', 
      shortLabel: 'Paid',
      bgColor: 'bg-success-surface',
      textColor: 'text-success',
      borderColor: 'border-success-border',
      icon: '✅'
    },
    { 
      value: 'refunded', 
      label: 'Refunded', 
      shortLabel: 'Refunded',
      bgColor: 'bg-secondary/10',
      textColor: 'text-secondary',
      borderColor: 'border-secondary/40',
      icon: '↩️'
    },
    { 
      value: 'cod', 
      label: 'Cash on Delivery', 
      shortLabel: 'COD',
      bgColor: 'bg-info-surface',
      textColor: 'text-info',
      borderColor: 'border-info-border',
      icon: '💵'
    },
  ];

  const currentStatus = statuses.find(s => s.value === status) || statuses[0];

  const sizeClasses = {
    sm: 'px-2 py-1 text-mobile-xs gap-1',
    md: 'px-3 py-1.5 text-mobile-sm gap-1.5',
    lg: 'px-4 py-2 text-mobile-base gap-2',
  };

  const iconSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <div className={`
      inline-flex items-center
      ${sizeClasses[size]}
      ${currentStatus.bgColor}
      ${currentStatus.textColor}
      ${currentStatus.borderColor}
      border-2
      rounded-pill
      font-semibold
      transition-all duration-300
      animate-fade-in
    `}>
      <span className={iconSizes[size]}>
        {currentStatus.icon}
      </span>
      {showLabel && (
        <span className="hidden sm:inline">
          {currentStatus.label}
        </span>
      )}
      {showLabel && (
        <span className="sm:hidden">
          {currentStatus.shortLabel}
        </span>
      )}
    </div>
  );
};

export default PaymentStatusBadge;
