# Engineering Systems Atlas

## Naming Evaluation

`knowledge_map` is the implementation-facing name, while `engineering systems atlas` is the design and conceptual framing.

It communicates:

- structured conceptual navigation
- domain relationships
- navigable knowledge topology

It is stronger than:

- `graph_navigation` (too implementation-oriented)
- `topic_map` (too generic)
- `site_topology` (too infrastructure-flavored)
- `concept_graph` (too academic)

Potential future alternatives if scope evolves:

- `knowledge_topology`
- `domain_topology`
- `systems_map`
- `knowledge_navigation`

For now:

```txt
knowledge_map
```

is the correct pragmatic choice.

The distinction should be:

```txt
Implementation artifact: knowledge_map
Design system identity: engineering_systems_atlas
```

This preserves pragmatic file/component naming while giving the system a stronger conceptual and visual identity.

See [prototype](./prototypes/sample_layout.html).

---

## External Structural References

### Roadmap.sh SQL Roadmap

A saved local webarchive of the Roadmap.sh SQL roadmap should be treated as a concrete structural reference.

Why it is valuable:

- curated spatial topology
- deterministic node positioning
- hierarchical progression
- visible concept clustering
- lightweight interaction
- macro-to-micro drilldown
- preserved layout for future inspection

Adopt:

- fixed conceptual layout
- stable visual regions
- deterministic positioning
- progressive drilldown
- visual grouping of related concepts

Avoid:

- excessive density
- checklist-like educational framing
- node saturation
- visual clutter
- roadmap-as-curriculum aesthetics

The `mroux.net` implementation should reinterpret this pattern through a calmer systems-oriented design language.

---

### Francis Miller — Content Structure Maps

Francis Miller's content structure maps article, especially the illustrated map under "Building a Second Brain by Tiago Forte", is a strong structural reference for hierarchical conceptual decomposition.

Why it is valuable:

- clearly shows how a broad concept decomposes into smaller concepts
- supports multiple levels of abstraction
- prioritizes reader orientation over novelty
- expresses containment and conceptual grouping clearly
- avoids the ambiguity of generic graph clouds

Adopt:

- multi-level abstraction
- hierarchical decomposition
- explicit grouping
- structure as a comprehension aid
- maps at different levels of detail

Reinterpret:

- visual style
- density
- academic/pedagogical framing
- text-heavy labeling

The atlas should use this as a structural reference, not as a final visual style reference.

---

### Reference Synthesis

The atlas should synthesize:

```txt
Roadmap.sh spatial topology
+
Content Structure Maps hierarchical decomposition
+
Cloudflare/Radar-style systems polish
+
minimal technical documentation clarity
```

The desired result is not a mind map, curriculum checklist, or force-directed graph.

The desired result is:

```txt
minimal engineering systems atlas
```

---

## Purpose

The engineering systems atlas is a persistent visual navigation system for the site.

Its purpose is to communicate conceptual structure rather than merely page hierarchy.

Traditional site navigation communicates:

- route structure
- page grouping
- chronological ordering

The engineering systems atlas should instead communicate:

- conceptual relationships
- domain boundaries
- topic adjacency
- knowledge hierarchy
- thematic overlap

The atlas should transform the site from:

```txt
portfolio + blog
```

into:

```txt
navigable engineering knowledge system
```

---

## Core Rationale

This system supports:

The atlas should feel less like a navigation widget and more like a persistent systems-oriented conceptual layer across the site.

### Structured Knowledge Capture

It provides explicit representation of how concepts relate.

Example:

```txt
DNSSEC
  -> trust chains
  -> distributed state
  -> observability
  -> propagation
```

This makes relationships visible rather than implicit.

---

### Reader Orientation

Visitors should immediately understand:

- what major domains exist
- where the current page belongs
- adjacent areas worth exploring
- conceptual progression paths

---

### Visual Cohesion

The atlas becomes part of the site's identity.

It creates:

- recognizable structure
- consistent navigation language
- stronger conceptual branding

---

### Knowledge Density Signaling

The atlas's structured topology visually signals:

- systems thinking
- architectural rigor
- deliberate organization

This aligns strongly with the intended professional signal of the site.

---

## Design Principles

### Curated, Not Emergent

The atlas topology must be intentionally designed.

Do not use:

- force-directed graphs
- automatic layout engines
- unstable node positioning
- physics simulation

Reason:

These introduce visual noise and reduce usability.

The layout should be:

```txt
stable and deliberate
```

---

### Spatial Stability

Atlas nodes should maintain fixed positions.

Users should build spatial familiarity.

Repeated visits should reinforce:

- memory of topic location
- domain relationships
- conceptual pathways

This creates cognitive continuity.

---

### Progressive Disclosure

The atlas should reveal complexity gradually.

Initial display:

- macro domains
- high-level relationships

Interaction may reveal:

- subdomains
- articles
- projects
- related concepts

Avoid immediate visual overload.

---

### Multi-Level Detail

The atlas should support multiple levels of detail instead of forcing every concept into one diagram.

Recommended levels:

```txt
Level 1: macro domains
Level 2: subdomains
Level 3: topics
Level 4: artifacts/pages
```

This follows the useful pattern from content structure maps: a high-level map should orient, while deeper maps should explain local structure.

Do not force all nodes, artifacts, and relationships into one global view.

---

### Semantic Accuracy

Visual adjacency in the atlas must reflect genuine conceptual relationships.

Do not connect nodes merely for aesthetics.

Connections should communicate:

- dependency
- influence
- conceptual overlap
- layering
- progression

---

## Conceptual Structure

Recommended hierarchy:

```txt
Domain
  -> Subdomain
    -> Topic
      -> Artifact
```

This hierarchy should be treated as containment structure, not as the only relationship type.

Containment answers:

```txt
What does this concept belong to?
```

Edges answer:

```txt
How does this concept relate to another concept?
```

Where:

### Domain

Broad conceptual regions.

Examples:

- Infrastructure
- Software Engineering
- Data Systems
- Distributed Systems
- AI Systems

---

### Subdomain

Focused conceptual clusters.

Examples:

Infrastructure:

- DNS
- Cloud Platforms
- Security
- Observability

Data Systems:

- PostgreSQL
- ClickHouse
- Scaling
- Replication

---

### Topic

Specific technical concepts.

Examples:

- DNSSEC
- WAL
- Replication Lag
- SOLID
- Backpressure

---

### Artifact

Concrete site content.

Examples:

- article
- benchmark
- project
- systems note

---

### Relationship Semantics

Relationship labels on the atlas are not tags or subtags.

They are edge semantics: short explanations of why two nodes are connected.

Examples:

```txt
Polling State -> Observability: validates
Replication -> Consistency: convergence
Abstraction -> Architecture: boundary design
Propagation & Caching -> Consistency: resolver cache divergence
```

Use relationship semantics sparingly.

They should help explain cross-domain relationships, not become a second taxonomy.

Initial guidance:

- nodes map to topics/tags/pages
- containers map to domains/subdomains
- labeled edges map to conceptual relationships

Avoid turning every relationship into a navigable tag.

---

## Initial V1 Domains

The existing content themes support immediate implementation.

### Infrastructure

Topics:

- DNSSEC
- Cloudflare
- DNS propagation
- distributed trust

---

### Software Engineering

Topics:

- SOLID
- architecture
- abstraction
- design tradeoffs

---

### Data Systems

Topics:

- PostgreSQL scaling
- write throughput
- replication
- storage systems

---

These provide sufficient initial density for a coherent first map.

---

## Visual Representation

Recommended format:

```txt
curated SVG topology
```

```txt
engineering systems atlas rendered as curated SVG topology
```

Why SVG:

- deterministic layout
- responsive scaling
- semantic structure
- CSS styling
- Astro compatibility
- static hosting friendly
- accessibility support

Avoid:

- Canvas
- WebGL
- heavy graph libraries

The visual language should feel closer to:

```txt
technical architecture diagram
+
map legend
+
systems control surface
```

than:

```txt
mind map
+
social graph
+
course roadmap
```

---

## Layout Model

Recommended layout:

```txt
macro blocks arranged spatially
with visible connective pathways
```

Possible arrangement:

```txt
          Infrastructure
                |
Distributed Systems --- Data Systems
                |
      Software Engineering
                |
           AI Systems
```

Containers should be used to prevent the diagram from degrading into visual spaghetti.

Preferred visual grouping:

```txt
Domain container
  Subdomain block
    Topic node
```

Cross-domain edges should be sparse and meaningful.

Exact geometry should be visually refined later.

---

## Interaction Model

Minimum interaction:

### Hover

Reveal:

- label emphasis
- relationship highlighting
- topic preview

---

### Active Page Highlighting

Current page should:

- illuminate active node
- emphasize connected neighbors
- visually anchor current context

---

### Click Navigation

Nodes should route directly to relevant pages.

---

### Optional Expansion

Subdomains may expand/collapse later.

Not required for v1.

---

### Edge Label Reveal

Relationship labels should not all be visible at once in the production atlas.

Preferred behavior:

- show primary domain and topic labels by default
- show relationship labels on hover/focus
- emphasize connected nodes when an edge is active
- keep cross-domain links visually subtle until needed

This preserves conceptual richness without overwhelming the reader.

---

## Metadata Requirements

Content should eventually support map metadata.

Example:

```yaml
knowledge_domain: data-systems
knowledge_subdomain: postgres
knowledge_topics:
  - write-throughput
  - scaling
related_topics:
  - replication
  - storage
```

This enables build-time map generation and highlighting.

---

## Placement Strategy

The atlas should appear consistently.

Recommended options:

### Option 1 — Persistent Compact Sidebar

Strong orientation, desktop-friendly.

---

### Option 2 — Header/Navigation Embedded Map

Cleaner but less expressive.

---

### Option 3 — Contextual Inline Map (Recommended)

Each page renders:

- compact global topology
- active-node emphasis

This balances:

- visibility
- clarity
- responsiveness

---

## Responsive Behavior

Desktop:

- full topology visualization

Mobile:

- simplified condensed map
- or macro-domain-only representation

Avoid forcing full graph density on narrow screens.

---

## Implementation Order

Phase 1:

- static SVG
- hardcoded nodes
- manual links
- active page highlighting

Phase 2:

- metadata-driven highlighting
- reusable component abstraction

Phase 3:

- subdomain expansion
- richer interaction

---

## Non-Goals

Do not implement initially:

- arbitrary graph editing
- drag-and-drop topology changes
- physics simulation
- user customization
- runtime graph generation
- analytics-driven layout

This is a navigation system, not a visualization experiment.

---

## Success Criteria

The engineering systems atlas succeeds if it helps users:

- understand site conceptual structure quickly
- discover adjacent topics naturally
- develop spatial familiarity
- perceive the site as a coherent systems-oriented knowledge artifact
- establish a recognizable atlas-like identity unique to the site

---

## Immediate Recommendation

Build V1 soon.

Current content density is sufficient.

Target:

```txt
1 curated SVG
3–5 macro domain containers
10–15 visible topic nodes
sparse cross-domain edges
hover/focus relationship reveal
active-page highlighting
simple click navigation
```

This is enough to establish the initial atlas pattern while keeping implementation complexity low.

The long-term objective is a recognizable engineering systems atlas that becomes a primary differentiator of the site.
