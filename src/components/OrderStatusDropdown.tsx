import { useState } from 'react';
import { updateOrderStatus } from '../services/manualOrderService';
import { OrderStatus } from '../types/manualOrder';
import { useToast } from '../hooks/useToast';

interface OrderStatusDropdownProps {
  orderId: number;
  currentStatus: OrderStatus;
  onStatusChange: () => void;
}

const OrderStatusDropdown = ({ orderId, currentStatus, onStatusChange }: OrderStatusDropdownProps) => {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(currentStatus);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  const statuses: { value: OrderStatus; label: string; color: string }[] = [
    { value: 'pending_payment', label: 'Pending Payment', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'pending_resources', label: 'Pending Resources', color: 'bg-orange-100 text-orange-800' },
    { value: 'ready_for_processing', label: 'Ready for Processing', color: 'bg-blue-100 text-blue-800' },
    { value: 'assigned', label: 'Assigned', color: 'bg-purple-100 text-purple-800' },
    { value: 'in_progress', label: 'In Progress', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
    { value: 'on_hold', label: 'On Hold', color: 'bg-gray-100 text-gray-800' },
  ];

  const getCurrentStatusColor = () => {
    return statuses.find(s => s.value === currentStatus)?.color || 'bg-gray-100 text-gray-800';
  };

  const handleStatusSelect = (newStatus: OrderStatus) => {
    if (newStatus === currentStatus) return;
    
    setSelectedStatus(newStatus);
    setShowReasonModal(true);
  };

  const confirmStatusChange = async () => {
    setLoading(true);
    try {
      await updateOrderStatus(orderId, {
        status: selectedStatus,
        reason: reason.trim()
      });
      
      showSuccess('Order status updated successfully');
      setShowReasonModal(false);
      setReason('');
      onStatusChange();
    } catch (error: any) {
      console.error('Failed to update status:', error);
      showError(error.response?.data?.message || 'Failed to update order status');
      setSelectedStatus(currentStatus); // Revert
    } finally {
      setLoading(false);
    }
  };

  const cancelStatusChange = () => {
    setShowReasonModal(false);
    setSelectedStatus(currentStatus);
    setReason('');
  };

  return (
    <>
      {/* Status Badge with Dropdown */}
      <div className="relative inline-block">
        <select
          value={currentStatus}
          onChange={(e) => handleStatusSelect(e.target.value as OrderStatus)}
          className={`px-4 py-2 rounded-full text-sm font-semibold cursor-pointer border-0 ${getCurrentStatusColor()} hover:opacity-80 transition-opacity`}
          disabled={loading}
        >
          {statuses.map(s => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Reason Modal */}
      {showReasonModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-card rounded-xl p-6 max-w-md w-full shadow-2xl border border-dark-border">
            <h3 className="text-lg font-semibold text-text mb-4">
              Change Status to "{statuses.find(s => s.value === selectedStatus)?.label}"
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-muted mb-2">
                Reason for change (optional)
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-dark-bg border border-dark-border rounded-lg p-3 text-text focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={3}
                placeholder="e.g., Customer sent resources via WhatsApp"
                disabled={loading}
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={cancelStatusChange}
                className="flex-1 px-4 py-2 border border-dark-border rounded-lg text-text hover:bg-dark-bg transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={confirmStatusChange}
                className="flex-1 px-4 py-2 bg-gradient-primary text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Updating...
                  </span>
                ) : (
                  'Update Status'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderStatusDropdown;
