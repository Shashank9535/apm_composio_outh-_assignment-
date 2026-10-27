import { describe, expect, it } from 'vitest';
import { generatedContentSchema, validateEvidenceReferences, type GeneratedContent, type ResearchCandidate } from '../src/server/schema';

const candidate: ResearchCandidate = { id: 'S1', title: 'Official OAuth docs', url: 'https://docs.example.com/oauth', domain: 'docs.example.com', snippet: 'Create an OAuth app.', score: 0.8 };
const content: GeneratedContent = {
  app_name: 'Example', app_url: 'https://example.com', description: 'An example OAuth integration for developers.', developer_docs_url: candidate.url,
  auth_path: 'requires_confirmation', auth_path_rationale: 'The sources do not establish whether managed OAuth supports this exact toolkit.', auth_path_evidence_ids: [], difficulty: 'unknown',
  active_time_estimate: { value: null, status: 'unknown', rationale: 'The documentation gives no effort estimate.', evidence_ids: [] },
  approval_wait_estimate: { value: null, status: 'unknown', rationale: 'No approval queue timing was documented.', evidence_ids: [] },
  prerequisites: [{ text: 'A public application domain and an OAuth callback URL.', evidence_ids: ['S1'] }],
  setup_steps: [{ title: 'Register an app', instruction: 'Register an OAuth application and configure its callback URL.', evidence_ids: ['S1'] }, { title: 'Set permissions', instruction: 'Select only the permissions required by the integration.', evidence_ids: ['S1'] }],
  blockers: [], agent_actions: ['Review provider documentation'], human_actions: ['Create credentials in the provider console'],
  selected_sources: [{ candidate_id: 'S1', supports: ['Registration and callback setup'] }], uncertainties: ['No account setup or authorization flow was tested.']
};

describe('generated guide evidence validation', () => {
  it('accepts valid structured content and citations', () => {
    expect(generatedContentSchema.parse(content)).toEqual(content);
    expect(() => validateEvidenceReferences(content, [candidate])).not.toThrow();
  });
  it('rejects citations not returned by research', () => {
    const invalid = { ...content, setup_steps: [{ ...content.setup_steps[0], evidence_ids: ['FAKE'] }, content.setup_steps[1]] };
    expect(() => validateEvidenceReferences(invalid, [candidate])).toThrow(/outside the research results/);
  });
  it('rejects guides with low-relevance-only sources', () => {
    expect(() => validateEvidenceReferences(content, [{ ...candidate, score: 0.1 }])).toThrow(/sufficiently relevant/);
  });
});

