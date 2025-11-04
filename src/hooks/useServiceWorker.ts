import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook to manage Service Worker lifecycle and updates
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.6, 7.7
 * 
 * @returns Object with service worker state and update methods
 */
export const useServiceWorker = () => {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [updateAvailable, setUpdateAvailable] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  /**
   * Trigger the service worker update
   * Requirements: 7.3, 7.4, 7.6, 7.7
   */
  const update = useCallback(() => {
    if (!waitingWorker) {
      console.warn('No waiting service worker available');
      return;
    }

    setIsUpdating(true);

    // Requirement 7.4: Handle skip waiting
    // Tell the waiting service worker to skip waiting and become active
    waitingWorker.postMessage({ type: 'SKIP_WAITING' });

    // The controllerchange event will trigger a reload
  }, [waitingWorker]);

  /**
   * Dismiss the update notification
   * User can continue using the current version
   */
  const dismissUpdate = useCallback(() => {
    setUpdateAvailable(false);
    
    // Store dismissal time for auto-update logic
    localStorage.setItem('sw-update-dismissed', Date.now().toString());
  }, []);

  useEffect(() => {
    // Check if service workers are supported
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Workers are not supported in this browser');
      return;
    }

    // Get the service worker registration
    navigator.serviceWorker.ready
      .then((reg) => {
        setRegistration(reg);

        // Requirement 7.1: Detect service worker updates
        // Check if there's already a waiting service worker
        if (reg.waiting) {
          setWaitingWorker(reg.waiting);
          setUpdateAvailable(true);
        }

        // Listen for new service worker installation
        const handleUpdateFound = () => {
          const newWorker = reg.installing;
          
          if (newWorker) {
            const handleStateChange = () => {
              // Requirement 7.2: Show update notification when new worker is waiting
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // A new service worker is available
                setWaitingWorker(newWorker);
                setUpdateAvailable(true);
                
                console.log('New service worker available');
              }
            };

            newWorker.addEventListener('statechange', handleStateChange);
          }
        };

        reg.addEventListener('updatefound', handleUpdateFound);

        // Check for updates periodically (every 60 seconds)
        const checkForUpdates = () => {
          reg.update().catch((error) => {
            console.error('Error checking for service worker updates:', error);
          });
        };

        // Check for updates every minute
        const updateInterval = setInterval(checkForUpdates, 60 * 1000);

        // Check for updates when page becomes visible
        const handleVisibilityChange = () => {
          if (document.visibilityState === 'visible') {
            checkForUpdates();
          }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
          clearInterval(updateInterval);
          document.removeEventListener('visibilitychange', handleVisibilityChange);
          reg.removeEventListener('updatefound', handleUpdateFound);
        };
      })
      .catch((error) => {
        console.error('Error getting service worker registration:', error);
      });

    // Listen for controller change (when new service worker takes over)
    const handleControllerChange = () => {
      // Requirement 7.6: Reload to activate new service worker
      console.log('Service worker controller changed, reloading page');
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);

    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
    };
  }, []);

  /**
   * Check if update should be forced (after 24 hours)
   * Requirement 7.5: Automatically update after 24 hours if not dismissed
   */
  useEffect(() => {
    if (!updateAvailable) return;

    const dismissedTime = localStorage.getItem('sw-update-dismissed');
    if (!dismissedTime) return;

    const hoursSinceDismissed = (Date.now() - parseInt(dismissedTime, 10)) / (1000 * 60 * 60);

    // Force update after 24 hours
    if (hoursSinceDismissed >= 24) {
      console.log('Auto-updating after 24 hours');
      update();
    }
  }, [updateAvailable, update]);

  return {
    registration,
    updateAvailable,
    isUpdating,
    update,
    dismissUpdate,
  };
};
