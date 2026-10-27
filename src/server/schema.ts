import { z } from 'zod';

export const evidenceStatus = z.enum(['documented', 'tested', 'inferred', 'unknown']);
export const generatedContentSchema = z.object({
  app_name: z.string().min(1).max(100),
  app_url: z.string().nullable(),
  description: z.string().min(10).max(220),
  developer_docs_url: z.string().nullable(),
  auth_path: z.enum(['managed_may_fit', 'custom_may_be_needed', 'requires_confirmation']),
  auth_path_rationale: z.string().min(20).max(600),
  auth_path_evidence_ids: z.array(z.string()).max(5),
  difficulty: z.enum(['easier_candidate', 'moderate_candidate', 'more_nuanced', 'unknown']),
  active_time_estimate: z.object({ value: z.string().nullable(), status: z.enum(['documented', 'inferred', 'unknown']), rationale: z.string().min(10).max(400), evidence_ids: z.array(z.string()).max(5) }),
  approval_wait_estimate: z.object({ value: z.string().nullable(), status: z.enum(['documented', 'unknown']), rationale: z.string().min(10).max(400), evidence_ids: z.array(z.string()).max(5) }),
  prerequisites: z.array(z.object({ text: z.string().min(5).max(300), evidence_ids: z.array(z.string()).min(1).max(5) })).max(12),
  setup_steps: z.array(z.object({ title: z.string().min(3).max(100), instruction: z.string().min(10).max(600), evidence_ids: z.array(z.string()).min(1).max(5) })).min(2).max(10),
  blockers: z.array(z.object({ title: z.string().min(3).max(100), why_it_matters: z.string().min(10).max(400), next_action: z.string().min(10).max(400), evidence_ids: z.array(z.string()).max(5), status: evidenceStatus })).max(8),
  agent_actions: z.array(z.string().min(4).max(150)).max(8),
  human_actions: z.array(z.string().min(4).max(150)).max(8),
  selected_sources: z.array(z.object({ candidate_id: z.string(), supports: z.array(z.string().min(4).max(200)).max(8) })).min(1).max(8),
  uncertainties: z.array(z.string().min(5).max(300)).max(10)
}).superRefine((guide, context) => {
  if (guide.auth_path !== 'requires_confirmation' && guide.auth_path_evidence_ids.length === 0) context.addIssue({ code: 'custom', path: ['auth_path_evidence_ids'], message: 'A recommended OAuth path needs cited evidence.' });
  if (guide.active_time_estimate.value !== null && guide.active_time_estimate.status === 'unknown') context.addIssue({ code: 'custom', path: ['active_time_estimate'], message: 'An unknown estimate cannot contain a value.' });
  if (guide.active_time_estimate.status === 'documented' && guide.active_time_estimate.evidence_ids.length === 0) context.addIssue({ code: 'custom', path: ['active_time_estimate'], message: 'A documented estimate needs evidence.' });
  if (guide.approval_wait_estimate.value !== null && (guide.approval_wait_estimate.status !== 'documented' || guide.approval_wait_estimate.evidence_ids.length === 0)) context.addIssue({ code: 'custom', path: ['approval_wait_estimate'], message: 'Approval timing must be explicitly documented and cited.' });
  guide.blockers.forEach((blocker, index) => {
    if (blocker.status !== 'unknown' && blocker.evidence_ids.length === 0) context.addIssue({ code: 'custom', path: ['blockers', index, 'evidence_ids'], message: 'A documented or inferred blocker needs evidence.' });
  });
});

export type GeneratedContent = z.infer<typeof generatedContentSchema>;
export type ResearchCandidate = { id: string; title: string; url: string; domain: string; snippet: string; score: number };

export function guideSlug(text: string) {
  return text.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 55) || 'oauth-guide';
}

export function validateEvidenceReferences(content: GeneratedContent, candidates: ResearchCandidate[]) {
  const allowed = new Set(candidates.map((candidate) => candidate.id));
  const refs = [
    ...content.active_time_estimate.evidence_ids,
    ...content.approval_wait_estimate.evidence_ids,
    ...content.auth_path_evidence_ids,
    ...content.prerequisites.flatMap((x) => x.evidence_ids),
    ...content.setup_steps.flatMap((x) => x.evidence_ids),
    ...content.blockers.flatMap((x) => x.evidence_ids),
    ...content.selected_sources.map((x) => x.candidate_id)
  ];
  if (refs.some((id) => !allowed.has(id))) throw new Error('The generated guide referenced a source outside the research results.');
  const cited = new Set(content.selected_sources.map((source) => source.candidate_id));
  for (const id of refs) if (!cited.has(id)) throw new Error('The generated guide cited an unselected source.');
  if (!content.selected_sources.some((source) => (candidates.find((candidate) => candidate.id === source.candidate_id)?.score ?? 0) >= 0.35)) {
    throw new Error('Research results did not contain a sufficiently relevant source.');
  }
}

