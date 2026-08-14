import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves this as a project site under /defect-detection/, so assets need that prefix
// there — but Vercel serves it at the domain root, where that same prefix would 404 every asset.
// Vercel sets VERCEL=1 in its build environment, so use it to pick the right base per target.
export default defineConfig({
  plugins: [react()],
  base: process.env.VERCEL ? '/' : '/defect-detection/',
})
