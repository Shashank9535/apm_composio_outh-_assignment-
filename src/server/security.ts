import { isIP } from 'node:net';
import { z } from 'zod';

export const inputSchema = z.object({ app: z.string().trim().min(2).max(120) });

function privateIPv4(host: string) {
  const octets = host.split('.').map(Number);
  if (octets.length !== 4 || octets.some((value) => !Number.isInteger(value) || value < 0 || value > 255)) return true;
  return octets[0] === 10 || octets[0] === 127 || octets[0] === 0 ||
    (octets[0] === 169 && octets[1] === 254) || (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) ||
    (octets[0] === 192 && octets[1] === 168) || octets[0] >= 224;
}

function privateIPv6(host: string) {
  const h = host.toLowerCase().replace(/^\[|\]$/g, '');
  return h === '::' || h === '::1' || h.startsWith('fc') || h.startsWith('fd') || /^fe[89ab]/.test(h) || h.startsWith('::ffff:127.') || h.startsWith('::ffff:10.') || h.startsWith('::ffff:192.168.');
}

export function validateAppInput(raw: unknown) {
  const parsed = inputSchema.safeParse(raw);
  if (!parsed.success) throw Object.assign(new Error('Enter an app name or a valid public website URL.'), { code: 'INVALID_INPUT', status: 400 });
  const input = parsed.data.app;
  if (!/^https?:\/\//i.test(input)) return { appName: input, appUrl: null as string | null };
  let url: URL;
  try { url = new URL(input); } catch { throw Object.assign(new Error('That URL is not valid. Use a public https:// website.'), { code: 'INVALID_URL', status: 400 }); }
  const host = url.hostname.toLowerCase().replace(/\.$/, '');
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || !host.includes('.') || host.endsWith('.localhost') || host.endsWith('.local') || host.endsWith('.internal')) {
    throw Object.assign(new Error('Use a public website URL without credentials, local names, or private network addresses.'), { code: 'UNSAFE_URL', status: 400 });
  }
  const ipType = isIP(host);
  if ((ipType === 4 && privateIPv4(host)) || (ipType === 6 && privateIPv6(host))) {
    throw Object.assign(new Error('Local and private IP addresses cannot be researched.'), { code: 'UNSAFE_URL', status: 400 });
  }
  return { appName: host.replace(/^www\./, '').split('.')[0].replace(/[-_]/g, ' '), appUrl: url.origin };
}

export function normalizedPublicUrl(raw: string) {
  try {
    const url = new URL(raw);
    if (url.protocol !== 'https:' || url.username || url.password || !url.hostname.includes('.') || url.hostname.endsWith('.localhost') || isIP(url.hostname)) return null;
    return url.origin + url.pathname.slice(0, 150);
  } catch { return null; }
}

