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
      { title: 'Register an OAuth App', instruction: 'Open Developer settings â†’ OAuth Apps â†’ New OAuth App. Enter the app name, homepage URL, and callback URL.', evidence_ids: ['github-create'] },
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
    approval_wait_estimate: { value: 'Conditional; Marketplace review can take weeks', status: 'documented', rationale: 'Slackâ€™s review documentation gives queue estimates for Marketplace listing; listing is separate from OAuth installation and timing varies.' },
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
  },
  {
    ...base, id: 'seed-airtable', slug: 'airtable', app_name: 'Airtable', app_url: 'https://airtable.com',
    description: 'Register an Airtable OAuth integration, choose granular data access, and prepare the details users need before they can authorize it.',
    developer_docs_url: 'https://airtable.com/developers/web/api/oauth-reference',
    auth_path: 'requires_confirmation',
    auth_path_rationale: 'Airtable supports third-party OAuth integrations. Confirm that Composio managed OAuth supports the Airtable toolkit and the exact scopes your product needs before creating your own integration.',
    auth_path_evidence_ids: ['airtable-oauth-overview'],
    difficulty: 'moderate_candidate',
    active_time_estimate: { value: 'About 45â€“90 minutes', status: 'editorial_estimate', rationale: 'Planning estimate for registering the integration, preparing its support and policy links, selecting scopes, and testing a development authorization. Airtable does not publish a setup-time target.' },
    approval_wait_estimate: { value: null, status: 'unknown', rationale: 'The reviewed Airtable setup guidance does not document a standard OAuth integration review queue or approval timeline.' },
    prerequisites: [
      'An Airtable account with access to Builder Hub',
      'A public homepage and HTTPS OAuth redirect URL for your application',
      'A support email, privacy policy URL, and terms of service URL before other Airtable users can authorize',
      'A short list of the Airtable records, schema, user metadata, or webhook actions your product needs'
    ],
    setup_steps: [
      { title: 'Register the OAuth integration', instruction: 'Open Airtable Builder Hub, choose OAuth integrations, and register an integration name with the HTTPS redirect URL your server will handle.', evidence_ids: ['airtable-builderhub'] },
      { title: 'Complete its public identity', instruction: 'Add a clear tagline, homepage, and logo if appropriate. Record the client ID. Generate and store a client secret only if your server-side token exchange requires one; never put it in browser code.', evidence_ids: ['airtable-builderhub'] },
      { title: 'Choose only the scopes you need', instruction: 'Select the required read or write access for records and comments, base schema, user metadata, or webhooks. Review the consent preview so users can understand what the integration can access.', evidence_ids: ['airtable-builderhub'] },
      { title: 'Add support and policy details', instruction: 'Enter a support email, privacy policy URL, and terms of service URL, then save. Airtable documents these fields as required before other users can authorize the integration.', evidence_ids: ['airtable-builderhub'] },
      { title: 'Test user consent and token handling', instruction: 'Test with a development account and a limited base selection. Handle the OAuth callback and token exchange on your server, and implement safe refresh-token rotation before launch.', evidence_ids: ['airtable-oauth-overview', 'airtable-refresh'] },
      { title: 'Explain access and recovery to users', instruction: 'Tell users to choose only the bases or workspaces needed. They can later change access or revoke the integration from Airtable settings; a revoked grant requires reauthorization.', evidence_ids: ['airtable-oauth-overview'] }
    ],
    blockers: [
      { title: 'Support or policy links are missing', why_it_matters: 'Airtable says a support email, privacy policy URL, and terms of service URL must be completed before other users can authorize the integration.', next_action: 'Publish these pages, verify that each URL is publicly reachable, then add them in Builder Hub and save.', evidence_ids: ['airtable-builderhub'], status: 'documented' },
      { title: 'Refresh-token rotation is mishandled', why_it_matters: 'Airtable can invalidate refresh tokens after use, inactivity, rejected refresh attempts, or reuse of an old token after rotation.', next_action: 'Persist each newly returned refresh token atomically, prevent parallel refreshes for one connection, and prompt the user to reconnect if refresh fails.', evidence_ids: ['airtable-refresh'], status: 'documented' }
    ],
    uncertainties: [
      'No Airtable integration was registered or authorized as part of this guide.',
      'Airtable does not publish a standard approval wait in the reviewed setup docs; confirm any review requirements with Airtable before launch.',
      'The 45â€“90 minute active-time figure is a planning estimate, not a provider commitment.',
      'Composio managed OAuth availability and scope coverage need toolkit-specific confirmation.'
    ],
    sources: [
      src('airtable-builderhub', 'Using Builder Hub in Airtable', 'https://support.airtable.com/articles/9362950318-using-builder-hub-in-airtable', ['Registration fields, client credentials, scopes, and required support and policy details']),
      src('airtable-oauth-overview', 'Third-party integrations via OAuth overview', 'https://support.airtable.com/articles/6811769763-third-party-integrations-via-oauth-overview', ['User-selected base access, authorization management, and limits']),
      src('airtable-refresh', 'Troubleshooting disconnected OAuth integrations', 'https://support.airtable.com/articles/6412360049-troubleshooting-disconnected-oauth-integrations', ['Refresh token expiration, rotation, and reauthorization behavior'])
    ]
  },
  {
    ...base, id: 'seed-asana', slug: 'asana', app_name: 'Asana', app_url: 'https://asana.com',
    description: 'Register an OAuth app, manage which Asana workspaces can authorize it, and prepare for optional public app review.',
    developer_docs_url: 'https://developers.asana.com/docs/oauth',
    auth_path: 'requires_confirmation',
    auth_path_rationale: 'Asana provides its own OAuth app flow. Confirm whether Composio managed OAuth supports the Asana toolkit and required scopes before you build a custom app.',
    auth_path_evidence_ids: ['asana-oauth'],
    difficulty: 'moderate_candidate',
    active_time_estimate: { value: 'About 45â€“90 minutes', status: 'editorial_estimate', rationale: 'Planning estimate for creating the app, registering scopes and a callback, setting workspace distribution, and testing authorization. Asana does not publish a setup-time target.' },
    approval_wait_estimate: { value: 'Initial response: up to 1 week; app components may take longer', status: 'documented', rationale: 'Asana says this is its target for an initial response to app-directory review submissions. Review is conditional: internal use and testing do not require submission.' },
    prerequisites: [
      'Access to the Asana developer console and a development workspace',
      'An HTTPS redirect URL and a server endpoint to exchange authorization codes',
      'A list of the exact API resources and actions your integration needs',
      'For public directory submission: app icon, screenshots, company information, support URL, privacy policy, and listing descriptions'
    ],
    setup_steps: [
      { title: 'Create an OAuth app', instruction: 'In the Asana developer console, create a new app and set its app name, redirect URL, and permitted OAuth scopes. Keep the client secret on your server.', evidence_ids: ['asana-oauth'] },
      { title: 'Register the least-privilege scopes', instruction: 'Choose only the resource and action scopes your features need. The authorization request can use a subset of the appâ€™s registered scopes; an unregistered scope can cause a forbidden_scopes error.', evidence_ids: ['asana-oauth', 'asana-scopes'] },
      { title: 'Set workspace distribution', instruction: 'New apps are not available to a workspace until shared. Start with a specific workspace for testing; choose Any workspace when users outside your organization must authorize it.', evidence_ids: ['asana-share'] },
      { title: 'Implement and test the authorization-code flow', instruction: 'Send a unique state value, match the redirect URI exactly, and exchange the code on your server. Use HTTPS for web redirect URLs; localhost and native redirect URIs require PKCE with S256.', evidence_ids: ['asana-oauth'] },
      { title: 'Decide whether app-directory review is needed', instruction: 'Internal tools and testing can use OAuth without review. Submit for review if you need users in any workspace beyond your organization or want a public app-directory listing; finish the listing details and self-test first.', evidence_ids: ['asana-publish', 'asana-share'] }
    ],
    blockers: [
      { title: 'The app is not shared with the authorizing workspace', why_it_matters: 'Asana states an app must be available in a userâ€™s workspace before that user can authorize it.', next_action: 'In Manage distribution, add the test workspace or choose Any workspace when broader sharing is required.', evidence_ids: ['asana-share'], status: 'documented' },
      { title: 'Requested scopes were not registered', why_it_matters: 'Asana only accepts scopes enabled in the app settings; requesting an unregistered scope can return forbidden_scopes.', next_action: 'Compare the authorization URL scopes with the appâ€™s registered permissions and request only the required subset.', evidence_ids: ['asana-oauth', 'asana-scopes'], status: 'documented' },
      { title: 'Public distribution or directory listing requires review', why_it_matters: 'Review is required for availability beyond your organization or a public directory listing, and the app cannot be edited while a submission is under review.', next_action: 'Confirm the public launch needs review, complete the listing and QA checklist, and submit only when the app is ready. Plan for an initial response target of up to one week; app components may take longer.', evidence_ids: ['asana-publish'], status: 'documented' }
    ],
    uncertainties: [
      'No Asana app was registered, shared, or authorized during this guide review.',
      'The 45â€“90 minute setup figure is an editorial planning estimate, not an Asana commitment.',
      'The one-week review target applies to initial responses for submissions; it is not a guaranteed completion date.',
      'Composio managed OAuth availability and scope coverage need toolkit-specific confirmation.'
    ],
    sources: [
      src('asana-oauth', 'OAuth', 'https://developers.asana.com/docs/oauth', ['Developer app registration, callback URLs, authorization-code flow, state, PKCE, scopes, and server-side client-secret handling']),
      src('asana-scopes', 'OAuth scopes', 'https://developers.asana.com/docs/oauth-scopes', ['Scope categories and resource permissions']),
      src('asana-share', 'Share your app', 'https://developers.asana.com/docs/share-your-app', ['Specific-workspace and any-workspace distribution']),
      src('asana-publish', 'Publish your app', 'https://developers.asana.com/docs/publish-your-app', ['Conditional app review, listing checklist, and review response target'])
    ]
  }
];

export function guidePath(guide: Pick<OAuthGuide, 'id' | 'is_seed' | 'slug'>) {
  return guide.is_seed ? `/apps/${guide.slug}` : `/guides/${guide.id}`;
}

