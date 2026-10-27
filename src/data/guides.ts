import type { OAuthGuide, GuideSource } from '../types';

const src = (id: string, title: string, url: string, supports: string[]): GuideSource => ({
  id, title, url, domain: new URL(url).hostname, source_type: 'provider_docs', supports, evidence_status: 'documented'
});
const base = {
  auth_path: 'requires_confirmation' as const,
  auth_path_rationale: 'Composio managed OAuth may work for some use cases. Confirm availability and scope support in the relevant toolkit before registering custom credentials.',
  active_time_estimate: { value: null, status: 'unknown' as const, rationale: 'Hands-on setup time has not been measured; it depends on the app and environment.' },
  agent_actions: ['Research provider documentation', 'Extract setup requirements and prepare a checklist', 'Compare documented authorization paths', 'Draft questions for provider support'],
  human_actions: ['Sign in and create provider credentials', 'Handle private configuration securely', 'Complete identity or domain verification', 'Approve user consent or submit provider review'],
  verification_status: 'documentation_reviewed' as const,
  generated_at: null,
  last_verified_at: '2026-10-27T00:00:00.000Z',
  is_seed: true
};

export const seedGuides: OAuthGuide[] = [
  {
    ...base, id: 'seed-github', slug: 'github', app_name: 'GitHub', app_url: 'https://github.com',
    description: 'Configure an OAuth application and connect developer workflows.', developer_docs_url: 'https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app',
    difficulty: 'easier_candidate',
    approval_wait_estimate: { value: 'No standard public review found', status: 'unknown', rationale: 'The sources reviewed describe user and organization authorization, not a general app approval queue.' },
    prerequisites: ['GitHub account (organization admin access if registering under an organization)', 'Application homepage URL', 'OAuth callback URL handled by your server'],
    setup_steps: [
      { title: 'Choose the integration type', instruction: 'GitHub recommends considering a GitHub App. Use an OAuth App when acting on behalf of a user fits the integration.', evidence_ids: ['github-create'] },
      { title: 'Register an OAuth App', instruction: 'Open Developer settings → OAuth Apps → New OAuth App. Enter the app name, homepage URL, and callback URL.', evidence_ids: ['github-create'] },
      { title: 'Set callback and permissions', instruction: 'Configure the callback your backend handles. Ask for only the permissions your feature needs.', evidence_ids: ['github-create'] },
      { title: 'Test user authorization', instruction: 'Authorize using a development account and check the returned identity and granted access. This guide has not performed that test.', evidence_ids: ['github-authorize'] }
    ],
    blockers: [{ title: 'Organization access restrictions', why_it_matters: 'An organization may restrict OAuth app access to its resources and require an owner to approve the app.', next_action: 'Ask the target organization owner whether OAuth app restrictions are enabled.', evidence_ids: ['github-org'], status: 'documented' }],
    uncertainties: ['Provider setup and authorization were not tested.', 'Confirm whether a GitHub App is a better fit for the required permissions.', 'Composio managed-auth support must be confirmed for the specific toolkit.'],
    sources: [src('github-create', 'Creating an OAuth app', 'https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app', ['App registration fields and callback URL']), src('github-authorize', 'Authorizing OAuth apps', 'https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps', ['User authorization behavior']), src('github-org', 'Approving OAuth apps for your organization', 'https://docs.github.com/en/organizations/managing-oauth-access-to-your-organizations-data/approving-oauth-apps-for-your-organization', ['Organization owner approval restrictions'])]
  },
  {
    ...base, id: 'seed-slack', slug: 'slack', app_name: 'Slack', app_url: 'https://slack.com',
    description: 'Understand OAuth scopes, authorization, and workspace installation.', developer_docs_url: 'https://docs.slack.dev/authentication/installing-with-oauth/',
    difficulty: 'moderate_candidate',
    approval_wait_estimate: { value: 'Conditional; Marketplace review can take weeks', status: 'documented', rationale: 'Slack’s review documentation gives queue estimates for Marketplace listing; listing is separate from OAuth installation and timing varies.' },
    prerequisites: ['Slack account and development workspace', 'HTTPS redirect URL matching the configured URL', 'Minimal bot scopes and user scopes, if needed'],
    setup_steps: [
      { title: 'Create a Slack app', instruction: 'Create an app in the Slack API dashboard and configure the required features.', evidence_ids: ['slack-oauth'] },
      { title: 'Choose OAuth scopes', instruction: 'Request bot scopes with `scope` and user scopes with `user_scope`. Keep access narrow; additional grants are additive.', evidence_ids: ['slack-oauth'] },
      { title: 'Configure the redirect URL', instruction: 'Register an HTTPS Redirect URL. If multiple are configured, send the same `redirect_uri` during authorization and code exchange.', evidence_ids: ['slack-oauth'] },
      { title: 'Install and validate', instruction: 'Install to a development workspace, validate `state`, then exchange the temporary code server-side.', evidence_ids: ['slack-oauth'] },
      { title: 'Decide on distribution', instruction: 'Enable public distribution for installs across workspaces. Marketplace listing is an additional optional review path.', evidence_ids: ['slack-dist', 'slack-review'] }
    ],
    blockers: [{ title: 'Redirect or scope mismatch', why_it_matters: 'A mismatch, unsupported scope combination, or workspace install policy can prevent installation.', next_action: 'Compare the authorization URI with configured redirect URLs and the exact requested scopes.', evidence_ids: ['slack-oauth'], status: 'documented' }, { title: 'Marketplace review', why_it_matters: 'Marketplace listing has a separate review queue; Slack documentation gives up to one week for preliminary feedback and up to eight weeks for functional review.', next_action: 'Decide whether listing is required. Prepare scope justification, test access, and a production-ready listing before submission.', evidence_ids: ['slack-review'], status: 'documented' }],
    uncertainties: ['No Slack app was created or installed.', 'Marketplace queue estimates are provider guidance, not a guarantee.', 'Confirm distribution and Marketplace needs for your go-to-market plan.', 'Composio managed-auth support must be confirmed for the specific toolkit.'],
    sources: [src('slack-oauth', 'Installing with OAuth', 'https://docs.slack.dev/authentication/installing-with-oauth/', ['Scope types, redirect URLs, authorization and token exchange']), src('slack-dist', 'App distribution', 'https://api.slack.com/docs/slack-apps-mgmt', ['Cross-workspace distribution']), src('slack-review', 'App review guide', 'https://api.slack.com/directory/app-review-guide', ['Marketplace review process and estimates'])]
  },
  {
    ...base, id: 'seed-google', slug: 'google', app_name: 'Google', app_url: 'https://google.com',
    description: 'Navigate OAuth configuration, consent settings, and conditional verification requirements.', developer_docs_url: 'https://developers.google.com/identity/protocols/oauth2',
    difficulty: 'more_nuanced',
    approval_wait_estimate: { value: 'Scope-dependent; days to weeks', status: 'documented', rationale: 'Google guidance describes different review paths and timing. Scope, audience, exception status, and assessment needs change the outcome.' },
    prerequisites: ['Google Cloud project', 'OAuth audience and consent configuration', 'Exact API scopes required by the integration', 'Accurate app identity and privacy-policy links for public use'],
    setup_steps: [
      { title: 'Create or select a Cloud project', instruction: 'Use the project that owns the Google API and OAuth client configuration.', evidence_ids: ['google-oauth'] },
      { title: 'Configure audience and branding', instruction: 'Choose Internal or External audience and provide accurate app identity details. External testing can be limited to listed test users.', evidence_ids: ['google-policy'] },
      { title: 'Select the narrowest scopes', instruction: 'Classify each API scope and use the least sensitive permissions that meet the feature need.', evidence_ids: ['google-scopes'] },
      { title: 'Create an OAuth client', instruction: 'Choose the client type and configure allowed redirect URIs for your application.', evidence_ids: ['google-oauth'] },
      { title: 'Resolve verification requirements', instruction: 'Sensitive or restricted scopes may require verification; restricted scopes may also require a security assessment. Check exceptions before launch.', evidence_ids: ['google-verify', 'google-policy'] }
    ],
    blockers: [{ title: 'Sensitive or restricted scopes', why_it_matters: 'Some public production apps must be verified; restricted scopes can trigger a further security assessment.', next_action: 'Check every exact scope, remove unnecessary access, and prepare the justification and verification materials.', evidence_ids: ['google-verify', 'google-scopes'], status: 'documented' }, { title: 'Branding or domain evidence', why_it_matters: 'Verification may require accurate consent-screen details and domain ownership evidence.', next_action: 'Verify the app domain and complete product identity and privacy-policy details before submission.', evidence_ids: ['google-verify'], status: 'documented' }],
    uncertainties: ['Exact scopes have not been selected, so the verification path cannot be determined.', 'Review times depend on scope and app circumstances; no review was submitted.', 'Composio managed-auth support must be confirmed for the specific toolkit.'],
    sources: [src('google-oauth', 'Using OAuth 2.0 to Access Google APIs', 'https://developers.google.com/identity/protocols/oauth2', ['OAuth clients and user consent']), src('google-verify', 'Sensitive scope verification', 'https://developers.google.com/identity/protocols/oauth2/production-readiness/sensitive-scope-verification', ['Conditional verification and preparation']), src('google-policy', 'OAuth 2.0 policies', 'https://developers.google.com/identity/protocols/oauth2/policies', ['Production requirements and submission']), src('google-scopes', 'OAuth 2.0 scopes', 'https://developers.google.com/identity/protocols/oauth2/scopes', ['Scope classification'])]
  }
];

export function guidePath(guide: Pick<OAuthGuide, 'id' | 'is_seed' | 'slug'>) {
  return guide.is_seed ? `/apps/${guide.slug}` : `/guides/${guide.id}`;
}

