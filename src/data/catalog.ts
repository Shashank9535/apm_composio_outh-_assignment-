/**
 * Snapshot of the apps listed under “Composio Managed App Available” on
 * https://docs.composio.dev/toolkits/managed-auth, reviewed 2026-10-28.
 * This is a discovery index, not a promise that every scheme/scope is managed.
 * The guide detail page must still verify the exact OAuth method and scopes.
 */
export const managedAuthApps = `Airtable
Apaleo
Asana
Attio
Basecamp
Bitbucket
Blackbaud
Boldsign
Box
Cal
Calendly
Canva
Capsule CRM
ClickUp
Confluence
Contentful
Crowdin
Dart
Dialpad
DigitalOcean
Discord
Discord Bot
Dropbox
Dub
Dynamics 365
Eventbrite
Excel
Exist
Facebook
Fathom
Figma
Freeagent
FreshBooks
GitHub
GitLab
Gmail
Gong
Google Ads
Google Analytics
Google BigQuery
Google Calendar
Google Classroom
Google Docs
Google Drive
Google Maps
Google Meet
Google Photos
Google Search Console
Google Sheets
Google Slides
Google Super
Google Tasks
Gorgias
Gumroad
Harvest
HubSpot
Hugging Face
Instagram
Intercom
Jira
Kit
Linear
LinkedIn
Linkhut
Mailchimp
Microsoft Teams
Miro
Monday
Moneybird
Mural
Notion
Omnisend
OneDrive
Outlook
PagerDuty
Prisma
Productboard
Pushbullet
QuickBooks
Reddit
Reddit Ads
Roam
Salesforce
Sentry
Servicem8
SharePoint
Shippo
Slack
Slackbot
Splitwise
Square
Stack Exchange
Strava
Stripe
Supabase
Ticketmaster
Ticktick
Timely
Todoist
Toneden
Trello
Typeform
WakaTime
Webex
WhatsApp
Wrike
Yandex
YNAB
YouTube
Zendesk
Zoho
Zoho Bigin
Zoho Books
Zoho Desk
Zoho Inventory
Zoho Invoice
Zoho Mail
Zoom`.split('\n').map((name) => ({
  name,
  slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}));

export const managedAuthDirectoryUrl = 'https://docs.composio.dev/toolkits/managed-auth';
export const managedAuthSnapshotDate = '2026-10-28';

