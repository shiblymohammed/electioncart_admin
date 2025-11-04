# Offline Indicator Testing Guide

## Overview
This document provides instructions for manually testing the offline indicator functionality implemented in Task 7 of the PWA conversion.

## Components Tested
- `useOnlineStatus` hook (`src/hooks/useOnlineStatus.ts`)
- `OfflineIndicator` component (`src/components/ui/OfflineIndicator.tsx`)

## Requirements Covered
- **3.5**: WHEN the user is offline, THE System SHALL show an offline indicator in the UI
- **3.6**: WHEN the user attempts to perform write operations offline, THE System SHALL queue the requests
- **3.7**: WHEN the user regains connectivity, THE System SHALL sync queued requests automatically

## Test Scenarios

### Test 1: Offline Indicator Display
**Steps:**
1. Open the application in a browser
2. Open Chrome DevTools (F12)
3. Go to Network tab
4. Check "Offline" checkbox to simulate offline mode
5. Observe the top of the page

**Expected Result:**
- A yellow/warning banner should appear at the top of the page
- Banner should display "You're offline • Viewing cached data"
- Banner should have an offline icon with a pulse animation
- Banner should have an info icon with tooltip

**Status:** ⬜ Not Tested | ✅ Pass | ❌ Fail

---

### Test 2: Online Status Detection
**Steps:**
1. With the offline indicator visible (from Test 1)
2. In Chrome DevTools Network tab
3. Uncheck the "Offline" checkbox to go back online
4. Observe the offline indicator

**Expected Result:**
- The offline indicator banner should disappear immediately
- No errors in the console
- Application should function normally

**Status:** ⬜ Not Tested | ✅ Pass | ❌ Fail

---

### Test 3: Reconnection Handling
**Steps:**
1. Start with the application online
2. Navigate to different pages (Orders, Staff, etc.)
3. Go offline (DevTools Network > Offline)
4. Try to navigate or interact with the app
5. Go back online
6. Observe behavior

**Expected Result:**
- Offline indicator appears when going offline
- Cached pages should still be viewable
- When going back online, indicator disappears
- Application resumes normal functionality

**Status:** ⬜ Not Tested | ✅ Pass | ❌ Fail

---

### Test 4: Accessibility
**Steps:**
1. Go offline to show the indicator
2. Use a screen reader (NVDA, JAWS, or VoiceOver)
3. Navigate to the offline indicator
4. Check keyboard navigation

**Expected Result:**
- Screen reader announces "You're offline" alert
- Banner has proper ARIA attributes (role="alert", aria-live="polite")
- Tooltip is accessible via keyboard
- All interactive elements are keyboard accessible

**Status:** ⬜ Not Tested | ✅ Pass | ❌ Fail

---

### Test 5: Visual Design
**Steps:**
1. Go offline to show the indicator
2. Check the visual appearance
3. Test on different screen sizes (mobile, tablet, desktop)

**Expected Result:**
- Banner is fixed at the top of the page (z-index: 50)
- Background is warning color with backdrop blur
- Text is readable and properly styled
- Responsive design works on all screen sizes
- On mobile, only shows "You're offline" (hides "Viewing cached data")

**Status:** ⬜ Not Tested | ✅ Pass | ❌ Fail

---

### Test 6: Multiple Tabs
**Steps:**
1. Open the application in two browser tabs
2. In one tab, go offline (DevTools)
3. Observe both tabs

**Expected Result:**
- Each tab independently detects online/offline status
- Offline indicator appears in the tab that went offline
- Other tab remains unaffected

**Status:** ⬜ Not Tested | ✅ Pass | ❌ Fail

---

## Browser Compatibility Testing

Test the offline indicator on the following browsers:

| Browser | Version | Status |
|---------|---------|--------|
| Chrome Desktop | Latest | ⬜ |
| Edge Desktop | Latest | ⬜ |
| Firefox Desktop | Latest | ⬜ |
| Safari Desktop | Latest | ⬜ |
| Chrome Mobile (Android) | Latest | ⬜ |
| Safari Mobile (iOS) | Latest | ⬜ |

---

## Known Limitations

1. The offline indicator only shows when the browser detects offline status
2. Some API calls may fail before the offline indicator appears
3. The indicator does not show network quality (slow connection vs offline)

---

## Implementation Details

### Hook: useOnlineStatus
- Location: `src/hooks/useOnlineStatus.ts`
- Returns: `boolean` (true = online, false = offline)
- Uses: `navigator.onLine` API and window online/offline events

### Component: OfflineIndicator
- Location: `src/components/ui/OfflineIndicator.tsx`
- Uses: `useOnlineStatus` hook
- Renders: Fixed banner at top of page when offline
- Features:
  - Pulse animation on offline icon
  - Tooltip with additional information
  - Responsive design
  - Accessibility support (ARIA labels, screen reader support)

### Integration Points
- `App.tsx`: Renders OfflineIndicator at root level
- `AppLayout.tsx`: Also includes OfflineIndicator for layout consistency

---

## Troubleshooting

### Issue: Offline indicator doesn't appear
**Solution:**
1. Check browser console for errors
2. Verify `useOnlineStatus` hook is imported correctly
3. Ensure DevTools Network tab "Offline" is checked
4. Try refreshing the page

### Issue: Indicator doesn't disappear when back online
**Solution:**
1. Check if event listeners are properly attached
2. Verify no JavaScript errors in console
3. Try manually triggering online event: `window.dispatchEvent(new Event('online'))`

### Issue: Styling issues
**Solution:**
1. Verify Tailwind CSS is properly configured
2. Check for CSS conflicts with z-index
3. Ensure custom colors (warning, dark) are defined in tailwind.config

---

## Next Steps

After testing is complete:
1. Document any issues found
2. Create bug reports for failures
3. Update this document with test results
4. Proceed to next task in the PWA conversion plan

---

## Test Results Summary

**Date Tested:** _____________

**Tester:** _____________

**Overall Status:** ⬜ Pass | ⬜ Fail | ⬜ Partial

**Notes:**
