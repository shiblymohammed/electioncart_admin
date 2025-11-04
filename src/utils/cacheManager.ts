/**
 * Cache Manager Utility
 * Manages offline data caching for dashboard, orders, and staff
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.8, 3.10
 */

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

export interface CacheStatus {
  isStale: boolean;
  age: number; // in milliseconds
  lastUpdated: Date;
}

const CACHE_KEYS = {
  DASHBOARD_STATS: 'dashboard_statistics',
  ORDERS: 'orders_list',
  ORDER_DETAIL: 'order_detail_',
  STAFF_LIST: 'staff_list',
  ASSIGNED_ORDERS: 'assigned_orders',
} as const;

const CACHE_DURATION = {
  DASHBOARD: 5 * 60 * 1000, // 5 minutes
  ORDERS: 5 * 60 * 1000, // 5 minutes
  ORDER_DETAIL: 5 * 60 * 1000, // 5 minutes
  STAFF: 10 * 60 * 1000, // 10 minutes
} as const;

class CacheManager {
  /**
   * Set data in cache with expiration
   */
  set<T>(key: string, data: T, duration: number): void {
    try {
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        expiresAt: Date.now() + duration,
      };
      localStorage.setItem(key, JSON.stringify(entry));
    } catch (error) {
      console.error('Error setting cache:', error);
      // Handle quota exceeded error
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        this.clearOldCache();
      }
    }
  }

  /**
   * Get data from cache
   */
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;

      const entry: CacheEntry<T> = JSON.parse(item);
      
      // Return data even if expired (for offline access)
      return entry.data;
    } catch (error) {
      console.error('Error getting cache:', error);
      return null;
    }
  }

  /**
   * Check if cache entry is stale
   */
  isStale(key: string): boolean {
    try {
      const item = localStorage.getItem(key);
      if (!item) return true;

      const entry: CacheEntry<any> = JSON.parse(item);
      return Date.now() > entry.expiresAt;
    } catch (error) {
      console.error('Error checking cache staleness:', error);
      return true;
    }
  }

  /**
   * Get cache status for a key
   */
  getStatus(key: string): CacheStatus | null {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;

      const entry: CacheEntry<any> = JSON.parse(item);
      const age = Date.now() - entry.timestamp;
      const isStale = Date.now() > entry.expiresAt;

      return {
        isStale,
        age,
        lastUpdated: new Date(entry.timestamp),
      };
    } catch (error) {
      console.error('Error getting cache status:', error);
      return null;
    }
  }

  /**
   * Remove specific cache entry
   */
  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing cache:', error);
    }
  }

  /**
   * Clear all cache entries
   */
  clearAll(): void {
    try {
      const keys = Object.values(CACHE_KEYS);
      keys.forEach(key => {
        if (typeof key === 'string') {
          // Handle keys with prefixes
          if (key.endsWith('_')) {
            // Clear all entries with this prefix
            Object.keys(localStorage).forEach(storageKey => {
              if (storageKey.startsWith(key)) {
                localStorage.removeItem(storageKey);
              }
            });
          } else {
            localStorage.removeItem(key);
          }
        }
      });
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  /**
   * Clear old/expired cache entries
   */
  clearOldCache(): void {
    try {
      const now = Date.now();
      Object.keys(localStorage).forEach(key => {
        try {
          const item = localStorage.getItem(key);
          if (item) {
            const entry: CacheEntry<any> = JSON.parse(item);
            // Remove if expired for more than 24 hours
            if (entry.expiresAt && now > entry.expiresAt + 24 * 60 * 60 * 1000) {
              localStorage.removeItem(key);
            }
          }
        } catch {
          // Skip invalid entries
        }
      });
    } catch (error) {
      console.error('Error clearing old cache:', error);
    }
  }

  /**
   * Get cache size in bytes
   */
  getCacheSize(): number {
    let size = 0;
    try {
      Object.keys(localStorage).forEach(key => {
        const item = localStorage.getItem(key);
        if (item) {
          size += item.length + key.length;
        }
      });
    } catch (error) {
      console.error('Error calculating cache size:', error);
    }
    return size;
  }

  /**
   * Get cache size in human-readable format
   */
  getCacheSizeFormatted(): string {
    const bytes = this.getCacheSize();
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
}

// Export singleton instance
export const cacheManager = new CacheManager();

// Export cache keys and durations for use in services
export { CACHE_KEYS, CACHE_DURATION };
