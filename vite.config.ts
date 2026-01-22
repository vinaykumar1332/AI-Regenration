import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vendor chunks
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/react-router-dom')) {
            return 'vendor-router';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons';
          }
          if (id.includes('node_modules/sonner')) {
            return 'vendor-sonner';
          }
          if (id.includes('node_modules/framer-motion')) {
            return 'vendor-motion';
          }
          if (id.includes('node_modules/clsx')) {
            return 'vendor-utils';
          }
          
          // UI Components chunk
          if (id.includes('/src/app/components/ui/')) {
            return 'ui-components';
          }
          
          // Page chunks
          if (id.includes('/src/app/pages/ImageGenerationPage/')) {
            return 'page-image';
          }
          if (id.includes('/src/app/pages/VideoGenerationPage/')) {
            return 'page-video';
          }
          if (id.includes('/src/app/pages/AvatarGenerationPage/')) {
            return 'page-avatar';
          }
          if (id.includes('/src/app/pages/BulkGenerationPage/')) {
            return 'page-bulk';
          }
          if (id.includes('/src/app/pages/FailedJobsPage/')) {
            return 'page-failed';
          }
          if (id.includes('/src/app/pages/SettingsPage/')) {
            return 'page-settings';
          }
          
          // Components chunk
          if (id.includes('/src/app/components/')) {
            return 'components';
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_debugger: true,
      },
    },
  },
})


