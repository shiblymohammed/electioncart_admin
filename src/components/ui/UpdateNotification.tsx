import { useServiceWorker } from '../../hooks/useServiceWorker';

/**
 * UpdateNotification Component
 * Displays a notification when a new version of the app is available
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.6, 7.7
 */
const UpdateNotification = () => {
  const { updateAvailable, isUpdating, update, dismissUpdate } = useServiceWorker();

  // Don't render if no update is available
  if (!updateAvailable) {
    return null;
  }

  return (
    <div
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-slide-up"
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="bg-dark-surface border border-primary/30 rounded-lg shadow-card p-4">
        <div className="flex items-start gap-3">
          {/* Update Icon */}
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg
              className="w-6 h-6 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-text font-semibold text-base mb-1">
              Update Available
            </h3>
            <p className="text-text-muted text-sm mb-3">
              A new version of Election Cart Admin is ready. Update now to get the latest features and improvements.
            </p>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={update}
                disabled={isUpdating}
                className="
                  px-4 py-2 bg-primary text-primary-content rounded-lg
                  hover:bg-primary-hover transition-colors
                  text-sm font-medium
                  disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center gap-2
                "
                aria-label="Update now"
              >
                {isUpdating ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    <span>Update Now</span>
                  </>
                )}
              </button>
              <button
                onClick={dismissUpdate}
                disabled={isUpdating}
                className="
                  px-4 py-2 text-text-muted hover:text-text
                  transition-colors text-sm font-medium
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
                aria-label="Dismiss update notification"
              >
                Later
              </button>
            </div>

            {/* Auto-update notice */}
            <p className="text-text-muted text-xs mt-2 flex items-center gap-1">
              <svg
                className="w-3 h-3"
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
              <span>Will auto-update in 24 hours if not dismissed</span>
            </p>
          </div>

          {/* Close button */}
          <button
            onClick={dismissUpdate}
            disabled={isUpdating}
            className="
              p-1 rounded-lg text-text-muted hover:text-text
              hover:bg-dark-hover transition-colors flex-shrink-0
              disabled:opacity-50 disabled:cursor-not-allowed
            "
            aria-label="Close notification"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateNotification;
