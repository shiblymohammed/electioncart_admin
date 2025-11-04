import { useState } from 'react';
import Button from '../../ui/Button';

interface OrderListActionsProps {
  isBulkMode: boolean;
  onBulkModeToggle: () => void;
  onFilterClick: () => void;
  onCreateOrder: () => void;
  onRefresh: () => void;
  viewMode: 'table' | 'grid' | 'kanban';
  onViewModeChange: (mode: 'table' | 'grid' | 'kanban') => void;
  activeFilterCount: number;
  showStaleIndicator?: boolean;
  staleIndicator?: React.ReactNode;
}

const OrderListActions = ({
  isBulkMode,
  onBulkModeToggle,
  onFilterClick,
  onCreateOrder,
  onRefresh,
  viewMode,
  onViewModeChange,
  activeFilterCount,
  showStaleIndicator,
  staleIndicator,
}: OrderListActionsProps) => {
  const [showMoreActions, setShowMoreActions] = useState(false);

  return (
    <div className="flex flex-col gap-2 sm:gap-3">
      {/* Top row: Primary actions */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Stale data indicator */}
        {showStaleIndicator && staleIndicator}
        
        {/* Create Order - Primary action */}
        <Button
          variant="primary"
          onClick={onCreateOrder}
          className="flex-1 sm:flex-none text-mobile-sm sm:text-sm px-3 sm:px-4 py-2 min-h-touch-sm"
          leftIcon={
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          }
        >
          <span className="hidden sm:inline">Create Manual Order</span>
          <span className="sm:hidden">Create Order</span>
        </Button>

        {/* Filter button with badge */}
        <Button
          variant="ghost"
          onClick={onFilterClick}
          className="text-mobile-sm sm:text-sm px-3 sm:px-4 py-2 min-h-touch-sm"
          leftIcon={
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          }
        >
          <span className="hidden sm:inline">Filters</span>
          <span className="sm:hidden">Filter</span>
          {activeFilterCount > 0 && (
            <span className="ml-1 sm:ml-2 px-1.5 sm:px-2 py-0.5 bg-primary text-white text-xs rounded-full min-w-[20px] text-center">
              {activeFilterCount}
            </span>
          )}
        </Button>

        {/* More actions toggle (mobile only) */}
        <button
          onClick={() => setShowMoreActions(!showMoreActions)}
          className="sm:hidden px-3 py-2 bg-dark-hover hover:bg-dark-border rounded-lg transition-colors min-h-touch-sm"
          aria-label="More actions"
        >
          <svg 
            className={`w-5 h-5 text-text transition-transform ${showMoreActions ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Second row: Secondary actions (always visible on desktop, toggleable on mobile) */}
      <div className={`
        flex flex-wrap items-center gap-2
        ${showMoreActions ? 'flex' : 'hidden sm:flex'}
        transition-all duration-300
      `}>
        {/* Bulk select */}
        <Button
          variant={isBulkMode ? 'primary' : 'ghost'}
          onClick={onBulkModeToggle}
          className="text-mobile-sm sm:text-sm px-3 sm:px-4 py-2 min-h-touch-sm"
          leftIcon={
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          }
        >
          <span className="hidden sm:inline">{isBulkMode ? 'Exit Bulk' : 'Bulk Select'}</span>
          <span className="sm:hidden">{isBulkMode ? 'Exit' : 'Bulk'}</span>
        </Button>

        {/* View mode toggle */}
        <div className="flex gap-1 bg-dark-hover rounded-lg p-1">
          <button
            onClick={() => onViewModeChange('table')}
            className={`px-2 sm:px-3 py-1.5 rounded-md transition-colors ${
              viewMode === 'table' 
                ? 'bg-primary text-white shadow-glow-primary' 
                : 'text-text-muted hover:text-text hover:bg-dark-border'
            }`}
            title="Table View"
            aria-label="Table View"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
          <button
            onClick={() => onViewModeChange('grid')}
            className={`px-2 sm:px-3 py-1.5 rounded-md transition-colors ${
              viewMode === 'grid' 
                ? 'bg-primary text-white shadow-glow-primary' 
                : 'text-text-muted hover:text-text hover:bg-dark-border'
            }`}
            title="Grid View"
            aria-label="Grid View"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => onViewModeChange('kanban')}
            className={`px-2 sm:px-3 py-1.5 rounded-md transition-colors ${
              viewMode === 'kanban' 
                ? 'bg-primary text-white shadow-glow-primary' 
                : 'text-text-muted hover:text-text hover:bg-dark-border'
            }`}
            title="Kanban View"
            aria-label="Kanban View"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
          </button>
        </div>

        {/* Refresh button */}
        <Button 
          variant="ghost" 
          onClick={onRefresh}
          className="text-mobile-sm sm:text-sm px-3 sm:px-4 py-2 min-h-touch-sm"
          leftIcon={
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          }
        >
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      </div>
    </div>
  );
};

export default OrderListActions;
