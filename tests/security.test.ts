import { describe, expect, it } from 'vitest';
import { validateAppInput, normalizedPublicUrl } from '../src/server/security';

describe('research input safety', () => {
  it('accepts an app name', () => expect(validateAppInput({ app: 'Example Calendar' }).appName).toBe('Example Calendar'));
  it('normalizes a public website', () => expect(validateAppInput({ app: 'https://www.example.com/path?q=oauth' })).toEqual({ appName: 'example', appUrl: 'https://www.example.com' }));
  it.each(['http://localhost/admin', 'https://127.0.0.1', 'http://192.168.1.10', 'http://169.254.169.254/latest', 'https://user:pass@example.com', 'http://service.internal'])('rejects unsafe URL %s', (app) => {
    expect(() => validateAppInput({ app })).toThrow();
  });
  it('only treats public HTTPS result URLs as candidates', () => {
    expect(normalizedPublicUrl('http://docs.example.com/oauth')).toBeNull();
    expect(normalizedPublicUrl('https://localhost')).toBeNull();
    expect(normalizedPublicUrl('https://docs.example.com/oauth')).toBe('https://docs.example.com/oauth');
  });
});

