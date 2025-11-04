import { useState, useEffect, useCallback } from 'react';
import { cacheManager, CacheStatus } from '../utils/cacheManager';
import { useOnlineStatus } from './useOnlineStatus';

/**
 * Custom hook for managing cached data with offline support
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.8
 * 
 * @param cacheKey - Key to store/retrieve data from cache
 * @param fetchFn - Function to fetch fresh data
 * @param cacheDuration - How long data should be cached (in milliseconds)
 * @returns Object with data, loading state, error, cache status, and refresh function
 */
export function useCachedData<T>(
  cacheKey: string,
  fetchFn: () => Promise<T>,
  cacheDuration: number
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cacheStatus, setCacheStatus] = useState<CacheStatus | null>(null);
  const isOnline = useOnlineStatus();

  const fetchData = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);

      // Try to get cached data first
      const cachedData = cacheManager.get<T>(cacheKey);
      const status = cacheManager.getStatus(cacheKey);

      // If offline, use cached data
      if (!isOnline) {
        if (cachedData) {
          setData(cachedData);
          setCacheStatus(status);
          setLoading(false);
          return;
        } else {
          throw new Error('No cached data available offline');
        }
      }

      // If online and we have fresh cached data, use it (unless force refresh)
      if (!forceRefresh && cachedData && status && !status.isStale) {
        setData(cachedData);
        setCacheStatus(status);
        setLoading(false);
        return;
      }

      // Fetch fresh data from API
      const freshData = await fetchFn();
      
      // Cache the fresh data
      cacheManager.set(cacheKey, freshData, cacheDuration);
      
      setData(freshData);
      setCacheStatus({
        isStale: false,
        age: 0,
        lastUpdated: new Date(),
      });
    } catch (err: any) {
      console.error('Error fetching data:', err);
      
      // If fetch fails but we have cached data, use it
      const cachedData = cacheManager.get<T>(cacheKey);
      if (cachedData) {
        setData(cachedData);
        const status = cacheManager.getStatus(cacheKey);
        setCacheStatus(status);
        setError('Using cached data - unable to fetch fresh data');
      } else {
        setError(err.message || 'Failed to load data');
      }
    } finally {
      setLoading(false);
    }
  }, [cacheKey, fetchFn, cacheDuration, isOnline]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Refresh when coming back online
  useEffect(() => {
    if (isOnline && data) {
      // Check if data is stale
      const status = cacheManager.getStatus(cacheKey);
      if (status && status.isStale) {
        fetchData();
      }
    }
  }, [isOnline, cacheKey, data, fetchData]);

  const refresh = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    cacheStatus,
    refresh,
    isOnline,
  };
}
