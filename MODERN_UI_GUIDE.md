# Modern UI Quick Reference Guide

## 🎨 Using the New Design System

### Import Components
```tsx
// Layout
import AppLayout from './components/layout/AppLayout';
import PageHeader from './components/layout/PageHeader';

// UI Components
import { Button, Card, Badge, StatCard, LoadingSpinner, EmptyState } from './components/ui';

// Hooks
import { useToast, useDebounce, useMediaQuery } from './hooks';

// Utils
import { formatDate, formatCurrency, formatStatus } from './utils/formatters';
```

### Create a New Page
```tsx
import AppLayout from '../components/layout/AppLayout';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';

const MyPage = () => {
  return (
    <AppLayout breadcrumbs={[{ label: 'My Page' }]}>
      <PageHeader 
        title="Page Title" 
        subtitle="Description"
        actions={<Button>Action</Button>}
      />
      
      <Card>
        {/* Your content */}
      </Card>
    </AppLayout>
  );
};
```

### Button Variants
```tsx
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="accent">Accent</Button>
<Button variant="danger">Danger</Button>
<Button variant="ghost">Ghost</Button>

// With icons and loading
<Button leftIcon={<Icon />} isLoading={loading}>
  Submit
</Button>
```

### Cards
```tsx
// Basic card
<Card>Content</Card>

// Hoverable with glow
<Card hoverable glowOnHover>
  Interactive content
</Card>

// Custom padding
<Card padding="lg">Large padding</Card>
```

### Badges
```tsx
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="danger">Error</Badge>
<Badge variant="info">Info</Badge>

// With pulse animation
<Badge variant="success" pulse>Live</Badge>
```

### Toast Notifications
```tsx
const { showSuccess, showError, showWarning, showInfo } = useToast();

showSuccess('Operation completed!');
showError('Something went wrong');
showWarning('Please review');
showInfo('New update available');
```

### Loading States
```tsx
// Spinner
<LoadingSpinner size="xl" color="primary" />

// Empty state
<EmptyState
  title="No items"
  message="Items will appear here"
  actionLabel="Add Item"
  onAction={() => {}}
/>
```

### Stat Cards
```tsx
<StatCard
  label="Total Orders"
  value={150}
  color="primary"
  icon={<Icon />}
  trend={{ value: 12, isPositive: true }}
  onClick={() => navigate('/orders')}
/>
```

## 🎯 Color Classes

### Background
- `bg-dark` - Main background
- `bg-dark-surface` - Card background
- `bg-dark-hover` - Hover state

### Text
- `text-text` - Primary text
- `text-text-muted` - Secondary text

### Borders
- `border-dark-border` - Standard border

### Brand Colors
- `bg-primary`, `text-primary`
- `bg-secondary`, `text-secondary`
- `bg-accent`, `text-accent`
- `bg-success`, `text-success`
- `bg-warning`, `text-warning`
- `bg-danger`, `text-danger`

## ✨ Animations

### CSS Classes
- `animate-fade-in-up` - Fade in from bottom
- `animate-pulse-status` - Pulse effect
- `animate-glow-primary` - Glow effect
- `animate-float-gentle` - Floating animation

### Transitions
- `transition-all duration-300` - Smooth transition
- `hover:scale-105` - Scale on hover
- `hover:shadow-card-hover` - Shadow on hover

## 📱 Responsive Classes

### Breakpoints
- `sm:` - 640px+
- `md:` - 768px+
- `lg:` - 1024px+
- `xl:` - 1280px+

### Example
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Responsive grid */}
</div>
```

## 🔧 Utility Hooks

### useDebounce
```tsx
const [search, setSearch] = useState('');
const debouncedSearch = useDebounce(search, 300);

useEffect(() => {
  // API call with debounced value
}, [debouncedSearch]);
```

### useMediaQuery
```tsx
const isMobile = useIsMobile(); // < 768px
const isTablet = useIsTablet(); // 768-1024px
const isDesktop = useIsDesktop(); // > 1024px
```

### useKeyboardShortcut
```tsx
useKeyboardShortcut('k', () => {
  // Handle Ctrl+K
}, { ctrl: true });

useEscapeKey(() => {
  // Handle ESC key
});
```

## 🎨 Design Tokens

### Spacing
- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `2xl`: 48px

### Border Radius
- `rounded-card`: 1rem (cards)
- `rounded-btn`: 0.5rem (buttons)
- `rounded-pill`: 9999px (badges)

### Shadows
- `shadow-card` - Card shadow
- `shadow-card-hover` - Hover shadow
- `shadow-glow-primary` - Primary glow
- `shadow-glow-accent` - Accent glow

## 📝 Best Practices

1. **Always use AppLayout** for consistent layout
2. **Use PageHeader** for page titles
3. **Show loading states** with LoadingSpinner
4. **Handle empty states** with EmptyState
5. **Use toast notifications** for feedback
6. **Apply hover effects** for interactivity
7. **Follow responsive patterns** with breakpoints
8. **Use semantic colors** (success, warning, danger)
9. **Add animations** for smooth UX
10. **Test on mobile** devices

## 🚀 Quick Start Checklist

- [ ] Import AppLayout and PageHeader
- [ ] Add breadcrumbs for navigation
- [ ] Use Card components for content
- [ ] Add loading states
- [ ] Handle empty states
- [ ] Use toast for notifications
- [ ] Apply hover effects
- [ ] Test responsive design
- [ ] Check accessibility
- [ ] Verify animations work

---

**Happy coding with the modern UI!** 🎉
