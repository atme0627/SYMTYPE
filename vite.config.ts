import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' — GitHub Pages のサブパス配信でも Cloudflare でもそのまま動くように相対パスにする
export default defineConfig({
  plugins: [react()],
  base: './',
})
