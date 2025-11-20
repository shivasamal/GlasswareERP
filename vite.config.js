import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/GlasswareERP/',
  build: { outDir: 'docs' },
  plugins: [react()], // Required for React to work
  // server: {
  //   port: 3000,
  //   open: true
  // }
})

