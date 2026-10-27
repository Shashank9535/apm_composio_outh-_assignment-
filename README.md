# OAuth Atlas

**Know what it takes to launch an OAuth integration before you start building it.**

- Live demo: https://oauth-atlas-phi.vercel.app/
- Source: https://github.com/Shashank9535/apm_composio_outh-_assignment-
- Author: Shashank Hiremath (APM Integrations take-home)

---

## 1. The problem

A developer building an AI agent wants their users to connect an app (GitHub, Slack, Google, ...). Before launch they may need to create an OAuth app with the provider and, sometimes, get it reviewed. Today they piece this together from scattered docs and can't easily tell whether setup is an hour of work or weeks of waiting.

Two things get mixed up in that confusion:

| Layer | Who does it | Happens |
|---|---|---|
| **Provider OAuth app** (client ID/secret, redirect URIs, scopes, sometimes review) | The developer, once per integration | At build time |
| **User connection** (consent screen, token) | Each end user | At runtime |

Composio **managed OAuth** can remove the first layer for supported apps. It does not remove user consent, and it does not automatically cover branded consent screens, custom scopes, quotas, or provider review. So the first question OAuth Atlas asks is: *does managed auth fit this connection?* A custom OAuth app is the fallback, not the default.

## 2. What it does

1. **Directory.** A searchable snapshot of **118 Composio managed-OAuth entries**, checked on 2026-10-28. This is a discovery list, **not** 118 guides. Each entry is labelled separately from a researched guide.
2. **Curated guides (5).** GitHub, Slack, Google, Airtable, Asana. Each guide leads with:
   - recommended integration path (managed vs custom)
   - **hands-on effort** vs **external waiting** (kept separate on purpose)
   - blockers and approval dependencies
   - next actions
   - what the agent can do vs where you take over
   - linked sources and a verification status
3. **Live generation.** Enter an app name or public website URL. The backend researches it and returns a structured, shareable guide.

## 3. How live generation works

```
name / URL -> validate input -> Tavily search -> Gemini (structured JSON)
           -> Zod schema check -> citation check -> guide + share link
```

- **Input checks:** only public HTTP(S) URLs. Localhost, private IPs, credentials in URLs, and internal hostnames are rejected. The server never fetches user-supplied URLs; it only searches the string.
- **Research:** Tavily searches provider OAuth requirements and Composio managed-auth context. Results are treated as *untrusted candidate evidence*.
- **Generation:** Gemini gets a bounded set of results and must return JSON matching the guide schema. It is told not to invent scopes, review times, URLs, or tests.
- **Validation:** Zod validates the output. The backend rejects citations that don't exactly match retrieved result IDs or that point to low-relevance results.
- **Failure behaviour:** Gemini 5xx errors are retried twice. If Gemini stays down but relevant sources exist, the app returns a clearly labelled **source-first fallback** with explicit unknowns. If evidence is insufficient, you get an error, not a made-up guide.
- **Sharing:** the guide is base64url-encoded in the URL fragment (`#guide=...`). Fragments are never sent to the server, so no database is needed.

Stack: React, TypeScript, Vite, Tailwind, React Router, Zod, Vercel serverless function (`/api/guides`).

## 4. Key decisions

| Decision | Why |
|---|---|
| Managed OAuth first | Avoids app registration and credential handling when it fits; custom setup only when requirements demand it. |
| Separate effort from waiting | "30 minutes of config + unknown review time" is more useful than one blended estimate. |
| "Unknown" is a valid answer | Timelines and scopes are only stated when a source supports them. Inferences are labelled as inferences. |
| Be explicit about agent limits | Agents can research, organise, and flag blockers. They can't create accounts, hold your credentials, click consent, or pass provider review. |
| Depth over breadth | 5 verified-quality guides beat 100 unchecked ones. The directory is labelled as a snapshot so it doesn't overclaim. |

## 5. What the agent does vs. what you do

| Step | Agent | You |
|---|---|---|
| Find official docs and requirements | Yes | Spot-check sources |
| Pick managed vs custom path | Recommends | Confirm against your needs (branding, scopes, quotas) |
| List scopes, redirect URIs, blockers | Drafts from sources | Verify in the provider console |
| Create the provider OAuth app | **No** | Yes |
| Store client secret / credentials | **No** | Yes (server-side only) |
| User consent | **No** | Each end user |
| Provider review / verification | **No** | You submit and wait |

## 6. Evidence: what was tested and what wasn't

> Fill in the TODO rows before submitting. Do not leave claims here that you haven't actually done.

### Documentation review (done)

The five curated guides were checked against official documentation (links in Section 9). **No provider console was accessed and no OAuth flow was run for these guides** unless a row below says otherwise.

### Verification log

| # | Claim in guide | How checked | Result | Date |
|---|---|---|---|---|
| 1 | TODO (e.g. GitHub OAuth app needs a callback URL at creation) | TODO: created a real GitHub OAuth app | TODO: confirmed / corrected / unverifiable | TODO |
| 2 | TODO (e.g. Slack app requires redirect URL configured before install) | TODO: created a Slack app | TODO | TODO |
| 3 | TODO (e.g. Google sensitive scopes require verification) | TODO: checked official verification docs / consent screen UI | TODO | TODO |
| 4 | TODO | TODO | TODO | TODO |
| 5 | TODO | TODO | TODO | TODO |

**Corrections made as a result:** TODO (list what you changed in the guides and why, or write "none found" honestly).

**Could not verify:** TODO (e.g. actual Google verification turnaround, Slack Marketplace review time).

### Live generation tests

| App tried | Result | Notes (sources found, unknowns flagged, failures) |
|---|---|---|
| TODO (e.g. Notion) | TODO | TODO |
| TODO (e.g. HubSpot) | TODO | TODO |
| TODO (e.g. Linear) | TODO | TODO |

If any of these haven't been run with real Tavily and Gemini keys, say so here instead of leaving it blank.

## 7. Run locally

Requirements: Node.js 20+ and pnpm (or npm).

```bash
pnpm install
cp .env.example .env.local
# add server-only keys to .env.local (never commit this file)
pnpm dev
```

Curated guides and the directory work without keys. Live research needs Tavily and Gemini keys.

| Variable | Required for | Notes |
|---|---|---|
| `TAVILY_API_KEY` | Live research | Server-side only |
| `GEMINI_API_KEY` | Live research | Server-side only |
| `GEMINI_MODEL` | Optional | **Check the current model list at https://ai.google.dev/gemini-api/docs/models and set a model that exists and supports structured output.** Do not rely on the default without confirming. |

Never use a `VITE_` prefix for secrets.

```bash
pnpm typecheck
pnpm test     # covers URL safety, schema validation, citation integrity
pnpm build
```

### Deploy to Vercel

Import the repo, add `TAVILY_API_KEY` and `GEMINI_API_KEY` as server-side environment variables, deploy, then open `/generate` and test a real app. No credentials are in this repository.

## 8. Limitations

- **Guides are only as good as their sources.** Curated guides are documentation-reviewed, not flow-tested, except where the verification log says otherwise.
- **Live results are research output, not proof.** Retrieved sources are labelled as search results. Confirm provider ownership of each source before relying on it.
- **Directory is a snapshot.** 118 entries as of 2026-10-28; it can drift from Composio's live list. Confirm the exact auth scheme in Composio before choosing a path.
- **Rate limiting is per serverless instance** (in-memory, 5 requests/min). Not shared across instances; use a shared limiter or auth before public release.
- **Share links can't be revoked** and carry the full guide content in the URL. Only share with people who should see it. Checklist progress is stored locally in the browser.
- **Quotas and availability** of Tavily and Gemini affect live generation.
- **Approval timelines** are shown as unknown unless documented.

## 9. Sources used for curated guides

- Composio: [Managed Auth](https://docs.composio.dev/toolkits/managed-auth), [managed vs custom apps](https://docs.composio.dev/docs/authentication/custom-app-vs-managed-app), [toolkit directory](https://composio.dev/toolkits)
- GitHub: [Create an OAuth app](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app), [Authorize OAuth apps](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps), [Org app approval](https://docs.github.com/en/organizations/managing-oauth-access-to-your-organizations-data/approving-oauth-apps-for-your-organization)
- Slack: [Install with OAuth](https://docs.slack.dev/authentication/installing-with-oauth/), [App distribution](https://api.slack.com/docs/slack-apps-mgmt), [Marketplace review](https://api.slack.com/directory/app-review-guide)
- Google: [OAuth overview](https://developers.google.com/identity/protocols/oauth2), [Scopes](https://developers.google.com/identity/protocols/oauth2/scopes), [Sensitive-scope verification](https://developers.google.com/identity/protocols/oauth2/production-readiness/sensitive-scope-verification), [Policies](https://developers.google.com/identity/protocols/oauth2/policies)
- Airtable: [Builder Hub](https://support.airtable.com/articles/9362950318-using-builder-hub-in-airtable), [OAuth overview](https://support.airtable.com/articles/6811769763-third-party-integrations-via-oauth-overview), [Disconnected integrations](https://support.airtable.com/articles/6412360049-troubleshooting-disconnected-oauth-integrations)
- Asana: [OAuth](https://developers.asana.com/docs/oauth), [Scopes](https://developers.asana.com/docs/oauth-scopes), [Share your app](https://developers.asana.com/docs/share-your-app), [Publish your app](https://developers.asana.com/docs/publish-your-app)
- Services: [Tavily Search API](https://docs.tavily.com/documentation/api-reference/endpoint/search), [Gemini structured output](https://ai.google.dev/gemini-api/docs/structured-output), [Vercel Node.js functions](https://vercel.com/docs/functions/runtimes/node-js)

## 10. What I'd do next

1. **Test real flows.** Create OAuth apps for a sample of providers and record actual time, steps, and surprises; fold corrections back into the guides.
2. **Improve trust.** Add "last verified" dates, flag stale or uncertain guidance, and handle generation failures more gracefully.
3. **Build for repeat use.** Persistent guide storage with access control, version history, shared rate limiting, and a larger library, added only as fast as evidence quality allows.
