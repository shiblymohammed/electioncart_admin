import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSidebar } from '../../context/SidebarContext';
import { useIsMobile } from '../../hooks/useMediaQuery';
import Breadcrumbs from './Breadcrumbs';
import GlobalSearch from './GlobalSearch';
import NotificationBell from './NotificationBell';
import PWAInstallPrompt from '../PWAInstallPrompt';
import CacheStatusDisplay from '../ui/CacheStatusDisplay';
import { BreadcrumbItem } from '../../types/ui.types';

interface TopBarProps {
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
}

const TopBar = ({ breadcrumbs = [], className = '' }: TopBarProps) => {
  const { user, logout } = useAuth();
  const { openMobileSidebar } = useSidebar();
  const isMobile = useIsMobile();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header
      className={`sticky top-0 z-30 bg-dark-surface/80 backdrop-blur-lg border-b border-dark-border ${className}`}
    >
      <div className="flex items-center justify-between px-4 py-3 gap-4">
        {/* Left section */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Mobile menu button - Requirement 8.2: Touch-friendly UI */}
          {isMobile && (
            <button
              onClick={openMobileSidebar}
              className="p-2 rounded-lg hover:bg-dark-hover transition-colors text-text-muted hover:text-text min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation active:scale-95"
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          )}

          {/* Breadcrumbs */}
          {!isMobile && breadcrumbs.length > 0 && (
            <Breadcrumbs items={breadcrumbs} className="flex-1 min-w-0" />
          )}
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          {/* Global Search */}
          {!isMobile && <GlobalSearch />}

          {/* Cache Status */}
          {!isMobile && <CacheStatusDisplay />}

          {/* PWA Install Button */}
          <PWAInstallPrompt variant="button" />

          {/* Notifications */}
          <NotificationBell />

          {/* User menu - Requirement 8.2: Touch-friendly UI */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-dark-hover transition-colors min-h-[44px] touch-manipulation active:scale-95"
              aria-label="User menu"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold text-sm">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              {!isMobile && (
                <span className="text-text text-sm font-medium">{user?.username}</span>
              )}
              <svg
                className={`w-4 h-4 text-text-muted transition-transform ${
                  isUserMenuOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* User menu dropdown */}
            {isUserMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsUserMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-dark-surface border border-dark-border rounded-lg shadow-card z-50">
                  <div className="p-4 border-b border-dark-border">
                    <p className="text-text font-medium">{user?.username}</p>
                    <p className="text-text-muted text-sm capitalize">{user?.role}</p>
                  </div>
                  <div className="py-2">
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-2 text-text hover:bg-dark-hover transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center gap-3 px-4 py-2 text-text hover:bg-dark-hover transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Settings
                    </Link>
                  </div>
                  <div className="border-t border-dark-border py-2">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                      className="flex items-center gap-3 px-4 py-2 text-danger hover:bg-danger/10 transition-colors w-full"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
