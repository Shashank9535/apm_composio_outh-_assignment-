import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getGuide } from '../../src/server/api';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed.' });
  const result = await getGuide(String(req.query.id || ''));
  return res.status(result.status).json(result.body);
}

