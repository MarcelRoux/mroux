# Site Brief

## Purpose

`mroux.net` is Marcel Roux’s canonical professional site.

It exists to provide a coherent representation layer that is not constrained by LinkedIn’s scanning format, GitHub’s repo-centric structure, or the one-to-two-page resume format.

The site should communicate:

- professional identity
- engineering judgment
- systems experience
- technical writing
- project artifacts
- learning trajectory
- selected public statistics

## Positioning

The site should position Marcel as a software engineer focused on:

- backend systems
- data systems
- distributed systems
- high-throughput ingestion
- Rust, Python, Kafka, PostgreSQL, ClickHouse, Redis
- AI-assisted engineering workflows
- performance-aware systems design
- reliable engineering execution

The tone should be professional, restrained, technical, and clear.

## Relationship to Other Platforms

### LinkedIn

LinkedIn remains the discovery and recruiter-facing surface.

The site should provide the deeper version of the story that LinkedIn cannot comfortably hold.

### GitHub

GitHub remains the code and artifact surface.

The site should curate and explain selected repositories instead of assuming visitors will infer value from raw code.

### Resume

The resume remains the ATS and application artifact.

The site should provide broader context, project depth, writing, and professional narrative.

## Target Audience

Primary audiences:

- technical recruiters
- hiring managers
- senior engineers
- engineering leaders
- collaborators
- future self

The site should be understandable to recruiters while still being credible to engineers.

## Repository

Recommended repository name:

- `mroux`

The repository should be public.

## Domain

Canonical production domain:

- `mroux.net`

Internal site links should not hard-code this domain.

Use root-relative links so the site can move domains if needed.

## Hosting

Deployment target:

- Cloudflare Pages
- GitHub integration
- static build output
- no backend for v1

## Initial Success Criteria

The first version is successful when it provides:

- a polished homepage
- clear about page
- project index
- writing index
- stats page
- resume page
- 404 page
- responsive layout
- clean typography
- simple extensible content model
- Cloudflare Pages-compatible deployment

## Non-Goals for v1

Do not build:

- authentication
- comments
- CMS
- database
- Docker deployment
- custom analytics backend
- newsletter system
- search engine
- user accounts
- dynamic dashboards

These can be considered later only after the static site is useful.
