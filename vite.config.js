import { readFile } from 'node:fs/promises';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { matchRoute, pathFor, redirects } from './src/lib/routes.js';

const previewRoutes = {
  name: 'lale-preview-routes',
  configurePreviewServer(server) {
    server.middlewares.use((request, response, next) => {
      const url = new URL(request.url ?? '/', 'http://localhost');
      const pathname = url.pathname;
      if (!['GET', 'HEAD'].includes(request.method) || pathname.startsWith('/assets/') || /\.(xml|txt|ico|svg|png|webp|webmanifest)$/.test(pathname)) return next();
      const key = pathname.replace(/\/$/, '') || '/';
      const route = matchRoute(pathname);
      if (route.page !== 'missing') {
        const destination = redirects[key] ?? pathFor(route.locale, route.page, route.item);
        if (destination === pathname) return next();
        response.writeHead(301, { Location: destination + url.search });
        response.end();
        return;
      }
      readFile(route.locale === 'tr' ? 'dist/404.html' : 'dist/' + route.locale + '/404.html')
        .then(html => {
          response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
          response.end(request.method === 'HEAD' ? undefined : html);
        }).catch(next);
    });
  },
};

export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [react(), previewRoutes],
  server: { port: 3000, host: true },
  optimizeDeps: { entries: ['index.html'] },
});
