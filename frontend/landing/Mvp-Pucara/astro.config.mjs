import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  output: 'server',
  adapter: vercel({
    webAnalytics: { enabled: false }
  }),
  // Optimizaciones de build que funcionan
  build: {
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
  vite: {
    server: {
      allowedHosts: [
        'mandie-unaccustomed-audry.ngrok-free.dev',
        '.ngrok-free.dev', // Permite cualquier subdominio de ngrok
      ],
    },
  },
});