import { useState, useEffect } from 'react';
import { trackPWAInstall, trackPWALaunch } from '../utils/pwaAnalytics';

/**
 * Interface for the beforeinstallprompt event
 */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

/**
 * Custom hook to manage PWA installation
 * Requirements: 4.1, 4.2, 4.3, 4.8
 * 
 * @returns Object with installation state and methods
 */
export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState<boolean>(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    // Check if app is already installed (running in standalone mode)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIOSStandalone = (window.navigator as any).standalone === true;
    
    if (isStandalone || isIOSStandalone) {
      setIsInstalled(true);
      return;
    }

    // Capture the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the default mini-infobar from appearing
      e.preventDefault();
      
      // Store the event for later use
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    // Listen for successful installation
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      
      // Track installation analytics
      trackPWAInstall('accepted');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Track PWA launch if in standalone mode
    trackPWALaunch();

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  /**
   * Trigger the install prompt
   * Requirements: 4.4, 4.5, 4.6
   */
  const promptInstall = async (): Promise<boolean> => {
    if (!deferredPrompt) {
      console.warn('Install prompt not available');
      return false;
    }

    try {
      // Show the install prompt
      await deferredPrompt.prompt();

      // Wait for the user's response
      const { outcome } = await deferredPrompt.userChoice;

      // Track user choice
      trackPWAInstall(outcome);

      if (outcome === 'accepted') {
        setIsInstalled(true);
        setIsInstallable(false);
      }

      // Clear the deferred prompt
      setDeferredPrompt(null);

      return outcome === 'accepted';
    } catch (error) {
      console.error('Error showing install prompt:', error);
      return false;
    }
  };

  return {
    isInstallable,
    isInstalled,
    promptInstall,
  };
};
