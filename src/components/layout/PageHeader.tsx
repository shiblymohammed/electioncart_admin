import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
}

const PageHeader = ({ title, subtitle, actions, className = '' }: PageHeaderProps) => {
  return (
    <div className={`mb-6 animate-fade-in-up ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold text-text mb-2">{title}</h1>
          {subtitle && <p className="text-text-muted">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
};

export default PageHeader;
