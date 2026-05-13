
# Cloudflare Pages Setup

## Goal

Deploy the `mroux` Astro-based static personal site to Cloudflare Pages using:

- GitHub integration
- pnpm
- static site generation
- custom domain (`mroux.net`)
- automatic deployments from `main`

This document establishes the exact setup flow from:

- local development
- GitHub repository
- Cloudflare account creation
- DNS migration
- production deployment

The target architecture is:

```txt
GitHub
  ↓
Cloudflare Pages
  ↓
Cloudflare CDN + TLS + DNS
  ↓
mroux.net
```

---

# High-Level Deployment Philosophy

The site should remain:

- static-first
- operationally simple
- globally cached
- low-maintenance
- low-cost
- secure by default

Avoid introducing:

- backend services
- databases
- authentication
- Docker infrastructure
- Cloudflare Functions
- Workers
- server-side rendering

unless explicitly required later.

The initial deployment goal is:

```txt
simple, durable, fast, maintainable
```

---

# Prerequisites

## Required Accounts

### GitHub

Required for:

- source control
- repository hosting
- Cloudflare Pages Git integration

### Domain Registrar

A purchased domain is required.

Current domain:

```txt
mroux.net
```

The domain may currently be managed elsewhere.

### Cloudflare Account

Cloudflare will provide:

- DNS
- CDN
- TLS certificates
- deployment hosting
- security layer
- Pages hosting
- optional analytics

A free account is sufficient.

---

# Local Development Setup

## Install Node.js

Recommended:

- `fnm`
- `mise`

Avoid using outdated system Node installations.

Verify:

```bash
node --version
```

---

## Enable Corepack

Corepack manages package manager versions.

```bash
corepack enable
```

---

## Install pnpm

```bash
corepack prepare pnpm@latest --activate
```

Verify:

```bash
pnpm --version
```

---

# Astro Project Initialization

## Create Astro Site

Inside the repository root:

```bash
pnpm create astro@latest temp-site
```

Recommended answers:

```txt
Template:
→ Empty

TypeScript:
→ Yes

Install dependencies:
→ Yes

Initialize git:
→ No
```

---

## Move Astro Files Into Repository Root

```bash
mv temp-site/* .
mv temp-site/.* . 2>/dev/null
rmdir temp-site
```

---

## Install Dependencies

```bash
pnpm install
```

---

## Approve Build Scripts

pnpm may block native dependency build scripts.

Run:

```bash
pnpm approve-builds
```

Approve:

- `esbuild`
- `sharp`

Then:

```bash
pnpm install
```

---

## Start Local Development Server

```bash
pnpm run dev
```

Expected:

```txt
http://localhost:4321
```

Verify:

- homepage loads
- routing works
- responsive layout functions
- no console errors exist

---

# Initial Repository Structure

Recommended structure:

```txt
mroux/
  AGENTS.md
  docs/
  public/
  scripts/
  src/
    components/
    content/
      blog/
      projects/
      systems/
      benchmarks/
    layouts/
    pages/
  astro.config.mjs
  package.json
  tailwind.config.mjs
```

---

# Initial Required Pages

Before deployment, ensure these routes exist:

```txt
/
/about
/projects
/writing
/stats
/404
```

Placeholder content is acceptable initially.

The objective is deployment validation first.

---

# Push Repository To GitHub

## Initialize Git

If not already initialized:

```bash
git init
```

---

## Initial Commit

```bash
git add .
git commit -m "Initial Astro site scaffold"
```

---

## Create GitHub Repository

Recommended repository name:

```txt
mroux
```

Repository visibility:

```txt
Public
```

---

## Add Remote

```bash
git remote add origin git@github.com:<username>/mroux.git
```

---

## Push

```bash
git branch -M main
git push -u origin main
```

Verify:

- repository is visible on GitHub
- all expected files exist
- no secrets were committed

---

# Create Cloudflare Account

## Sign Up

Create account:

```txt
https://dash.cloudflare.com/sign-up
```

A free account is sufficient.

---

# Add Domain To Cloudflare

## Add Site

Inside Cloudflare dashboard:

```txt
Add a Site
→ Enter mroux.net
→ Select Free Plan
```

Cloudflare will:

- scan existing DNS records
- import current records
- generate Cloudflare nameservers

---

## Update Nameservers At Registrar

Cloudflare will provide nameservers similar to:

```txt
abby.ns.cloudflare.com
max.ns.cloudflare.com
```

Go to the domain registrar and replace the existing nameservers with the Cloudflare-provided nameservers.

DNS propagation may take:

```txt
minutes → several hours
```

Verify inside Cloudflare dashboard that the domain becomes:

```txt
Active
```

---

# Create Cloudflare Pages Project

## Navigate To Pages

Inside Cloudflare dashboard:

```txt
Workers & Pages
→ Create
→ Pages
→ Connect to Git
```

---

## Connect GitHub

Authorize Cloudflare to access GitHub.

Then:

```txt
Select repository:
→ mroux
```

---

# Configure Build Settings

Use:

```txt
Framework preset:
→ Astro
```

Expected generated values:

```txt
Build command:
pnpm run build

Build output directory:
dist
```

Branch:

```txt
main
```

---

# Deploy Initial Site

Click:

```txt
Save and Deploy
```

Cloudflare will:

- clone repository
- install dependencies
- run build
- upload static assets
- distribute globally

Initial deployment may take several minutes.

---

# Verify Initial Deployment

Cloudflare will provide a temporary domain:

```txt
https://<project>.pages.dev
```

Verify:

- homepage loads
- routes work
- CSS loads correctly
- mobile layout works
- 404 page works
- no broken assets exist

---

# Attach Custom Domain

## Add Domain

Inside:

```txt
Pages Project
→ Custom Domains
→ Set up a custom domain
```

Add:

```txt
mroux.net
```

Cloudflare should automatically configure:

- DNS records
- TLS certificates
- HTTPS
- routing

Verify:

```txt
https://mroux.net
```

loads successfully.

---

# Automatic Deployment Flow

Once configured:

```txt
git push
  ↓
GitHub
  ↓
Cloudflare Pages rebuild
  ↓
Global deployment
```

No manual deployment step is required.

---

# Adding New Pages

Example:

```txt
src/pages/about.astro
→ /about
```

Blog-style content:

```txt
src/content/blog/example-article.md
```

Then:

```bash
git add .
git commit -m "Add article"
git push
```

Cloudflare automatically rebuilds and deploys.

---

# Internal Linking Rules

Use:

```html
<a href="/projects">Projects</a>
```

Avoid:

```html
<a href="https://mroux.net/projects">Projects</a>
```

Root-relative links allow:

- domain migration
- preview deployments
- local development consistency

---

# Cloudflare Web Analytics

Optional initial enhancement.

Cloudflare Web Analytics provides:

- page views
- visitors
- top pages
- referrers
- browser/device metrics

without requiring a backend.

Enable later once the site structure stabilizes.

Do not prioritize analytics before core content exists.

---

# Recommended Early Content

Before prominently sharing the site publicly, aim for:

- coherent homepage
- strong about page
- projects index
- 2–4 serious project pages
- 1 substantial technical article
- working stats page
- responsive/mobile-safe layout
- clean typography

---

# Security Notes

The static deployment model is intentionally low-risk.

Benefits:

- no exposed backend
- no database attack surface
- no auth/session management
- Cloudflare CDN + TLS by default
- DDoS mitigation included
- globally cached assets

Still avoid:

- committing secrets
- exposing private APIs
- publishing sensitive infrastructure details

---

# Future Optional Enhancements

Only consider later:

- RSS feed
- sitemap
- generated stats automation
- GitHub API integrations
- benchmark visualizations
- Cloudflare Web Analytics
- search
- dark mode toggle

Do not prematurely optimize infrastructure.

---

# Final Guiding Principle

The site should evolve into:

```txt
an engineering knowledge surface
```

not merely:

```txt
a portfolio website
```

The focus is:

- durable technical writing
- engineering artifacts
- systems thinking
- longitudinal proof-of-work
- coherent professional identity
