import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSidebar } from '../../context/SidebarContext';
import { useIsMobile } from '../../hooks/useMediaQuery';
import { NavItem } from '../../types/ui.types';

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className = '' }: SidebarProps) => {
  const { user, logout } = useAuth();
  const { isCollapsed, isMobileOpen, toggleSidebar, closeMobileSidebar } = useSidebar();
  const location = useLocation();
  const isMobile = useIsMobile();

  // Navigation items
  const navItems: NavItem[] = [
    {
      label: 'Dashboard',
      icon: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      path: '/',
    },
    {
      label: 'Orders',
      icon: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      path: '/orders',
    },
    {
      label: 'Staff',
      icon: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      path: '/staff',
      adminOnly: true,
    },
    {
      label: 'Users',
      icon: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      path: '/users',
      adminOnly: true,
    },
    {
      label: 'Products',
      icon: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      path: '/products',
      adminOnly: true,
    },
    {
      label: 'Analytics',
      icon: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      path: '/analytics',
      adminOnly: true,
    },
  ];

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter(
    (item) => !item.adminOnly || user?.role === 'admin'
  );

  // Check if route is active
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Handle mobile backdrop click
  const handleBackdropClick = () => {
    if (isMobile) {
      closeMobileSidebar();
    }
  };

  // Sidebar width classes
  const sidebarWidth = isCollapsed ? 'w-20' : 'w-64';
  const mobileTransform = isMobileOpen ? 'translate-x-0' : '-translate-x-full';

  return (
    <>
      {/* Mobile backdrop */}
      {isMobile && isMobileOpen && (
        <div
          className="fixed inset-0 bg-dark/80 backdrop-blur-sm z-40 md:hidden"
          onClick={handleBackdropClick}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-full bg-dark-surface border-r border-dark-border
          transition-all duration-300 z-50
          ${isMobile ? `${mobileTransform} w-64` : sidebarWidth}
          ${className}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex items-center justify-between p-6 border-b border-dark-border">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow-primary animate-float-gentle">
                <span className="text-white font-bold text-xl">EC</span>
              </div>
              {!isCollapsed && (
                <span className="text-text font-bold text-lg whitespace-nowrap">
                  Election Cart
                </span>
              )}
            </Link>
            
            {/* Collapse button (desktop only) */}
            {!isMobile && (
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg hover:bg-dark-hover transition-colors text-text-muted hover:text-text"
                aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={isCollapsed ? 'M9 5l7 7-7 7' : 'M15 19l-7-7 7-7'}
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto py-6 px-3">
            <ul className="space-y-2">
              {filteredNavItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => isMobile && closeMobileSidebar()}
                      className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-lg
                        transition-all duration-200
                        ${
                          active
                            ? 'bg-primary/10 text-primary shadow-glow-primary border border-primary/30'
                            : 'text-text-muted hover:text-text hover:bg-dark-hover'
                        }
                        ${isCollapsed ? 'justify-center' : ''}
                      `}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!isCollapsed && (
                        <span className="font-medium">{item.label}</span>
                      )}
                      {!isCollapsed && item.badge && (
                        <span className="ml-auto bg-danger text-danger-content text-xs font-bold px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Profile Section */}
          <div className="p-4 border-t border-dark-border">
            <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold flex-shrink-0">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-text font-medium text-sm truncate">
                    {user?.username || 'User'}
                  </p>
                  <p className="text-text-muted text-xs capitalize">{user?.role || 'user'}</p>
                </div>
              )}
            </div>
            
            {!isCollapsed && (
              <button
                onClick={logout}
                className="w-full mt-3 px-3 py-2 bg-danger/10 text-danger hover:bg-danger/20 rounded-lg transition-colors text-sm font-medium"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
