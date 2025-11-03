import { useState } from 'react';
import { useToast } from '../../../hooks/useToast';
import { StaffMember } from '../../../types/order';

interface BulkActionBarProps {
  selectedCount: number;
  onAssign: (staffId: string) => Promise<void>;
  onExport: () => void;
  onCancel: () => void;
  onClearSelection: () => void;
  staffMembers?: StaffMember[];
}

const BulkActionBar = ({
  selectedCount,
  onAssign,
  onExport,
  onCancel,
  onClearSelection,
  staffMembers = []
}: BulkActionBarProps) => {
  const { showSuccess, showError } = useToast();
  const [showAssignDropdown, setShowAssignDropdown] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAssign = async (staffId: string) => {
    try {
      setIsProcessing(true);
      await onAssign(staffId);
      setShowAssignDropdown(false);
      showSuccess(`Successfully assigned ${selectedCount} orders`);
    } catch (err: any) {
      showError(err.message || 'Failed to assign orders');
    } finally {
      setIsProcessing(false);
    }
  };

  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-up">
      <div className="bg-dark-surface border border-dark-border rounded-xl shadow-2xl shadow-primary/20 px-6 py-4">
        <div className="flex items-center gap-6">
          {/* Selected Count */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
              <span className="text-primary font-semibold text-sm">{selectedCount}</span>
            </div>
            <span className="text-text font-medium">
              {selectedCount} {selectedCount === 1 ? 'order' : 'orders'} selected
            </span>
          </div>

          {/* Divider */}
          <div className="h-8 w-px bg-dark-border"></div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Assign Button */}
            {staffMembers.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowAssignDropdown(!showAssignDropdown)}
                  disabled={isProcessing}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors disabled:opacity-50"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Assign</span>
                </button>

                {/* Assign Dropdown */}
                {showAssignDropdown && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowAssignDropdown(false)}
                    />
                    <div className="absolute bottom-full mb-2 left-0 w-56 bg-dark-surface border border-dark-border rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
                      <div className="p-2">
                        <div className="px-3 py-2 text-xs text-text-muted font-medium uppercase">
                          Assign to Staff
                        </div>
                        {staffMembers.map(staff => (
                          <button
                            key={staff.id}
                            onClick={() => handleAssign(staff.id.toString())}
                            disabled={isProcessing}
                            className="w-full text-left px-3 py-2 text-text hover:bg-dark-hover rounded-lg transition-colors disabled:opacity-50"
                          >
                            {staff.name || staff.phone}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Export Button */}
            <button
              onClick={onExport}
              disabled={isProcessing}
              className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 hover:bg-success/20 text-success rounded-lg transition-colors disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Export</span>
            </button>

            {/* Cancel Button */}
            <button
              onClick={onCancel}
              disabled={isProcessing}
              className="inline-flex items-center gap-2 px-4 py-2 bg-danger/10 hover:bg-danger/20 text-danger rounded-lg transition-colors disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Cancel</span>
            </button>
          </div>

          {/* Divider */}
          <div className="h-8 w-px bg-dark-border"></div>

          {/* Clear Selection */}
          <button
            onClick={onClearSelection}
            className="text-text-muted hover:text-text transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkActionBar;
