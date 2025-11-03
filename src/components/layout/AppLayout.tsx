import { ReactNode } from 'react';
import { useSidebar } from '../../context/SidebarContext';
import { useIsMobile } from '../../hooks/useMediaQuery';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { BreadcrumbItem } from '../../types/ui.types';

interface AppLayoutProps {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
}

const AppLayout = ({ children, breadcrumbs = [], className = '' }: AppLayoutProps) => {
  const { isCollapsed } = useSidebar();
  const isMobile = useIsMobile();

  // Calculate main content margin based on sidebar state
  const mainMargin = isMobile ? 'ml-0' : isCollapsed ? 'ml-20' : 'ml-64';

  return (
    <div className="min-h-screen bg-dark">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className={`transition-all duration-300 ${mainMargin}`}>
        {/* Top bar */}
        <TopBar breadcrumbs={breadcrumbs} />

        {/* Page content */}
        <main className={`p-6 ${className}`}>
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
