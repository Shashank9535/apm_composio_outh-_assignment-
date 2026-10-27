import { defineConfig } from 'vitest/config';
import { loadEnv, type Plugin } from 'vite';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

function localApi(): Plugin {
  return {
    name: 'oauth-atlas-local-api',
    configureServer(server) {
      server.middlewares.use('/api/guides', async (req, res, next) => {
        try {
          const mod = await server.ssrLoadModule('/src/server/api.ts');
          const url = new URL(req.url || '/', 'http://localhost');
          if (req.method === 'POST' && url.pathname === '/') {
            let raw = '';
            for await (const chunk of req) raw += chunk.toString();
            if (raw.length > 5_000) { res.statusCode = 413; res.end('Request too large'); return; }
            const body = raw ? JSON.parse(raw) : {};
            const ip = req.socket.remoteAddress || req.headers['x-forwarded-for']?.toString().split(',')[0] || 'local';
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
            res.setHeader('Cache-Control', 'no-cache, no-transform');
            res.setHeader('Connection', 'keep-alive');
            await mod.streamGuide(body, (event: unknown) => res.write(`data: ${JSON.stringify(event)}\n\n`), ip);
            res.end();
            return;
          }
          next();
        } catch (error) {
          if (res.headersSent) { res.write(`data: ${JSON.stringify({ type: 'error', code: 'SERVER_ERROR', message: 'The research request failed. Check the server configuration and try again.' })}\n\n`); res.end(); return; }
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }));
        }
      });
    }
  };
}

const root = dirname(fileURLToPath(import.meta.url));
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, root, '');
  for (const key of ['TAVILY_API_KEY','GEMINI_API_KEY','GEMINI_MODEL']) {
    if (!process.env[key] && env[key]) process.env[key] = env[key];
  }
  return { plugins: [react(), tailwindcss(), localApi()], test: { environment: 'node' } };
});

