# Content Model

## Required Routes

Initial routes:

- `/`
- `/about`
- `/projects`
- `/writing`
- `/systems`
- `/benchmarks`
- `/stats`
- `/resume`
- `/404`

## Content Collections

Use Astro content collections for durable structured content.

Recommended collections:

- `blog`
- `projects`
- `systems`
- `benchmarks`

Suggested directory structure:

```txt
src/
  content/
    blog/
    projects/
    systems/
    benchmarks/
  layouts/
  components/
  pages/
```

## Blog Collection

Purpose:

- technical articles
- learning notes
- engineering reflections
- implementation writeups

Suggested frontmatter:

```yaml
title: "Example Article"
description: "Short summary of the article."
date: "2026-05-12"
updated: "2026-05-12"
status: "draft"
tags:
  - systems
  - rust
  - cloudflare
slug: "example-article"
```

Allowed statuses:

- `draft`
- `published`
- `archived`

Only published posts should appear in public indexes unless explicitly intended.

## Projects Collection

Purpose:

- curated engineering projects
- repositories
- architecture notes
- benchmark labs
- implementation artifacts

Suggested frontmatter:

```yaml
title: "Protocol Benchmark Lab"
description: "A protocol and language benchmarking harness for comparing implementation tradeoffs."
status: "active"
featured: true
started: "2026-04-01"
tags:
  - rust
  - go
  - protocols
  - benchmarking
repo_url: "https://github.com/example/protocol-benchmark-lab"
external_url: ""
slug: "protocol-benchmark-lab"
```

Allowed statuses:

- `active`
- `paused`
- `complete`
- `archived`

## Systems Collection

Purpose:

- systems design notes
- failure-mode analysis
- architecture principles
- protocol notes
- operational tradeoff documents

Suggested frontmatter:

```yaml
title: "Kafka Partition Failure Modes"
description: "Notes on slow processors, failed processors, and partition imbalance."
date: "2026-05-12"
updated: "2026-05-12"
tags:
  - kafka
  - distributed-systems
  - reliability
slug: "kafka-partition-failure-modes"
```

## Benchmarks Collection

Purpose:

- benchmark summaries
- methodology notes
- performance experiments
- reproducible result pages

Suggested frontmatter:

```yaml
title: "Sieve Work Endpoint Benchmark"
description: "Benchmark notes for CPU-bound work endpoint implementations."
date: "2026-05-12"
updated: "2026-05-12"
status: "draft"
tags:
  - benchmarking
  - rust
  - go
  - performance
slug: "sieve-work-endpoint-benchmark"
metrics:
  - name: "latency_p50"
    value: ""
  - name: "latency_p99"
    value: ""
  - name: "throughput"
    value: ""
```

## Stats Page

The `/stats` page should be generated from public static content metadata in v1.

Initial stats:

- published blog post count
- project count
- systems note count
- benchmark entry count
- total estimated word count
- latest content update
- most-used tags
- featured project count

Do not include private job-search metrics.

Do not include sensitive personal data.

Do not depend on Cloudflare Functions for v1.

## Internal Linking

Use root-relative links.

Good:

```html
<a href="/projects/protocol-benchmark-lab/">Protocol Benchmark Lab</a>
<a href="/writing/cloudflare-pages-site/">Cloudflare Pages Site</a>
```

Avoid:

```html
<a href="https://mroux.net/projects/protocol-benchmark-lab/">Protocol Benchmark Lab</a>
```

## URL Style

Prefer stable, readable slugs.

Good:

- `/projects/protocol-benchmark-lab`
- `/writing/cloudflare-pages-site`
- `/systems/kafka-partition-failure-modes`

Avoid:

- dates in URLs unless necessary
- overly long slugs
- implementation-specific route names

## Draft Handling

Draft content may exist in the repository but should not appear in public indexes.

If possible, exclude draft pages from production builds or clearly prevent them from being linked.

## Resume Route

The `/resume` page should link to public resume PDFs only when available.

It should not attempt to replace the resume.

It should explain that targeted resumes may vary by role.

## 404 Page

Create a custom `/404` page.

It should:

- explain the page was not found
- link back to `/`
- link to `/writing`
- link to `/projects`

## Content Quality Rules

Each project page should answer:

- what it is
- why it exists
- what tradeoff or problem it explores
- what technologies are involved
- what evidence/artifacts are available
- what the current status is

Each article should have:

- clear title
- short description
- date
- tags
- concise introduction
- useful conclusion or takeaway
