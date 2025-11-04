import { useOnlineStatus } from '../../hooks/useOnlineStatus';

/**
 * OfflineIndicator Component
 * Displays a banner when the user is offline
 * Requirements: 2.6, 3.5, 3.9
 */
const OfflineIndicator = () => {
  const isOnline = useOnlineStatus();

  // Don't render anything if online
  if (isOnline) {
    return null;
  }

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 bg-warning/90 backdrop-blur-sm border-b border-warning/50 shadow-lg"
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center justify-center gap-3 px-4 py-3">
        {/* Offline icon with pulse animation */}
        <div className="relative">
          <svg
            className="w-5 h-5 text-dark"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3"
            />
          </svg>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-dark opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-dark"></span>
          </span>
        </div>

        {/* Message */}
        <div className="flex items-center gap-2">
          <span className="text-dark font-semibold text-sm">
            You're offline
          </span>
          <span className="hidden sm:inline text-dark/80 text-sm">
            • Viewing cached data
          </span>
        </div>

        {/* Info icon with tooltip */}
        <div className="group relative">
          <svg
            className="w-4 h-4 text-dark/70 cursor-help"
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
          <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block w-64 p-3 bg-dark-surface border border-dark-border rounded-lg shadow-card text-xs text-text z-10">
            <p className="font-semibold mb-1">Limited Functionality</p>
            <p className="text-text-muted">
              You can view previously loaded data, but some features may be unavailable until you reconnect.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfflineIndicator;
