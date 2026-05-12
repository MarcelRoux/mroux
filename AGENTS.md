# AGENTS.md

## Project

This repository contains the source for `mroux.net`, Marcel Roux’s personal professional site.

The site is intended to be a long-lived engineering identity layer, not a short-lived portfolio. It should present professional context, technical writing, projects, systems notes, benchmarks, and selected statistics in a coherent, minimal, static-first format.

## Stack

Use:

- Astro
- TypeScript
- Markdown / MDX
- Tailwind CSS
- Cloudflare Pages via GitHub integration

The default output must be static HTML/CSS/JS.

## Deployment Constraints

The site is deployed to Cloudflare Pages.

Assume:

- GitHub repository integration
- build command: `npm run build`
- output directory: `dist`
- canonical domain: `mroux.net`

Do not add Cloudflare Pages Functions, Workers, server-side rendering, databases, queues, KV, D1, R2, authentication, or dynamic backend behavior unless explicitly requested.

Prefer static generation and build-time data processing.

## Design Principles

Optimize for:

- calm technical credibility
- high signal density
- fast scanning
- readable long-form writing
- minimal visual noise
- responsive layouts
- accessibility
- durable content structure

Avoid:

- SaaS landing-page aesthetics
- excessive animation
- gradients as primary design language
- decorative UI that does not support reading
- over-engineered dynamic behavior
- hard-coded full-domain internal links

## Routing Rules

Use root-relative internal links.

Good:

- `/about`
- `/projects/protocol-benchmark-lab`
- `/writing/cloudflare-pages-site`

Avoid:

- `https://mroux.net/about`
- hard-coded production URLs for internal navigation

## Required Baseline Pages

The initial site should include:

- `/`
- `/about`
- `/projects`
- `/writing`
- `/systems`
- `/benchmarks`
- `/stats`
- `/resume`
- `/404`

## Content Rules

Use Markdown or MDX for durable content.

Prefer structured frontmatter for:

- title
- description
- date
- updated
- tags
- status
- project links
- repository links
- canonical slug

Keep content truthful, specific, and understated.

Do not invent metrics, employment claims, project maturity, benchmarks, or production usage.

## Statistics Rules

The `/stats` page should initially use build-time generated or static repository/content metadata.

Appropriate initial stats:

- number of published articles
- number of projects
- number of systems notes
- number of benchmark entries
- total written words
- latest content update
- technology tags used across content

Do not use Cloudflare analytics, private job-search data, credentials, or invasive visitor tracking in v1.

## Quality Bar

Before considering work complete:

- site builds successfully
- pages are responsive on mobile and desktop
- 404 page exists
- navigation is consistent
- internal links are root-relative
- no secrets are committed
- no backend/function dependency exists
- content structure is easy to extend
