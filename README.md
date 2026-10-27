# OAuth Atlas

OAuth Atlas helps developers answer the work hidden behind “connect your app”: which OAuth path to use, what to configure, what might block launch, how much effort is known, and what approval is still uncertain. The experience combines a 118-app snapshot of Composio managed OAuth discovery with three detailed source-reviewed guides and live research for unfamiliar apps. Each directory entry is labeled separately from an actually researched guide.

## Run locally

Requirements: Node.js 20+ and npm or pnpm.

```sh
pnpm install
cp .env.example .env.local
# Add server-only credentials to .env.local (never commit this file)
pnpm dev
```

Open the local Vite URL. The Vite dev server also mounts the same API handler used by Vercel. The app can render curated guides without credentials, but live generation and persistent share links require Tavily, Gemini, and Supabase configuration.

## Environment

| Variable | Required for | Notes |
| --- | --- | --- |
| `TAVILY_API_KEY` | Fresh research | Server-side Tavily search key. |
| `GEMINI_API_KEY` | Fresh research | Server-side Google AI Studio key. |
| `GEMINI_MODEL` | Optional | Defaults to `gemini-3.8-flash`, currently listed by Gemini docs with structured-output support. |
| `SUPABASE_URL` | Shared guide read/write | Project URL. |
| `SUPABASE_SECRET_KEY` | Shared guide read/write | Preferred server-only key; it bypasses RLS. |
| `SUPABASE_SERVICE_ROLE_KEY` | Shared guide read/write | Legacy fallback name for an existing project. Keep server-only. |
| `SUPABASE_ANON_KEY` | Not used by this server-side flow | Included for project setup compatibility; never grants guide writes from the browser. |

Never use `VITE_` prefixes for private keys. Do not paste credentials into source files or commit `.env.local`.

## Architecture and request flow

- React, TypeScript, Vite, Tailwind, React Router, Lucide icons, and Zod.
- `/api/guides` validates a name or public HTTP(S) URL, rate-limits the local function instance, checks Supabase for an existing public guide, and streams real status events.
- Tavily searches provider OAuth requirements and Composio managed-auth context. Returned snippets and URLs are treated as untrusted candidate evidence.
- Gemini receives a bounded set of search results and returns JSON structured to the guide schema. Zod validates the output, and the backend rejects citations that do not exactly match the research result IDs or that point to low-relevance results.
- Supabase stores the validated guide JSON and source metadata. `/api/guides/:id` reads only public rows. Writes use a server-side secret key; no key is bundled into the client.
- If a valid existing guide matches, the API reports it as reused and returns its stable `/guides/:id` route without claiming a fresh search.

Research results are not proof of source ownership. Generated source entries are labelled as retrieved search results; verify provider ownership and open the source before using the guidance. The model is explicitly asked not to invent scopes, review times, source URLs, or tests. An unsupported Composio path falls back to “Integration path requires confirmation.”

## Database setup

1. Create a Supabase project.
2. Run [`supabase/migrations/202610270001_create_guides.sql`](supabase/migrations/202610270001_create_guides.sql) in the Supabase SQL editor or with the Supabase CLI.
3. Add the project URL and a server-only secret key to `.env.local` or Vercel project settings.

The migration enables RLS, revokes public writes, and grants anonymous/authenticated roles read access only to rows allowed by the `is_public` policy. The server secret bypasses RLS, so every write must continue to pass through the validated API. Anonymous users cannot write rows directly.

## Tests and build

```sh
pnpm typecheck
pnpm test
pnpm build
```

The current tests cover URL safety, structured guide validation, and citation integrity. A real unfamiliar-app request additionally requires valid Tavily, Gemini, and Supabase credentials. Test it at `/generate`, then refresh `/guides/<returned-id>` to confirm database persistence.

## Deploy to Vercel

Import the repository into Vercel or use the Vercel CLI. Vercel discovers the root `api/` TypeScript functions. Add the server-only variables above in the project environment settings, run a production deployment, and verify both `/api/guides` and a saved `/guides/:id` URL. Do not set server keys as `VITE_*` variables.

The source repository is [Shashank9535/apm_composio_outh-_assignment-](https://github.com/Shashank9535/apm_composio_outh-_assignment-). A Vercel deployment still requires importing the repository and adding the server-only variables listed above. No credentials are included in the repository.

## First-principles product decision

An app connection has two jobs: the developer configures a provider integration, and each end user chooses whether to grant access. Composio managed OAuth can remove app registration and credential handling for supported schemes, but it does not remove the user's consent step or automatically meet branded-consent, custom-scope, quota, or review needs. OAuth Atlas therefore starts with “Does managed auth fit this connection?” and routes the builder into a source-backed setup path only when needed.

The directory is a dated discovery snapshot from Composio's managed-auth page, not 118 complete setup guides. Three apps (GitHub, Slack, and Google) have detailed reviewed guides; other listed apps can be sent through live research. On the guide page, a private in-browser milestone trail helps the builder track setup progress. It does not award points for skipping consent, scope review, or provider approval. The source page's directory changes over time, so verify current auth schemes and exact scopes in Composio before launch.
## Product decisions and evidence

The core problem is uncertainty before the OAuth build begins. The guide places the integration path, hands-on effort, external waiting, blockers, next actions, and evidence before lengthy implementation detail. Setup time remains unknown unless a source supports it or an estimate is explicitly identified as an inference. Provider approval timing is unknown unless documentation describes a relevant review path.

The GitHub, Slack, and Google starter guides link directly to official sources and are labeled documentation-reviewed. No provider console was accessed; no OAuth app or credentials were created; no OAuth flow or provider approval was tested. Provider setup requirements were checked against these official documentation sources:

- Composio: [Managed Auth](https://docs.composio.dev/toolkits/managed-auth), [managed vs custom apps](https://docs.composio.dev/docs/authentication/custom-app-vs-managed-app), and [toolkit directory](https://composio.dev/toolkits).
- GitHub: [Create an OAuth app](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app), [Authorize OAuth apps](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps), and [Organization app approval](https://docs.github.com/en/organizations/managing-oauth-access-to-your-organizations-data/approving-oauth-apps-for-your-organization).
- Slack: [Install with OAuth](https://docs.slack.dev/authentication/installing-with-oauth/), [App distribution](https://api.slack.com/docs/slack-apps-mgmt), and [Marketplace app review](https://api.slack.com/directory/app-review-guide).
- Google: [OAuth overview](https://developers.google.com/identity/protocols/oauth2), [scope categories](https://developers.google.com/identity/protocols/oauth2/scopes), [sensitive-scope verification](https://developers.google.com/identity/protocols/oauth2/production-readiness/sensitive-scope-verification), and [OAuth policies](https://developers.google.com/identity/protocols/oauth2/policies).
- Service contracts: [Tavily Search API](https://docs.tavily.com/documentation/api-reference/endpoint/search), [Gemini structured output](https://ai.google.dev/gemini-api/docs/structured-output), [Gemini models](https://ai.google.dev/gemini-api/docs/models), [Supabase REST API](https://supabase.com/docs/guides/api), [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), and [Vercel Node.js functions](https://vercel.com/docs/functions/runtimes/node-js).

## Security and current limitations

- User-supplied URLs must be public HTTP(S); localhost, private IP addresses, credentials in URLs, and local/internal hostnames are rejected. The service searches the URL string; it does not fetch arbitrary user URLs.
- An in-memory per-instance cap limits each runtime process to five requests per minute. Serverless instances do not share counters; add a shared rate limiter or authenticated access before broad public release.
- Tavily/Gemini quotas and model availability vary by account and plan. Check provider usage pages; the application does not assume a free quota is unlimited. Provider calls have bounded timeouts and result sizes.
- No secrets were present in the workspace environment during implementation, so API research, database persistence, and external deployment could not be exercised here.
- The managed-auth catalog is a dated 118-app snapshot; it may drift from the dynamic Composio list. There are three full guides, not 118 full guides.

## Demonstration flow

1. Open the homepage, then search GitHub under Explore.
2. Inspect a provider guide’s evidence, effort, approval dependency, and blocker section.
3. Submit an unfamiliar public app name or website under Generate.
4. Watch server-reported research stages; if evidence or credentials are insufficient, read the explicit error rather than a fabricated guide.
5. Open the returned guide and refresh its shared URL to read the saved database record.

