import { CacheStatus } from '../../utils/cacheManager';

/**
 * StaleDataIndicator Component
 * Shows when data is stale or from cache
 * Requirements: 3.8
 */

interface StaleDataIndicatorProps {
  cacheStatus: CacheStatus | null;
  className?: string;
}

const StaleDataIndicator = ({ cacheStatus, className = '' }: StaleDataIndicatorProps) => {
  if (!cacheStatus || !cacheStatus.isStale) {
    return null;
  }

  const formatAge = (age: number): string => {
    const minutes = Math.floor(age / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'just now';
  };

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 bg-warning/10 border border-warning/30 rounded-lg text-sm ${className}`}
      role="status"
      aria-live="polite"
    >
      <svg
        className="w-4 h-4 text-warning"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span className="text-warning font-medium">
        Cached data from {formatAge(cacheStatus.age)}
      </span>
      <div className="group relative">
        <svg
          className="w-4 h-4 text-warning/70 cursor-help"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
        
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-64 p-3 bg-dark-surface border border-dark-border rounded-lg shadow-card text-xs text-text z-10">
          <p className="font-semibold mb-1">Stale Data</p>
          <p className="text-text-muted">
            This data was last updated {cacheStatus.lastUpdated.toLocaleString()}. 
            Refresh to get the latest information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StaleDataIndicator;
