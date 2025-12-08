
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',

      // These will be copied to /dist and cached for your PWA
      includeAssets: [
        'favicon.png',
        'robots.txt',
        'icons/icon-72.png',
        'icons/icon-192.png',
        'icons/icon-256.png',
        'icons/icon-512.png',
        'icons/icon-maskable-192.png'
      ],

      // Your app's manifest
      manifest: {
        name: 'Agro-Suvidha',
        short_name: 'Agro',
        description: 'Farming assistant',
        start_url: '/',
        display: 'standalone',
        theme_color: '#4CAF50',
        background_color: '#ffffff',

        icons: [
          {
            src: '/icons/icon-72.png',
            sizes: '72x72',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-256.png',
            sizes: '256x256',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icons/icon-maskable-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },

      // Offline caching rules
      workbox: {
        runtimeCaching: [
          {
            // Weather API cache strategy
            urlPattern: /^https:\/\/api\.weatherapi\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'weather-api-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 30 // 30 minutes
              }
            }
          },
          {
            // Image caching
            urlPattern: /.*\.(png|jpg|jpeg|svg|gif|webp)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          },
          {
            // JS + CSS caching
            urlPattern: /.*\.(js|css)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-resources'
            }
          }
        ]
      }
    })
  ]
});