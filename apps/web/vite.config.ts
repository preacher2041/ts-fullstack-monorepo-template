/// <reference types='vite/client' />
/// <reference types='vite-plugin-svgr/client' />

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr';
import {tanstackRouter} from '@tanstack/router-vite-plugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tanstackRouter(), svgr()],
  server: {
      port: 9000,
    },
})
