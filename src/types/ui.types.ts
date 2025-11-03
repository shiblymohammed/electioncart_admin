/**
 * UI Component Type Definitions
 */

// Button variants
export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

// Badge variants
export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'default';
export type BadgeSize = 'sm' | 'md' | 'lg';

// Toast notification
export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration: number;
}

// Sidebar state
export interface SidebarState {
  isCollapsed: boolean;
  isMobileOpen: boolean;
}

// Search result
export interface SearchResult {
  type: 'order' | 'user' | 'product' | 'staff';
  id: number;
  title: string;
  subtitle?: string;
  path: string;
}

// Filter state for orders
export interface OrderFilters {
  status?: string[];
  assignedTo?: number;
  dateRange?: {
    start: Date;
    end: Date;
  };
  amountRange?: {
    min: number;
    max: number;
  };
  search?: string;
}

// Navigation item
export interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  badge?: number;
  adminOnly?: boolean;
}

// Breadcrumb item
export interface BreadcrumbItem {
  label: string;
  path?: string;
}

// Table column definition
export interface TableColumn<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
}

// Modal size
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

// Card padding
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

// Stat card trend
export interface StatTrend {
  value: number;
  isPositive: boolean;
}

// Color variants for components
export type ColorVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';

// Loading state
export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
}

// Empty state props
export interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  illustration?: React.ReactNode;
}

// View mode for lists
export type ViewMode = 'table' | 'grid' | 'kanban';
