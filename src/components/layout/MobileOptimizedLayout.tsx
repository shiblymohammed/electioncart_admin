import { ReactNode, useEffect } from 'react';
import { useMobileOptimizations } from '../../hooks/useMobileOptimizations';

/**
 * MobileOptimizedLayout Component
 * Requirement 8.1: Responsive design for all screen sizes
 * Requirement 8.4: Optimize for mobile bandwidth
 * Requirement 8.10: Support both portrait and landscape orientations
 */

interface MobileOptimizedLayoutProps {
  children: ReactNode;
}

const MobileOptimizedLayout = ({ children }: MobileOptimizedLayoutProps) => {
  const {
    orientation,
    isSlowNetwork,
    prefersReducedMotion,
    isTouchDevice,
  } = useMobileOptimizations();

  useEffect(() => {
    // Requirement 8.10: Add orientation class to body
    document.body.classList.remove('orientation-portrait', 'orientation-landscape');
    document.body.classList.add(`orientation-${orientation}`);

    // Requirement 8.4: Add network type class for conditional styling
    document.body.classList.remove('network-slow', 'network-fast');
    if (isSlowNetwork) {
      document.body.classList.add('network-slow');
    } else {
      document.body.classList.add('network-fast');
    }

    // Requirement 8.4: Add reduced motion class
    if (prefersReducedMotion) {
      document.body.classList.add('prefers-reduced-motion');
    } else {
      document.body.classList.remove('prefers-reduced-motion');
    }

    // Requirement 8.2: Add touch device class
    if (isTouchDevice) {
      document.body.classList.add('touch-device');
    } else {
      document.body.classList.add('pointer-device');
    }

    return () => {
      document.body.classList.remove(
        'orientation-portrait',
        'orientation-landscape',
        'network-slow',
        'network-fast',
        'prefers-reduced-motion',
        'touch-device',
        'pointer-device'
      );
    };
  }, [orientation, isSlowNetwork, prefersReducedMotion, isTouchDevice]);

  return <>{children}</>;
};

export default MobileOptimizedLayout;
