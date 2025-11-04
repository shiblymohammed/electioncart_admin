import { useState, useEffect } from 'react';
import { cacheManager } from '../../utils/cacheManager';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import Card from './Card';
import Button from './Button';

/**
 * CacheStatusDisplay Component
 * Shows cache statistics and allows manual cache management
 * Requirements: 3.8
 */

const CacheStatusDisplay = () => {
  const [cacheSize, setCacheSize] = useState('0 B');
  const [isOpen, setIsOpen] = useState(false);
  const isOnline = useOnlineStatus();

  useEffect(() => {
    updateCacheSize();
  }, []);

  const updateCacheSize = () => {
    setCacheSize(cacheManager.getCacheSizeFormatted());
  };

  const handleClearCache = () => {
    if (confirm('Are you sure you want to clear all cached data? This will require re-fetching data when online.')) {
      cacheManager.clearAll();
      updateCacheSize();
      // Reload to fetch fresh data
      window.location.reload();
    }
  };

  const handleClearOldCache = () => {
    cacheManager.clearOldCache();
    updateCacheSize();
  };

  return (
    <div className="relative">
      {/* Cache Status Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-dark-hover transition-colors text-text-muted hover:text-text"
        title="Cache Status"
        aria-label="View cache status"
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
            d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
          />
        </svg>
        <span className="text-sm font-medium hidden sm:inline">{cacheSize}</span>
      </button>

      {/* Cache Status Dropdown */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 z-50">
            <Card className="shadow-xl">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-text">Cache Status</h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded-lg hover:bg-dark-hover transition-colors text-text-muted hover:text-text"
                    aria-label="Close"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Status Info */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between p-3 bg-dark-hover rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-success' : 'bg-warning'}`} />
                      <span className="text-sm text-text-muted">Connection</span>
                    </div>
                    <span className="text-sm font-medium text-text">
                      {isOnline ? 'Online' : 'Offline'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-dark-hover rounded-lg">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                      </svg>
                      <span className="text-sm text-text-muted">Cache Size</span>
                    </div>
                    <span className="text-sm font-medium text-text">{cacheSize}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    fullWidth
                    onClick={() => {
                      updateCacheSize();
                    }}
                    leftIcon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    }
                  >
                    Refresh Stats
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    fullWidth
                    onClick={handleClearOldCache}
                    leftIcon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    }
                  >
                    Clear Old Cache
                  </Button>

                  <Button
                    variant="danger"
                    size="sm"
                    fullWidth
                    onClick={handleClearCache}
                    leftIcon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    }
                  >
                    Clear All Cache
                  </Button>
                </div>

                {/* Info */}
                <div className="mt-4 p-3 bg-info/10 border border-info/30 rounded-lg">
                  <p className="text-xs text-info">
                    <strong>Note:</strong> Cached data allows you to view previously loaded information when offline. 
                    Clearing cache will require re-fetching all data when online.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default CacheStatusDisplay;
