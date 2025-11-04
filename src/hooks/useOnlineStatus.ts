import { useState, useEffect } from 'react';

/**
 * Custom hook to detect online/offline status
 * Requirements: 3.5, 3.6, 3.7
 * 
 * @returns {boolean} isOnline - Current online status
 */
export const useOnlineStatus = (): boolean => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    // Handler for when connection is restored
    const handleOnline = () => {
      setIsOnline(true);
    };

    // Handler for when connection is lost
    const handleOffline = () => {
      setIsOnline(false);
    };

    // Add event listeners for online/offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup event listeners on unmount
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};
