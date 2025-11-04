# Mobile Optimizations Guide

This document outlines the mobile optimizations implemented in the Election Cart Admin PWA.

## Overview

The admin panel has been optimized for mobile devices following PWA best practices and mobile-first design principles.

## Implemented Optimizations

### 1. Responsive Design (Requirement 8.1)

- **Breakpoints**: 320px (mobile), 768px (tablet), 1024px (desktop), 1280px+ (large desktop)
- **Fluid layouts**: All components adapt to screen sizes from 320px to 2560px
- **Safe area insets**: Support for notched devices (iPhone X+)
- **Container responsive classes**: Automatic width and padding adjustments

### 2. Touch-Friendly UI (Requirement 8.2)

- **Minimum tap target size**: 44x44px for all interactive elements
- **Touch utilities**:
  - `.touch-target`: 44x44px minimum size
  - `.touch-target-sm`: 36x36px for compact areas
  - `touch-manipulation`: Prevents double-tap zoom
- **Active states**: Visual feedback with scale transform (0.97)
- **Focus states**: Enhanced 2px outline for touch devices
- **Button sizing**:
  - Small: 36px min height
  - Medium: 44px min height (default)
  - Large: 48px min height

### 3. Viewport Configuration (Requirement 8.3)

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover" />
```

- **Initial scale**: 1.0 for proper rendering
- **Maximum scale**: 5.0 allows zoom for accessibility
- **Viewport fit**: Cover for notched devices
- **Format detection**: Disabled for phone numbers

### 4. Mobile Bandwidth Optimization (Requirement 8.4)

#### Resource Hints
- **Preconnect**: API domain for faster requests
- **DNS prefetch**: Reduces DNS lookup time

#### Image Optimization
- **Lazy loading**: Native browser lazy loading for all images
- **OptimizedImage component**: Custom component with:
  - Lazy loading by default
  - Eager loading option for above-the-fold images
  - Fallback images on error
  - Loading states with skeleton
  - Async decoding

#### Network-Aware Features
- **Slow network detection**: Reduces animations and shadows
- **Reduced motion support**: Respects user preferences
- **Hardware acceleration**: GPU-accelerated transforms

### 5. Typography Optimization (Requirement 8.6, 8.7)

- **Base font size**: 16px (prevents iOS zoom on input focus)
- **Text size adjustment**: Disabled to prevent unwanted scaling
- **Mobile font sizes**:
  - `mobile-xs`: 0.75rem (12px)
  - `mobile-sm`: 0.875rem (14px)
  - `mobile-base`: 1rem (16px)
  - `mobile-lg`: 1.125rem (18px)

### 6. Orientation Support (Requirement 8.10)

- **Portrait and landscape**: Full support for both orientations
- **Landscape optimizations**: Compact layout for landscape mobile (height < 500px)
- **Orientation detection**: `useOrientation()` hook
- **Dynamic classes**: Body classes for orientation-specific styling

## Custom Hooks

### useMobileOptimizations

Comprehensive hook that provides:

```typescript
const {
  orientation,        // 'portrait' | 'landscape'
  isStandalone,      // PWA installed
  networkType,       // 'slow' | 'fast' | 'unknown'
  prefersReducedMotion, // User preference
  viewportSize,      // { width, height }
  isTouchDevice,     // Touch support
  isSlowNetwork,     // Boolean
  isMobile,          // < 768px
  isTablet,          // 768-1023px
  isDesktop,         // >= 1024px
} = useMobileOptimizations();
```

### Individual Hooks

- `useOrientation()`: Detect device orientation
- `useIsStandalone()`: Check if PWA is installed
- `useNetworkType()`: Detect connection speed
- `usePrefersReducedMotion()`: User motion preferences
- `useViewportSize()`: Current viewport dimensions
- `useIsTouchDevice()`: Touch capability detection

## Components

### OptimizedImage

Lazy-loading image component with fallbacks:

```tsx
<OptimizedImage
  src="/path/to/image.jpg"
  alt="Description"
  eager={false}  // Set true for above-the-fold images
  fallbackSrc="/fallback.png"
  className="w-full h-48 object-cover"
/>
```

### MobileOptimizedLayout

Wrapper component that adds body classes for conditional styling:

- `orientation-portrait` / `orientation-landscape`
- `network-slow` / `network-fast`
- `prefers-reduced-motion`
- `touch-device` / `pointer-device`

## CSS Utilities

### Touch Utilities

```css
.touch-target          /* 44x44px minimum */
.touch-target-sm       /* 36x36px minimum */
.touch-manipulation    /* Prevents double-tap zoom */
.touch-feedback        /* Tap highlight color */
.no-select            /* Prevents text selection */
```

### Responsive Utilities

```css
.container-responsive  /* Auto-adjusting container */
.safe-area-top        /* Safe area inset top */
.safe-area-bottom     /* Safe area inset bottom */
.gpu-accelerated      /* Hardware acceleration */
```

## Testing Checklist

### Screen Sizes
- [ ] 320px (iPhone SE)
- [ ] 375px (iPhone 12/13)
- [ ] 390px (iPhone 14)
- [ ] 414px (iPhone Plus)
- [ ] 768px (iPad Portrait)
- [ ] 1024px (iPad Landscape)
- [ ] 1280px+ (Desktop)

### Devices
- [ ] iOS Safari (iPhone)
- [ ] iOS Safari (iPad)
- [ ] Chrome Android
- [ ] Samsung Internet
- [ ] Chrome Desktop
- [ ] Edge Desktop

### Orientations
- [ ] Portrait mode
- [ ] Landscape mode
- [ ] Orientation change handling

### Touch Interactions
- [ ] All buttons are 44x44px minimum
- [ ] Tap targets don't overlap
- [ ] Active states provide feedback
- [ ] No accidental double-tap zoom
- [ ] Swipe gestures work smoothly

### Performance
- [ ] Images lazy load
- [ ] Fast 3G performance acceptable
- [ ] Slow 2G shows reduced animations
- [ ] No layout shifts on load
- [ ] Smooth scrolling

## Best Practices

### For Developers

1. **Always use touch-friendly sizes**: Minimum 44x44px for interactive elements
2. **Test on real devices**: Emulators don't capture all touch behaviors
3. **Use OptimizedImage**: For all product/user images
4. **Consider network speed**: Use `useNetworkType()` for conditional features
5. **Respect user preferences**: Check `usePrefersReducedMotion()`
6. **Test both orientations**: Ensure layouts work in portrait and landscape

### For Designers

1. **Design for 320px first**: Mobile-first approach
2. **44x44px minimum**: All tap targets
3. **Adequate spacing**: Prevent accidental taps
4. **Readable text**: 16px minimum for body text
5. **High contrast**: Ensure visibility in bright sunlight
6. **Simple animations**: Reduce motion for performance

## Performance Metrics

Target metrics for mobile devices:

- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Time to Interactive (TTI)**: < 3.5s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **First Input Delay (FID)**: < 100ms

## Troubleshooting

### Issue: Inputs zoom on iOS
**Solution**: Ensure font-size is 16px or larger

### Issue: Double-tap zoom on buttons
**Solution**: Add `touch-action: manipulation`

### Issue: Layout shifts on orientation change
**Solution**: Use `useOrientation()` hook and test both orientations

### Issue: Images load slowly
**Solution**: Use `OptimizedImage` component with lazy loading

### Issue: Animations janky on mobile
**Solution**: Use `gpu-accelerated` class and check `prefersReducedMotion`

## Resources

- [MDN: Mobile Web Best Practices](https://developer.mozilla.org/en-US/docs/Web/Guide/Mobile)
- [Web.dev: Mobile Performance](https://web.dev/mobile/)
- [Apple: Designing for iOS](https://developer.apple.com/design/human-interface-guidelines/ios)
- [Material Design: Touch Targets](https://material.io/design/usability/accessibility.html#layout-and-typography)

## Maintenance

### Regular Checks

1. Test on new device releases
2. Update breakpoints if needed
3. Monitor performance metrics
4. Review user feedback
5. Update documentation

### Version History

- **v1.0.0** (2024-11): Initial mobile optimizations
  - Responsive design (320px-2560px)
  - Touch-friendly UI (44x44px targets)
  - Image lazy loading
  - Network-aware features
  - Orientation support
