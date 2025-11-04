import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'icons/*.png'],
      manifest: {
        name: 'Election Cart Admin',
        short_name: 'EC Admin',
        description: 'Admin panel for Election Cart - Order and staff management',
        start_url: '/',
        display: 'standalone',
        background_color: '#0D1117',
        theme_color: '#0D1117',
        orientation: 'portrait-primary',
        categories: ['business', 'productivity'],
        icons: [
          {
            src: '/icons/icon-72x72.png',
            sizes: '72x72',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icons/icon-96x96.png',
            sizes: '96x96',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icons/icon-144x144.png',
            sizes: '144x144',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icons/icon-152x152.png',
            sizes: '152x152',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        // Requirement 2.4: Configure precaching for app shell
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        
        // Requirement 2.9: Clean up old caches during activation
        cleanupOutdatedCaches: true,
        
        // Requirement 2.8: Skip waiting and claim clients immediately
        // Note: We set skipWaiting to false here to allow manual control via message
        skipWaiting: false,
        clientsClaim: true,
        
        // Configure runtime caching strategies for different resource types
        runtimeCaching: [
          // Requirement 2.2: Cache-first strategy for static assets (JS, CSS)
          {
            urlPattern: /\.(?:js|css)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'static-resources-v1',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days - Requirement 2.7
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          
          // Requirement 2.2: Cache-first strategy for images
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache-v1',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days - Requirement 2.7
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          
          // Requirement 2.2: Cache-first strategy for fonts
          {
            urlPattern: /\.(?:woff|woff2|ttf|eot)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'fonts-cache-v1',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 365 days - Requirement 2.7
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          
          // Cache-first for Google Fonts
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache-v1',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          
          // Cache-first for Google Fonts static resources
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-static-v1',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          
          // Requirement 2.3: Network-first strategy for API calls with cache fallback
          // Production API (onrender.com)
          {
            urlPattern: /^https:\/\/.*\.onrender\.com\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache-v1',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 5 // 5 minutes - Requirement 2.7
              },
              networkTimeoutSeconds: 10,
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          
          // Local development API
          {
            urlPattern: /^http:\/\/localhost:8000\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache-dev-v1',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 5 // 5 minutes
              },
              networkTimeoutSeconds: 10,
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          
          // Requirement 2.5: Cache navigation requests for offline access
          // Network-first for HTML pages
          {
            urlPattern: /\.(?:html)$/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'html-cache-v1',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 // 1 hour - Requirement 2.7
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          
          // Cache Firebase Storage images (if used)
          {
            urlPattern: /^https:\/\/firebasestorage\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'firebase-storage-v1',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ],
        
        // Requirement 2.6: Provide offline fallback page
        // Note: navigateFallback uses index.html as the app shell
        // The offline.html is served by the service worker when network fails
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api/],
        
        // Include offline.html in precache
        additionalManifestEntries: [
          { url: '/offline.html', revision: null }
        ],
        
        // Additional Workbox options
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB max file size
        
        // Requirement 7.4: Handle skip waiting message
        // This is automatically handled by Workbox when skipWaiting is false
        // and we send the SKIP_WAITING message from the client
      },
      devOptions: {
        enabled: false // Disable in development for easier debugging
      }
    })
  ],
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  build: {
    // Optimize build for PWA
    target: 'esnext',
    minify: 'terser',
    cssMinify: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          // Keep all React-related packages together to prevent hook issues
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Separate chart library
          'chart-vendor': ['recharts']
        }
      }
    }
  },
  // Ensure base path is correct for deployment
  base: '/'
})
