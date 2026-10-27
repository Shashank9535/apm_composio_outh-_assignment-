import { afterEach, describe, expect, it } from 'vitest';
import { streamGuide } from '../src/server/api';

const envKeys = ['SUPABASE_URL', 'SUPABASE_SECRET_KEY', 'SUPABASE_SERVICE_ROLE_KEY', 'TAVILY_API_KEY', 'GEMINI_API_KEY'];
const original = Object.fromEntries(envKeys.map((key) => [key, process.env[key]]));
afterEach(() => {
  for (const key of envKeys) {
    if (original[key] === undefined) delete process.env[key];
    else process.env[key] = original[key];
  }
});

describe('guide research request flow', () => {
  it('returns a curated guide without requiring service credentials', async () => {
    for (const key of envKeys) delete process.env[key];
    const events: Array<{ type: string; route?: string }> = [];
    await streamGuide({ app: 'GitHub' }, (event) => events.push(event), 'test-seed');
    expect(events.some((event) => event.type === 'cached' && event.route === '/apps/github')).toBe(true);
  });

  it('returns a clear configuration error for an unfamiliar app', async () => {
    for (const key of envKeys) delete process.env[key];
    const events: Array<{ type: string; code?: string }> = [];
    await streamGuide({ app: 'Example Calendar' }, (event) => events.push(event), 'test-missing-config');
    expect(events).toContainEqual(expect.objectContaining({ type: 'error', code: 'CONFIG_MISSING' }));
  });
});

