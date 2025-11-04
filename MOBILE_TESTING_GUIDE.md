# Mobile Testing Guide

This guide provides instructions for testing the mobile optimizations implemented in the Election Cart Admin PWA.

## Quick Test Checklist

### 1. Responsive Design Testing (Requirement 8.1)

#### Chrome DevTools
1. Open Chrome DevTools (F12)
2. Click "Toggle device toolbar" (Ctrl+Shift+M)
3. Test these screen sizes:
   - [ ] 320px (iPhone SE)
   - [ ] 375px (iPhone 12/13)
   - [ ] 390px (iPhone 14 Pro)
   - [ ] 414px (iPhone Plus)
   - [ ] 768px (iPad)
   - [ ] 1024px (iPad Pro)
   - [ ] 1280px (Desktop)
   - [ ] 2560px (Large Desktop)

#### What to Check
- [ ] No horizontal scrolling
- [ ] All content is visible
- [ ] Text is readable (not too small)
- [ ] Images scale properly
- [ ] Buttons are accessible
- [ ] Navigation works smoothly

### 2. Touch-Friendly UI Testing (Requirement 8.2)

#### Minimum Tap Target Size
1. Open browser DevTools
2. Inspect interactive elements (buttons, links)
3. Verify minimum sizes:
   - [ ] Buttons: 44x44px minimum
   - [ ] Links: 44x44px minimum
   - [ ] Icons: 44x44px minimum
   - [ ] Form inputs: 44px height minimum

#### Touch Interactions
On a real touch device:
- [ ] Tap buttons - should have visual feedback
- [ ] Tap links - should activate without delay
- [ ] No accidental double-tap zoom
- [ ] Active states show scale effect
- [ ] Focus states are visible

### 3. Viewport Meta Tags Testing (Requirement 8.3)

#### Verify in HTML
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover" />
```

#### Test Behavior
- [ ] Page loads at correct zoom level
- [ ] User can zoom in (up to 5x)
- [ ] No unwanted zoom on input focus (iOS)
- [ ] Safe areas respected on notched devices

### 4. Mobile Bandwidth Optimization (Requirement 8.4)

#### Network Throttling Test
1. Open Chrome DevTools > Network tab
2. Set throttling to "Slow 3G"
3. Reload the page
4. Verify:
   - [ ] Images lazy load
   - [ ] Reduced animations on slow network
   - [ ] Page is still usable
   - [ ] No layout shifts

#### Image Optimization
- [ ] Images use lazy loading
- [ ] Fallback images work
- [ ] Loading states show
- [ ] Images decode asynchronously

#### Resource Hints
Check in HTML:
- [ ] Preconnect to API domain
- [ ] DNS prefetch configured

### 5. iOS Testing (Requirement 8.6)

#### Safari iOS
- [ ] Install PWA from Safari
- [ ] Test in standalone mode
- [ ] Verify status bar style
- [ ] Check safe area insets
- [ ] Test orientation changes
- [ ] Verify no input zoom

#### iOS-Specific Checks
- [ ] Apple touch icons present
- [ ] Web app capable meta tag
- [ ] Status bar style correct
- [ ] No phone number auto-detection

### 6. Typography Testing (Requirement 8.7)

#### Font Sizes
- [ ] Body text: 16px minimum
- [ ] Headings: Properly scaled
- [ ] Buttons: 16px minimum
- [ ] Form inputs: 16px (prevents iOS zoom)

#### Readability
- [ ] Text is legible on small screens
- [ ] Line height is comfortable
- [ ] Contrast is sufficient
- [ ] No text overflow

### 7. Orientation Testing (Requirement 8.10)

#### Portrait Mode
- [ ] Layout works correctly
- [ ] All content accessible
- [ ] Navigation functional
- [ ] Images display properly

#### Landscape Mode
- [ ] Layout adapts
- [ ] Sidebar adjusts (if applicable)
- [ ] Content remains accessible
- [ ] No layout breaks

#### Orientation Change
- [ ] Smooth transition
- [ ] No content loss
- [ ] State preserved
- [ ] No layout shifts

## Device-Specific Testing

### iPhone (iOS Safari)
```
Devices to test:
- iPhone SE (320px)
- iPhone 12/13 (375px)
- iPhone 14 Pro (390px)
- iPhone 14 Pro Max (430px)
```

Test:
- [ ] PWA installation
- [ ] Touch interactions
- [ ] Orientation changes
- [ ] Safe area insets
- [ ] Input focus (no zoom)

### Android (Chrome)
```
Devices to test:
- Small phone (360px)
- Medium phone (412px)
- Large phone (480px)
```

Test:
- [ ] PWA installation
- [ ] Touch interactions
- [ ] Orientation changes
- [ ] Back button behavior
- [ ] Share functionality

### iPad (iOS Safari)
```
Devices to test:
- iPad (768px)
- iPad Pro (1024px)
```

Test:
- [ ] Tablet layout
- [ ] Split view support
- [ ] Keyboard interactions
- [ ] Pencil support (if applicable)

## Automated Testing

### Lighthouse Mobile Audit
```bash
# Run Lighthouse in Chrome DevTools
1. Open DevTools
2. Go to Lighthouse tab
3. Select "Mobile" device
4. Run audit
```

Target Scores:
- [ ] Performance: 90+
- [ ] Accessibility: 95+
- [ ] Best Practices: 95+
- [ ] SEO: 90+
- [ ] PWA: 100

### Manual Performance Testing
```bash
# Test on Slow 3G
1. DevTools > Network > Slow 3G
2. Measure load time
3. Check for layout shifts
4. Verify lazy loading
```

Targets:
- [ ] FCP < 1.5s
- [ ] LCP < 2.5s
- [ ] TTI < 3.5s
- [ ] CLS < 0.1

## Common Issues and Solutions

### Issue: Inputs zoom on iOS
**Cause**: Font size < 16px
**Solution**: Ensure all inputs use 16px font size

### Issue: Double-tap zoom on buttons
**Cause**: Missing touch-action
**Solution**: Add `touch-action: manipulation`

### Issue: Layout shifts on load
**Cause**: Images without dimensions
**Solution**: Use OptimizedImage component

### Issue: Slow performance on mobile
**Cause**: Too many animations
**Solution**: Check network type and reduce animations

### Issue: Content cut off on notched devices
**Cause**: Missing safe area insets
**Solution**: Use safe-area-* classes

## Testing Tools

### Browser DevTools
- Chrome DevTools (Device Mode)
- Firefox Responsive Design Mode
- Safari Web Inspector

### Online Tools
- [BrowserStack](https://www.browserstack.com/) - Real device testing
- [LambdaTest](https://www.lambdatest.com/) - Cross-browser testing
- [PageSpeed Insights](https://pagespeed.web.dev/) - Performance testing

### Mobile Testing Apps
- Chrome Remote Debugging (Android)
- Safari Web Inspector (iOS)
- Xcode Simulator (iOS)
- Android Studio Emulator (Android)

## Reporting Issues

When reporting mobile issues, include:

1. **Device**: Model and OS version
2. **Browser**: Name and version
3. **Screen size**: Width x Height
4. **Orientation**: Portrait or Landscape
5. **Network**: WiFi, 4G, 3G, etc.
6. **Steps to reproduce**: Detailed steps
7. **Expected behavior**: What should happen
8. **Actual behavior**: What actually happens
9. **Screenshots**: If applicable

## Continuous Testing

### Before Each Release
- [ ] Test on iOS Safari
- [ ] Test on Chrome Android
- [ ] Run Lighthouse audit
- [ ] Check all breakpoints
- [ ] Verify touch targets
- [ ] Test orientation changes

### Monthly Checks
- [ ] Test on new device releases
- [ ] Update breakpoints if needed
- [ ] Review performance metrics
- [ ] Check user feedback
- [ ] Update documentation

## Resources

- [Chrome DevTools Device Mode](https://developer.chrome.com/docs/devtools/device-mode/)
- [Safari Web Inspector](https://developer.apple.com/safari/tools/)
- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)
- [Can I Use](https://caniuse.com/) - Browser compatibility
- [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly) - Google's tool
