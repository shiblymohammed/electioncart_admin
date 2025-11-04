import { useState } from 'react';
import { updatePaymentStatus } from '../services/manualOrderService';
import { PaymentStatus } from '../types/manualOrder';
import { useToast } from '../hooks/useToast';

interface PaymentStatusDropdownProps {
  orderId: number;
  currentStatus: PaymentStatus;
  onStatusChange: () => void;
}

const PaymentStatusDropdown = ({ orderId, currentStatus, onStatusChange }: PaymentStatusDropdownProps) => {
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  const statuses: { 
    value: PaymentStatus; 
    label: string; 
    shortLabel: string;
    bgColor: string;
    textColor: string;
    borderColor: string;
    glowColor: string;
    icon: string;
  }[] = [
    { 
      value: 'unpaid', 
      label: 'Unpaid', 
      shortLabel: 'Unpaid',
      bgColor: 'bg-danger-surface',
      textColor: 'text-danger',
      borderColor: 'border-danger-border',
      glowColor: 'shadow-danger',
      icon: '💳'
    },
    { 
      value: 'partial', 
      label: 'Partially Paid', 
      shortLabel: 'Partial',
      bgColor: 'bg-warning-surface',
      textColor: 'text-warning',
      borderColor: 'border-warning-border',
      glowColor: 'shadow-warning',
      icon: '⏳'
    },
    { 
      value: 'paid', 
      label: 'Fully Paid', 
      shortLabel: 'Paid',
      bgColor: 'bg-success-surface',
      textColor: 'text-success',
      borderColor: 'border-success-border',
      glowColor: 'shadow-success',
      icon: '✅'
    },
    { 
      value: 'refunded', 
      label: 'Refunded', 
      shortLabel: 'Refunded',
      bgColor: 'bg-secondary/10',
      textColor: 'text-secondary',
      borderColor: 'border-secondary/40',
      glowColor: 'shadow-secondary',
      icon: '↩️'
    },
    { 
      value: 'cod', 
      label: 'Cash on Delivery', 
      shortLabel: 'COD',
      bgColor: 'bg-info-surface',
      textColor: 'text-info',
      borderColor: 'border-info-border',
      glowColor: 'shadow-info',
      icon: '💵'
    },
  ];

  const getCurrentStatus = () => {
    return statuses.find(s => s.value === currentStatus) || statuses[0];
  };

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as PaymentStatus;
    
    if (newStatus === currentStatus || loading) {
      e.preventDefault();
      return;
    }
    
    setLoading(true);
    
    try {
      await updatePaymentStatus(orderId, newStatus);
      showSuccess(`Payment status updated to ${statuses.find(s => s.value === newStatus)?.label}`);
      onStatusChange();
    } catch (error: any) {
      console.error('Failed to update payment status:', error);
      showError(error.response?.data?.message || 'Failed to update payment status');
      // Force the select to revert by triggering a re-render
      e.target.value = currentStatus;
    } finally {
      setLoading(false);
    }
  };

  const status = getCurrentStatus();

  return (
    <div className="relative inline-block w-full sm:w-auto">
      {/* Mobile-optimized select wrapper */}
      <div className={`
        relative
        ${status.bgColor}
        ${status.borderColor}
        border-2
        rounded-pill
        transition-all duration-300
        hover:shadow-card
        ${loading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
        min-h-touch-sm
        flex items-center
      `}>
        {/* Icon */}
        <div className={`
          absolute left-3 sm:left-4
          text-lg sm:text-xl
          pointer-events-none
          ${loading ? 'animate-pulse' : ''}
        `}>
          {status.icon}
        </div>
        
        {/* Select element */}
        <select
          value={currentStatus}
          onChange={handleStatusChange}
          disabled={loading}
          className={`
            w-full
            pl-10 sm:pl-12
            pr-8 sm:pr-10
            py-2 sm:py-2.5
            ${status.textColor}
            font-semibold
            text-mobile-sm sm:text-sm
            bg-transparent
            border-0
            rounded-pill
            cursor-pointer
            appearance-none
            focus:outline-none
            focus:ring-2
            focus:ring-primary/50
            disabled:cursor-not-allowed
            transition-all duration-300
          `}
          style={{
            // Ensure minimum touch target on mobile
            minHeight: '36px',
          }}
        >
          {statuses.map(s => (
            <option 
              key={s.value} 
              value={s.value}
              className="bg-dark-surface text-text"
            >
              {s.icon} {s.label}
            </option>
          ))}
        </select>
        
        {/* Custom dropdown arrow */}
        <div className={`
          absolute right-3 sm:right-4
          pointer-events-none
          ${status.textColor}
          transition-transform duration-300
          ${loading ? 'animate-pulse' : ''}
        `}>
          <svg 
            className="w-4 h-4 sm:w-5 sm:h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2.5} 
              d="M19 9l-7 7-7-7" 
            />
          </svg>
        </div>
      </div>
      
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-dark/20 backdrop-blur-xs rounded-pill">
          <svg 
            className={`animate-spin h-5 w-5 sm:h-6 sm:w-6 ${status.textColor}`} 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4" 
              fill="none" 
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
            />
          </svg>
        </div>
      )}
    </div>
  );
};

export default PaymentStatusDropdown;
