import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

function apiDevMiddleware(): Plugin {
  return {
    name: 'api-dev-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith('/api/')) {
          const urlPath = req.url.split('?')[0];
          let handlerModule: any = null;
          if (urlPath === '/api/store') {
            handlerModule = await import('./api/store.js');
          } else if (urlPath === '/api/auth') {
            handlerModule = await import('./api/auth.js');
          }

          if (handlerModule && handlerModule.default) {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', async () => {
              if (body) {
                try { (req as any).body = JSON.parse(body); } catch { (req as any).body = body; }
              }
              const mockRes: any = {
                setHeader(k: string, v: string) { res.setHeader(k, v); },
                status(code: number) { res.statusCode = code; return this; },
                json(data: any) {
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(data));
                  return this;
                },
                end(data?: any) { res.end(data); return this; },
              };
              try {
                await handlerModule.default(req, mockRes);
              } catch (err: any) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: err.message }));
              }
            });
            return;
          }
        }
        next();
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), apiDevMiddleware()],
  server: {
    port: 5173,
    host: true,
    open: false,
  },
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          supabase: ['@supabase/supabase-js'],
          icons: ['lucide-react'],
        },
      },
    },
  },
});
