import { useState, useEffect } from 'react';

/**
 * Mobile Optimization Hooks
 * Requirement 8.1: Responsive design for all screen sizes
 * Requirement 8.4: Optimize for mobile bandwidth
 * Requirement 8.10: Support both portrait and landscape orientations
 */

/**
 * Hook to detect device orientation
 */
export const useOrientation = () => {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(
    window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
  );

  useEffect(() => {
    const handleOrientationChange = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    };

    window.addEventListener('resize', handleOrientationChange);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleOrientationChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return orientation;
};

/**
 * Hook to detect if device is in standalone mode (installed PWA)
 */
export const useIsStandalone = () => {
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const checkStandalone = () => {
      const standalone = window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone ||
        document.referrer.includes('android-app://');
      setIsStandalone(standalone);
    };

    checkStandalone();
    window.matchMedia('(display-mode: standalone)').addEventListener('change', checkStandalone);

    return () => {
      window.matchMedia('(display-mode: standalone)').removeEventListener('change', checkStandalone);
    };
  }, []);

  return isStandalone;
};

/**
 * Hook to detect network connection type
 * Requirement 8.4: Optimize for mobile bandwidth
 */
export const useNetworkType = () => {
  const [networkType, setNetworkType] = useState<'slow' | 'fast' | 'unknown'>('unknown');

  useEffect(() => {
    const connection = (navigator as any).connection || 
                      (navigator as any).mozConnection || 
                      (navigator as any).webkitConnection;

    if (!connection) {
      setNetworkType('unknown');
      return;
    }

    const updateNetworkType = () => {
      const effectiveType = connection.effectiveType;
      
      // Classify as slow if 2g or slow-2g
      if (effectiveType === 'slow-2g' || effectiveType === '2g') {
        setNetworkType('slow');
      } 
      // Classify as fast if 4g
      else if (effectiveType === '4g') {
        setNetworkType('fast');
      }
      // 3g is in between
      else {
        setNetworkType('fast');
      }
    };

    updateNetworkType();
    connection.addEventListener('change', updateNetworkType);

    return () => {
      connection.removeEventListener('change', updateNetworkType);
    };
  }, []);

  return networkType;
};

/**
 * Hook to detect if user prefers reduced motion
 * Requirement 8.4: Optimize for mobile bandwidth
 */
export const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReducedMotion;
};

/**
 * Hook to get viewport dimensions
 * Requirement 8.1: Responsive design for all screen sizes
 */
export const useViewportSize = () => {
  const [viewportSize, setViewportSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return viewportSize;
};

/**
 * Hook to detect touch device
 * Requirement 8.2: Touch-friendly UI
 */
export const useIsTouchDevice = () => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const checkTouchDevice = () => {
      const hasTouch = 'ontouchstart' in window || 
                      navigator.maxTouchPoints > 0 ||
                      (navigator as any).msMaxTouchPoints > 0;
      setIsTouchDevice(hasTouch);
    };

    checkTouchDevice();
  }, []);

  return isTouchDevice;
};

/**
 * Combined mobile optimization hook
 */
export const useMobileOptimizations = () => {
  const orientation = useOrientation();
  const isStandalone = useIsStandalone();
  const networkType = useNetworkType();
  const prefersReducedMotion = usePrefersReducedMotion();
  const viewportSize = useViewportSize();
  const isTouchDevice = useIsTouchDevice();

  return {
    orientation,
    isStandalone,
    networkType,
    prefersReducedMotion,
    viewportSize,
    isTouchDevice,
    isSlowNetwork: networkType === 'slow',
    isMobile: viewportSize.width < 768,
    isTablet: viewportSize.width >= 768 && viewportSize.width < 1024,
    isDesktop: viewportSize.width >= 1024,
  };
};
