export type EvidenceStatus = 'documented' | 'tested' | 'inferred' | 'unknown';
export type SourceType = 'provider_docs' | 'composio_docs' | 'standard' | 'other';

export interface GuideSource {
  id: string;
  title: string;
  url: string;
  domain: string;
  source_type: SourceType;
  supports: string[];
  evidence_status: EvidenceStatus;
}

export interface GuideStep { title: string; instruction: string; evidence_ids: string[] }
export interface GuideBlocker { title: string; why_it_matters: string; next_action: string; evidence_ids: string[]; status: EvidenceStatus }
export interface Estimate { value: string | null; status: 'documented' | 'editorial_estimate' | 'unknown'; rationale: string }

export interface OAuthGuide {
  id: string;
  slug: string;
  app_name: string;
  app_url: string | null;
  description: string;
  developer_docs_url: string | null;
  auth_path: 'managed_may_fit' | 'custom_may_be_needed' | 'requires_confirmation';
  auth_path_rationale: string;
  auth_path_evidence_ids?: string[];
  difficulty: 'easier_candidate' | 'moderate_candidate' | 'more_nuanced' | 'unknown';
  active_time_estimate: Estimate;
  approval_wait_estimate: Estimate;
  prerequisites: string[];
  setup_steps: GuideStep[];
  blockers: GuideBlocker[];
  agent_actions: string[];
  human_actions: string[];
  sources: GuideSource[];
  verification_status: 'documentation_reviewed' | 'generated_unverified' | 'tested';
  uncertainties: string[];
  generated_at: string | null;
  last_verified_at: string | null;
  is_seed: boolean;
}

