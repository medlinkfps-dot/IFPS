import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

function apiDevMiddleware(): Plugin {
  return {
    name: 'api-dev-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith('/api/store')) {
          const token = process.env.VITE_BLOB_READ_WRITE_TOKEN || 'vercel_blob_rw_A53IpJjUTe4iXwXY_DtqKr9S6wORYyr3M0gPMm78SJ26WTE';
          const BLOB_STORE_URL = 'https://a53ipjjute4ixwxy.private.blob.vercel-storage.com/ifps_store.json';
          const BLOB_PUT_API = 'https://blob.vercel-storage.com/ifps_store.json';

          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Cache-Control', 'no-store');

          if (req.method === 'GET') {
            try {
              const response = await fetch(`${BLOB_STORE_URL}?_nocache=${Date.now()}`, {
                headers: { 'Authorization': `Bearer ${token}` },
              });
              const data = await response.json();
              res.statusCode = response.status;
              res.end(JSON.stringify(data));
              return;
            } catch (err: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
              return;
            }
          }

          if (req.method === 'POST' || req.method === 'PUT') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', async () => {
              try {
                const payload = JSON.parse(body);
                payload.last_updated = new Date().toISOString();
                const blobRes = await fetch(BLOB_PUT_API, {
                  method: 'PUT',
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'x-api-version': '7',
                    'x-vercel-blob-access': 'private',
                    'x-add-random-suffix': '0',
                    'x-allow-overwrite': '1',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(payload),
                });
                const result = await blobRes.json();
                res.statusCode = blobRes.status;
                res.end(JSON.stringify({ success: true, last_updated: payload.last_updated, result }));
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
