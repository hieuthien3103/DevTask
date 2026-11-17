/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite' // bản cũ: TanStackRouterVite
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    // autoCodeSplitting tắt để số liệu bundle chỉ phản ánh React.lazy của /analytics
    tanstackRouter({ target: 'react', autoCodeSplitting: false }),
    react(),
    tailwindcss(),
    visualizer({ filename: 'stats.html', gzipSize: true }),
  ],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    globals: true,
  },
})
