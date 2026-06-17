---
title: "Cursor-Based Pagination in Production Systems Draft"
status: "draft"
created: "2026-05-26"
updated: "2026-05-26"
slug: "cursor-based-pagination-in-production-systems-draft"
summary: >
  Working draft exploring cursor pagination as a seek-based continuation
  pattern, with emphasis on production tradeoffs, API cursor design, and
  database behavior at scale.
publish_priority: "medium"
estimated_effort: "medium"
related_projects: []
related_articles: []
canonical_topics:
  - "API design"
  - "Pagination"
  - "PostgreSQL"
  - "Systems design"
tags:
  - "pagination"
  - "cursor-pagination"
  - "postgresql"
potential_sections: []
key_questions: []
hypotheses: []
references: []
artifacts:
  commands: []
  datasets: []
  diagrams: []
  screenshots: []
future_expansions: []
---

# Cursor-Based Pagination in Production Systems

## Why Cursor Pagination Exists

Pagination looks trivial until scale.

Most engineers begin with offset pagination:

^^^sql
SELECT *
FROM items
ORDER BY id
LIMIT 50 OFFSET 100000;
^^^

This works.

Until it doesn’t.

At large offsets, the database must still scan and discard all preceding rows before returning results.

That makes offset pagination asymptotically expensive:

- Page 1 → cheap
- Page 10 → acceptable
- Page 10,000 → expensive
- Deep analytical browsing → painful

Cursor pagination solves this by converting the problem from **scan-and-skip** into **seek-and-continue**.

---

## Offset vs Cursor

| Dimension | Offset Pagination | Cursor Pagination |
|-----------|------------------|-------------------|
| Complexity | Low | Moderate |
| Deep page performance | Degrades linearly | Near constant |
| Stability under inserts/deletes | Poor | Strong |
| Random page access | Supported | Not supported |
| Production scalability | Limited | Excellent |

The core distinction:

Offset asks:

> “Skip N rows.”

Cursor asks:

> “Continue after this exact row.”

That difference fundamentally changes database execution.

---

## The Critical Distinction: API Cursor vs Database Cursor

Many engineers confuse these.

They are completely different.

### API Cursor (What REST APIs Use)

A cursor is simply serialized positioning metadata:

^^^json
{
  "last_id": 184392
}
^^^

The client sends it back:

^^^
GET /items?cursor=184392
^^^

The database performs:

1. Open connection
2. Seek using index
3. Return rows
4. Close connection

Stateless.

Horizontally scalable.

Production-safe.

---

### Database Cursor (Usually Wrong for APIs)

A database cursor is state held open by the DB engine:

^^^sql
DECLARE my_cursor CURSOR FOR ...
FETCH 100 FROM my_cursor;
^^^

This keeps:

- connection state
- memory state
- transactional context

alive between requests.

At web scale this is disastrous.

Use DB cursors only for:

- batch exports
- ETL jobs
- streaming huge internal datasets
- long-running backfills

Never for public API pagination.

---

## Why Cursor Pagination Scales

Cursor pagination turns this:

^^^sql
OFFSET 100000
^^^

into this:

^^^sql
WHERE id > 184392
ORDER BY id
LIMIT 50
^^^

This allows direct B-tree index seeking.

Database cost becomes approximately:

**O(log N + page_size)**

instead of:

**O(N)**

That distinction becomes massive at scale.

---

## Production Example (FastAPI + PostgreSQL)

### Stateless Cursor Pagination

^^^python
@app.get("/items")
async def get_items(cursor: str = None, limit: int = 50):
    last_id = int(cursor) if cursor else 0

    query = """
        SELECT id, name
        FROM items
        WHERE id > :last_id
        ORDER BY id
        LIMIT :limit
    """
^^^

The response:

^^^json
{
  "data": [...],
  "next_cursor": "184442"
}
^^^

Simple.

Fast.

Stateless.

---

## Handling Mutable Data

Real systems change while users paginate.

### Inserts

New rows after the cursor naturally appear.

Safe.

### Deletes

If a row disappears, equality-based continuation can break.

Bad:

^^^sql
WHERE id = :cursor
^^^

Good:

^^^sql
WHERE id > :cursor
^^^

This skips missing rows safely.

---

## Composite Cursors

Sometimes no single monotonic key exists.

Example:

- timestamp
- category
- user_id

Postgres supports tuple comparison:

^^^sql
WHERE (timestamp, category, user_id)
   > (:ts, :cat, :user)
ORDER BY timestamp, category, user_id
^^^

This creates deterministic continuation.

The index must match exactly:

^^^sql
CREATE INDEX idx_page
ON analytics_data (timestamp, category, user_id);
^^^

Order mismatch destroys performance.

---

## Covering Index Optimization

If paginated queries only need a few columns:

^^^sql
CREATE INDEX idx_page_covering
ON analytics_data (timestamp, category, user_id)
INCLUDE (revenue);
^^^

This enables index-only scans.

No table heap lookup.

Lower latency.

Lower I/O.

---

## PostgreSQL vs ClickHouse

### PostgreSQL

Ideal for:

- user-facing APIs
- mutable datasets
- transactional consistency
- high concurrency

Supports tuple comparisons natively.

---

### ClickHouse

Ideal for:

- analytical feeds
- append-heavy workloads
- immutable event streams

Requires flattened lexicographic logic:

^^^sql
WHERE ts > :ts
   OR (ts = :ts AND category > :cat)
   OR (ts = :ts AND category = :cat AND user_id > :uid)
^^^

More verbose.

Still effective.

---

## The Hidden Trade-Off

Cursor pagination sacrifices:

**Random access**

You cannot jump directly to page 437.

This is intentional.

At scale, random-access pagination is usually a UX smell.

Production systems optimize for:

- infinite scroll
- sequential traversal
- efficient continuation

not arbitrary page jumps.

---

## Senior Engineering Takeaway

Cursor pagination is not “just another pagination strategy.”

It is a deliberate architectural choice that reflects:

- database execution awareness
- index design understanding
- stateless API design
- scalability-first thinking

Offset pagination is fine for:

- admin dashboards
- small datasets
- prototypes

Cursor pagination is the production default once scale matters.

---

## Practical Rule

Use:

**Offset pagination**  
if simplicity matters more than scale.

Use:

**Cursor pagination**  
if scale, consistency, and performance matter.

That is the real engineering decision.
