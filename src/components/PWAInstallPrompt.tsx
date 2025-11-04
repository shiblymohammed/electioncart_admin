import { useState, useEffect } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { trackPWAPromptShown } from '../utils/pwaAnalytics';

/**
 * PWA Install Prompt Component
 * Requirements: 4.1, 4.2, 4.4, 4.6, 4.7
 * 
 * Displays a custom install prompt for the PWA
 */

interface PWAInstallPromptProps {
  onInstall?: () => void;
  onDismiss?: () => void;
  variant?: 'banner' | 'button';
  className?: string;
}

const PWAInstallPrompt = ({
  onInstall,
  onDismiss,
  variant = 'banner',
  className = '',
}: PWAInstallPromptProps) => {
  const { isInstallable, isInstalled, promptInstall } = usePWAInstall();
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Check if user has dismissed the banner before
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    const dismissedTime = dismissed ? parseInt(dismissed, 10) : 0;
    const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);

    // Show banner if installable and not dismissed in the last 7 days
    if (isInstallable && !isInstalled && daysSinceDismissed > 7) {
      // Delay showing banner by 3 seconds for better UX
      const timer = setTimeout(() => {
        setShowBanner(true);
        trackPWAPromptShown('banner');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isInstallable, isInstalled]);

  const handleInstall = async () => {
    setIsInstalling(true);

    try {
      const accepted = await promptInstall();

      if (accepted) {
        setShowBanner(false);
        onInstall?.();
      }
    } catch (error) {
      console.error('Installation error:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    onDismiss?.();
  };

  // Don't render if not installable or already installed
  if (!isInstallable || isInstalled) {
    return null;
  }

  // Button variant (for TopBar/Sidebar)
  if (variant === 'button') {
    return (
      <button
        onClick={handleInstall}
        disabled={isInstalling}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg
          bg-primary/10 text-primary hover:bg-primary/20
          border border-primary/30 hover:border-primary/50
          transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
        aria-label="Install app"
        title="Install Election Cart Admin"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        <span className="text-sm font-medium hidden sm:inline">
          {isInstalling ? 'Installing...' : 'Install App'}
        </span>
      </button>
    );
  }

  // Banner variant
  if (!showBanner) {
    return null;
  }

  return (
    <div
      className={`
        fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96
        bg-dark-surface border border-primary/30 rounded-lg shadow-card
        p-4 z-50 animate-slide-up
        ${className}
      `}
      role="dialog"
      aria-labelledby="pwa-install-title"
      aria-describedby="pwa-install-description"
    >
      <div className="flex items-start gap-3">
        {/* App Icon */}
        <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0 shadow-glow-primary">
          <span className="text-white font-bold text-xl">EC</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3
            id="pwa-install-title"
            className="text-text font-semibold text-base mb-1"
          >
            Install Election Cart Admin
          </h3>
          <p
            id="pwa-install-description"
            className="text-text-muted text-sm mb-3"
          >
            Install our app for quick access and offline functionality
          </p>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleInstall}
              disabled={isInstalling}
              className="
                px-4 py-2 bg-primary text-primary-content rounded-lg
                hover:bg-primary-hover transition-colors
                text-sm font-medium
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {isInstalling ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
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
                  Installing...
                </span>
              ) : (
                'Install'
              )}
            </button>
            <button
              onClick={handleDismiss}
              className="
                px-4 py-2 text-text-muted hover:text-text
                transition-colors text-sm font-medium
              "
            >
              Not now
            </button>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="
            p-1 rounded-lg text-text-muted hover:text-text
            hover:bg-dark-hover transition-colors flex-shrink-0
          "
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  );
};

export default PWAInstallPrompt;
