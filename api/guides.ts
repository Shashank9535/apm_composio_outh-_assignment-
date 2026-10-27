import type { VercelRequest, VercelResponse } from '@vercel/node';
import { streamGuide } from '../src/server/api';

export const config = { maxDuration: 60, api: { bodyParser: { sizeLimit: '5kb' } } };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });
  res.status(200);
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();
  await streamGuide(req.body, (event) => res.write(`data: ${JSON.stringify(event)}\n\n`), req.headers['x-real-ip']?.toString() || req.socket.remoteAddress || 'unknown');
  res.end();
}

