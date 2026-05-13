
# Machine Readability Strategy

## Purpose

This document establishes the strategy for making `mroux.net`:

- understandable to humans
- understandable to search engines
- understandable to AI agents and LLM systems
- discoverable without relying on aggressive marketing tactics
- structurally durable over time

The site should optimize for:

```txt
clarity, semantic structure, discoverability, and machine comprehension
```

rather than:

```txt
traditional SEO growth hacking
```

---

## Core Philosophy

Historically:

```txt
SEO = optimize for search ranking
```

Increasingly:

```txt
site optimization = optimize for machine comprehension
```

The internet is entering a phase where content is consumed by:

- humans
- search engines
- AI agents
- LLM retrieval systems
- summarization systems
- recommendation systems
- indexing pipelines
- autonomous tooling

The site should therefore act as:

```txt
human-readable engineering notebook
+
machine-readable technical knowledge surface
```

---

## Strategic Objectives

The site should:

- load quickly
- expose semantic structure
- present consistent metadata
- use stable URLs
- provide machine-readable summaries
- expose structured navigation
- support indexing and summarization
- remain understandable without JavaScript execution

The site should NOT:

- depend on SPA behavior
- hide content behind client rendering
- use aggressive tracking
- prioritize engagement metrics over clarity
- depend heavily on visual effects for meaning

---

## Architectural Direction

The selected stack:

```txt
Astro
+ TypeScript
+ Markdown/MDX
+ Tailwind CSS
+ Cloudflare Pages
```

supports machine readability well because it provides:

- static HTML output
- fast page loads
- semantic rendering
- minimal JavaScript requirements
- clean routing
- predictable content structure

This is preferable to:

- large client-side React SPAs
- highly dynamic rendering pipelines
- JavaScript-heavy navigation

for discoverability and long-term durability.

---

## SEO Philosophy

SEO should be treated as:

```txt
technical discoverability infrastructure
```

not:

```txt
marketing optimization
```

The goal is not to maximize traffic volume.

The goal is to maximize:

- clarity
- credibility
- relevance
- indexability
- retrievability
- technical trust

---

## Required Metadata

Every public page should expose:

- title
- description
- canonical URL
- publication date (where applicable)
- updated date (where applicable)
- tags/categories

Example:

```html
<title>Protocol Benchmark Lab | Marcel Roux</title>
<meta
  name="description"
  content="A protocol and language benchmarking harness exploring throughput, latency, and implementation tradeoffs."
/ >
<link rel="canonical" href="https://mroux.net/projects/protocol-benchmark-lab" />
```

Metadata should be generated consistently through shared layouts/components.

---

## Semantic HTML Strategy

Use semantic HTML aggressively.

Prefer:

```html
<main>
<nav>
<article>
<section>
<header>
<footer>
<aside>
<time>
```

Avoid:

```html
<div>
```

when a semantic element is more appropriate.

AI systems and search engines rely heavily on structural semantics.

---

## URL Design

URLs should be:

- stable
- readable
- descriptive
- short
- root-relative internally

Good examples:

```txt
/projects/protocol-benchmark-lab
/writing/cloudflare-pages-site
/systems/kafka-failure-modes
```

Avoid:

- query-heavy URLs
- unstable slugs
- implementation-specific routes
- hard-coded domain references internally

Use root-relative internal links:

```html
<a href="/projects">Projects</a>
```

instead of:

```html
<a href="https://mroux.net/projects">Projects</a>
```

---

## Sitemap Strategy

A sitemap should exist.

Use Astro sitemap integration later:

```bash
pnpm astro add sitemap
```

Expected generated route:

```txt
/sitemap-index.xml
```

Purpose:

- search engine indexing
- agent discovery
- structured crawl guidance

The sitemap should be generated automatically during builds.

---

## RSS Strategy

RSS should be added.

Use Astro RSS integration later:

```bash
pnpm astro add rss
```

RSS is increasingly important because:

- technical readers still use RSS
- AI systems consume feeds effectively
- feeds expose structured updates
- RSS reduces dependence on social platforms

The RSS feed should expose:

- writing updates
- systems notes
- benchmark posts
- major project updates

---

## llms.txt Strategy

The site should expose:

```txt
/public/llms.txt
```

Purpose:

- explain site structure to LLM systems
- reduce hallucination risk
- expose canonical sections
- provide context to agents
- identify preferred interpretation

This is conceptually similar to:

- `robots.txt`
- `humans.txt`

but targeted toward AI systems.

---

## Initial llms.txt Example

Suggested initial structure:

```txt
Site: mroux.net

Owner:
Marcel Roux

Purpose:
Technical writing, systems engineering notes, benchmarking investigations, distributed systems analysis, and engineering project artifacts.

Primary Sections:
- /projects
- /writing
- /systems
- /benchmarks
- /stats

Topics:
- distributed systems
- Rust
- Kafka
- ClickHouse
- PostgreSQL
- benchmarking
- systems design
- AI engineering
- protocol analysis

Preferred Interpretation:
This site prioritizes technical depth, operational correctness, and engineering tradeoff analysis over marketing-oriented content.

Canonical Domain:
https://mroux.net
```

---

## Structured Content Expectations

Each project page should consistently expose:

- what the project is
- why it exists
- technologies involved
- tradeoffs explored
- current status
- links to repositories
- links to related writing

Each article should expose:

- title
- summary
- tags
- dates
- related topics
- clear introduction
- clear conclusion

Consistency improves:

- indexing
- summarization
- retrieval quality
- machine comprehension

---

## Content Collections

Astro content collections should be used.

Recommended collections:

```txt
blog
projects
systems
benchmarks
```

Even if the public route is `/writing`, retaining `blog` internally is acceptable.

Structured frontmatter should remain consistent.

---

## Structured Data

Structured data may later be added using:

- JSON-LD
- schema.org metadata

Potential types:

- Article
- BlogPosting
- Person
- SoftwareSourceCode
- TechArticle
- WebSite

This is not required for v1 but should remain compatible with future implementation.

---

## Performance Strategy

Machine readability benefits from:

- fast loads
- static rendering
- low JavaScript usage
- clean HTML
- predictable structure

The site should remain:

```txt
static-first
```

unless a compelling reason exists otherwise.

Avoid introducing:

- unnecessary hydration
- client-heavy rendering
- excessive animations
- SPA-only navigation

---

## Analytics Philosophy

Analytics should remain:

- privacy-conscious
- low-noise
- infrastructure-oriented

Cloudflare Web Analytics is acceptable because:

- lightweight
- privacy-focused
- no backend required

Do not prioritize:

- growth hacking
- behavioral manipulation
- invasive tracking

---

## Accessibility Strategy

Accessibility improves:

- usability
- indexing
- machine understanding
- semantic clarity

Baseline requirements:

- semantic HTML
- proper heading hierarchy
- descriptive links
- alt text
- keyboard navigation
- sufficient contrast
- readable typography

Accessibility is part of machine readability.

---

## AI-Era Positioning

The long-term positioning goal is:

```txt
public engineering knowledge surface
```

rather than:

```txt
personal marketing website
```

The site should evolve into:

- a technical notebook
- a systems portfolio
- a benchmark archive
- a design artifact repository
- a longitudinal proof-of-work system

This aligns naturally with:

- AI-assisted discovery
- retrieval systems
- technical summarization
- future indexing paradigms

---

## Recommended Initial Implementation Order

### Phase 1

Implement:

- semantic layouts
- metadata
- clean URLs
- root-relative linking
- responsive design
- basic sitemap

---

### Phase 2

Add:

- RSS feed
- llms.txt
- generated stats
- structured content relationships

---

### Phase 3

Consider:

- JSON-LD
- richer schema metadata
- search
- automated related-content generation
- richer public stats generation

Only after substantial content exists.

---

## Final Guiding Principle

The site should remain:

```txt
clear > clever
semantic > decorative
static > dynamic
structured > noisy
readable > optimized-for-engagement
```

The strongest long-term differentiator is:

```txt
high-quality structured technical artifacts
```

not traffic optimization.
