/**
 * Custom Service Worker code
 * This file is injected into the generated service worker
 * Requirements: 7.4, 7.6 - Handle skip waiting and reload
 */

// Listen for messages from the client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    // Skip waiting and activate the new service worker immediately
    self.skipWaiting();
  }
});

// Log service worker lifecycle events for debugging
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated');
  // Claim all clients immediately
  event.waitUntil(self.clients.claim());
});
