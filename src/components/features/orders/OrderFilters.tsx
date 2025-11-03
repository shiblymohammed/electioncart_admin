import { useState, useEffect } from 'react';

interface OrderFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterValues) => void;
  onClear: () => void;
  activeFilters: FilterValues;
}

export interface FilterValues {
  statuses: string[];
  dateFrom: string;
  dateTo: string;
  assignedTo: string;
  minAmount: number;
  maxAmount: number;
}

const statusOptions = [
  { value: 'pending_payment', label: 'Pending Payment' },
  { value: 'pending_resources', label: 'Pending Resources' },
  { value: 'ready_for_processing', label: 'Ready for Processing' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const OrderFilters = ({ isOpen, onClose, onApply, onClear, activeFilters }: OrderFiltersProps) => {
  const [filters, setFilters] = useState<FilterValues>(activeFilters);

  useEffect(() => {
    setFilters(activeFilters);
  }, [activeFilters]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handleStatusToggle = (status: string) => {
    setFilters(prev => ({
      ...prev,
      statuses: prev.statuses.includes(status)
        ? prev.statuses.filter(s => s !== status)
        : [...prev.statuses, status]
    }));
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleClear = () => {
    const emptyFilters: FilterValues = {
      statuses: [],
      dateFrom: '',
      dateTo: '',
      assignedTo: '',
      minAmount: 0,
      maxAmount: 0,
    };
    setFilters(emptyFilters);
    onClear();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-96 bg-dark-surface border-l border-dark-border shadow-2xl z-50 animate-slide-in-right overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-dark-surface border-b border-dark-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-text">Filters</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-dark-hover rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Filter Content */}
        <div className="p-6 space-y-6">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-text mb-3">Status</label>
            <div className="space-y-2">
              {statusOptions.map(option => (
                <label key={option.value} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.statuses.includes(option.value)}
                    onChange={() => handleStatusToggle(option.value)}
                    className="w-4 h-4 rounded border-dark-border bg-dark-hover text-primary focus:ring-2 focus:ring-primary/50"
                  />
                  <span className="text-text-muted group-hover:text-text transition-colors">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Date Range Filter */}
          <div>
            <label className="block text-sm font-medium text-text mb-3">Date Range</label>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-text-muted mb-1">From</label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                  className="w-full px-3 py-2 bg-dark-hover border border-dark-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="block text-xs text-text-muted mb-1">To</label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                  className="w-full px-3 py-2 bg-dark-hover border border-dark-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
          </div>

          {/* Amount Range Filter */}
          <div>
            <label className="block text-sm font-medium text-text mb-3">Amount Range</label>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-text-muted mb-1">Min Amount (₹)</label>
                <input
                  type="number"
                  value={filters.minAmount || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, minAmount: parseFloat(e.target.value) || 0 }))}
                  placeholder="0"
                  className="w-full px-3 py-2 bg-dark-hover border border-dark-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="block text-xs text-text-muted mb-1">Max Amount (₹)</label>
                <input
                  type="number"
                  value={filters.maxAmount || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxAmount: parseFloat(e.target.value) || 0 }))}
                  placeholder="No limit"
                  className="w-full px-3 py-2 bg-dark-hover border border-dark-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
          </div>

          {/* Staff Assignment Filter */}
          <div>
            <label className="block text-sm font-medium text-text mb-3">Assigned To</label>
            <select
              value={filters.assignedTo}
              onChange={(e) => setFilters(prev => ({ ...prev, assignedTo: e.target.value }))}
              className="w-full px-3 py-2 bg-dark-hover border border-dark-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">All Staff</option>
              <option value="unassigned">Unassigned</option>
              <option value="assigned">Assigned</option>
            </select>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-dark-surface border-t border-dark-border px-6 py-4 flex gap-3">
          <button
            onClick={handleClear}
            className="flex-1 px-4 py-2 bg-dark-hover hover:bg-dark-border text-text rounded-lg transition-colors"
          >
            Clear All
          </button>
          <button
            onClick={handleApply}
            className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors shadow-glow-primary"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
};

export default OrderFilters;
