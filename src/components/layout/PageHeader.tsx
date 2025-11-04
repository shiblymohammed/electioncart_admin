import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
  mobileLayout?: 'stack' | 'wrap'; // How to layout on mobile
}

const PageHeader = ({ 
  title, 
  subtitle, 
  actions, 
  className = '',
  mobileLayout = 'stack'
}: PageHeaderProps) => {
  return (
    <div className={`mb-4 sm:mb-6 animate-fade-in-up ${className}`}>
      {/* Mobile: Stack layout */}
      {mobileLayout === 'stack' ? (
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* Title section */}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text mb-1 sm:mb-2 truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="text-mobile-sm sm:text-sm text-text-muted truncate">
                {subtitle}
              </p>
            )}
          </div>
          
          {/* Actions section - full width on mobile */}
          {actions && (
            <div className="w-full">
              {actions}
            </div>
          )}
        </div>
      ) : (
        /* Wrap layout - actions wrap below title on small screens */
        <div className="flex flex-wrap items-start justify-between gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text mb-1 sm:mb-2 truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="text-mobile-sm sm:text-sm text-text-muted truncate">
                {subtitle}
              </p>
            )}
          </div>
          {actions && (
            <div className="w-full sm:w-auto flex-shrink-0">
              {actions}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
