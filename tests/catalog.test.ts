import { describe, expect, it } from 'vitest';
import { managedAuthApps } from '../src/data/catalog';

describe('Composio managed-auth directory snapshot', () => {
  it('keeps all 118 listed entries searchable without duplicates', () => {
    expect(managedAuthApps).toHaveLength(118);
    expect(new Set(managedAuthApps.map((app) => app.name.toLowerCase())).size).toBe(118);
  });

  it('contains varied providers from the source directory', () => {
    const names = new Set(managedAuthApps.map((app) => app.name));
    expect([...names]).toEqual(expect.arrayContaining(['GitHub', 'Slack', 'Salesforce', 'Google Drive']));
  });
});

