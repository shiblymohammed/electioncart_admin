/**
 * Constants for the admin panel
 */

/**
 * Responsive breakpoints (in pixels)
 */
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

/**
 * Animation durations (in milliseconds)
 */
export const animationDuration = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

/**
 * Spacing scale (in rem)
 */
export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
} as const;

/**
 * Order status options
 */
export const orderStatuses = [
  { value: 'pending_payment', label: 'Pending Payment', color: 'warning' },
  { value: 'pending_resources', label: 'Pending Resources', color: 'warning' },
  { value: 'ready_for_processing', label: 'Ready for Processing', color: 'info' },
  { value: 'assigned', label: 'Assigned', color: 'info' },
  { value: 'in_progress', label: 'In Progress', color: 'info' },
  { value: 'completed', label: 'Completed', color: 'success' },
] as const;

/**
 * User roles
 */
export const userRoles = [
  { value: 'user', label: 'User' },
  { value: 'staff', label: 'Staff' },
  { value: 'admin', label: 'Admin' },
] as const;

/**
 * Sidebar width (in pixels)
 */
export const sidebarWidth = {
  expanded: 260,
  collapsed: 80,
} as const;

/**
 * Toast auto-dismiss duration (in milliseconds)
 */
export const toastDuration = {
  success: 3000,
  error: 5000,
  warning: 4000,
  info: 4000,
} as const;

/**
 * Debounce delay for search (in milliseconds)
 */
export const searchDebounceDelay = 300;

/**
 * Pagination page size
 */
export const pageSize = 20;
