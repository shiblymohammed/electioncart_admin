/**
 * PWA Analytics Utilities
 * Requirements: 4.5, 10.1, 10.2
 * 
 * Tracks PWA-specific events for monitoring and analytics
 */

/**
 * Track PWA installation event
 * Requirement: 4.5, 10.1
 */
export const trackPWAInstall = (outcome: 'accepted' | 'dismissed') => {
  // Track with Google Analytics if available
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'pwa_install', {
      event_category: 'PWA',
      event_label: outcome === 'accepted' ? 'Install Accepted' : 'Install Dismissed',
      value: outcome === 'accepted' ? 1 : 0,
    });
  }

  // Log to console in development
  if (import.meta.env.DEV) {
    console.log('[PWA Analytics] Install event:', outcome);
  }

  // Store in localStorage for internal tracking
  const installData = {
    outcome,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
  };
  
  try {
    localStorage.setItem('pwa-install-event', JSON.stringify(installData));
  } catch (error) {
    console.error('Failed to store PWA install event:', error);
  }
};

/**
 * Track PWA install prompt shown
 * Requirement: 10.1
 */
export const trackPWAPromptShown = (variant: 'banner' | 'button') => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'pwa_prompt_shown', {
      event_category: 'PWA',
      event_label: `Prompt Shown - ${variant}`,
    });
  }

  if (import.meta.env.DEV) {
    console.log('[PWA Analytics] Prompt shown:', variant);
  }
};

/**
 * Track PWA app launched
 * Requirement: 10.2
 */
export const trackPWALaunch = () => {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const isIOSStandalone = (window.navigator as any).standalone === true;

  if (isStandalone || isIOSStandalone) {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'pwa_launch', {
        event_category: 'PWA',
        event_label: 'App Launched in Standalone Mode',
      });
    }

    if (import.meta.env.DEV) {
      console.log('[PWA Analytics] App launched in standalone mode');
    }

    // Track launch count
    try {
      const launchCount = parseInt(localStorage.getItem('pwa-launch-count') || '0', 10);
      localStorage.setItem('pwa-launch-count', (launchCount + 1).toString());
    } catch (error) {
      console.error('Failed to track PWA launch count:', error);
    }
  }
};

/**
 * Get PWA analytics data
 * Requirement: 10.1, 10.2
 */
export const getPWAAnalytics = () => {
  try {
    const installEvent = localStorage.getItem('pwa-install-event');
    const launchCount = localStorage.getItem('pwa-launch-count');
    const installDismissed = localStorage.getItem('pwa-install-dismissed');

    return {
      installEvent: installEvent ? JSON.parse(installEvent) : null,
      launchCount: launchCount ? parseInt(launchCount, 10) : 0,
      lastDismissed: installDismissed ? parseInt(installDismissed, 10) : null,
      isInstalled: window.matchMedia('(display-mode: standalone)').matches || 
                   (window.navigator as any).standalone === true,
    };
  } catch (error) {
    console.error('Failed to get PWA analytics:', error);
    return null;
  }
};
