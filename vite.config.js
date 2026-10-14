import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  // relative base + HashRouter => `npm run build` output opens straight
  // off disk, no server needed, if you ever want to share the folder.
  base: './',
})
