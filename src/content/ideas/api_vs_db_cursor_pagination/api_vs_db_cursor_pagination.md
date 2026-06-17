---
title: "API vs DB cursor pagination"
description: "Compare stateless API cursor pagination with stateful database cursors, using PostgreSQL and ClickHouse as contrasting OLTP and OLAP examples."
status: "idea"
created: "2026-05-26"
updated: "2026-05-26"
slug: "api-vs-db-cursor-pagination"

summary: >
  Cursor pagination is often explained as an API pattern, but the deeper
  operational distinction is between stateless API cursors and stateful database
  cursors. This idea explores why API cursors scale well for web pagination,
  why DB cursors are usually the wrong abstraction for public APIs, and how
  index design changes between PostgreSQL and ClickHouse.

publish_priority: "medium"
estimated_effort: "medium"

related_projects:

- "postgres_scaling_lab"
related_articles:
- "Postgres scaling experiments"
canonical_topics:
- "API design"
- "Database indexing"
- "Pagination"
- "PostgreSQL"
- "ClickHouse"
- "Systems design"
tags:
- "pagination"
- "cursor-pagination"
- "offset-pagination"
- "postgresql"
- "clickhouse"
- "api-design"
- "database-performance"
- "indexing"

potential_sections:

- Introduction
- Why Offset Pagination Breaks Down
- API Cursor vs Database Cursor
- Stateless Pagination Mechanics
- "Mutable Data: Inserts, Deletes, and Consistency"
- Composite Cursor Design
- PostgreSQL Index Strategy
- ClickHouse Pagination Strategy
- Operational Tradeoffs
- Conclusion

key_questions:

- "What is the difference between an API cursor and a database cursor?"
- "Why does LIMIT/OFFSET degrade on large datasets?"
- "When is cursor pagination the correct production default?"
- "When is offset pagination still acceptable?"
- "How should composite cursors be encoded and validated?"
- "How do deletes, inserts, and mutable records affect pagination correctness?"
- "How does cursor pagination differ between PostgreSQL and ClickHouse?"
- "What index shape is required for efficient cursor pagination?"
- "When are stateful DB cursors appropriate?"
- "What UX tradeoffs are introduced by losing random page access?"

hypotheses:

- "Cursor pagination is best understood as seek-based continuation over a deterministic sort order, not merely as an opaque token pattern."
- "Most confusion around cursor pagination comes from conflating stateless API cursors with stateful database cursors."
- "For web APIs, stateless API cursors are generally superior because they avoid server-side session state and preserve horizontal scalability."
- "Offset pagination remains acceptable for small datasets, admin tools, and low-traffic internal interfaces where simplicity dominates scale concerns."
- "The practical complexity of cursor pagination is mostly in ordering, index design, cursor encoding, and edge cases around mutable data."
- "PostgreSQL is the cleaner demonstration system because B-tree indexes and row-value expressions map directly to composite cursor pagination."
- "ClickHouse can support cursor-like pagination for analytical feeds, but the implementation is more manual because tuple inequality semantics and sparse primary indexes differ from OLTP B-tree seeks."

references:

- "PostgreSQL documentation: DECLARE cursor"
- "PostgreSQL documentation: Indexes and index-only scans"
- "PostgreSQL documentation: Row constructor comparison"
- "ClickHouse documentation: primary indexes and sparse indexes"
- "ClickHouse documentation: ORDER BY / primary key design"
- "Stripe-style API pagination patterns"
- "GitHub REST API pagination patterns"

artifacts:
  screenshots: []
  diagrams:
    - "Offset scan-and-discard vs cursor seek-and-continue"
    - "API cursor request/response flow"
    - "Stateful DB cursor connection/session lifecycle"
    - "Composite cursor lexicographic ordering"
  commands:
    - "EXPLAIN ANALYZE SELECT id, name FROM items ORDER BY id LIMIT 50 OFFSET 100000;"
    - "EXPLAIN ANALYZE SELECT id, name FROM items WHERE id > 184392 ORDER BY id LIMIT 50;"
    - "EXPLAIN ANALYZE SELECT timestamp, category, user_id, revenue FROM analytics_data WHERE (timestamp, category, user_id) > ($1, $2, $3) ORDER BY timestamp, category, user_id LIMIT 50;"
  datasets:
    - "Synthetic PostgreSQL table with sequential IDs"
    - "Synthetic PostgreSQL table with non-unique timestamps requiring composite cursor"
    - "Optional ClickHouse MergeTree table for analytical pagination comparison"

future_expansions:

- "Reverse cursor pagination / previous page semantics"
- "Opaque cursor token schema with Base64 JSON and HMAC signing"
- "Cursor pagination with created_at + id ordering"
- "Pagination consistency under different isolation levels"
- "Benchmark article using postgres_scaling_lab"
- "ClickHouse-specific pagination for immutable event feeds"
---

## Context

Cursor pagination is a useful content topic because it connects a familiar API feature to deeper systems concerns: database execution plans, index shape, state management, mutability, and user-facing product tradeoffs.

The operational trigger is the common oversimplification of pagination as a framework-level feature. Many explanations stop at `limit`, `offset`, and `next_cursor`, but the important production question is what the database and API tier must hold in memory between requests.

This is worth documenting publicly because it demonstrates practical systems judgement:

- understanding when simple offset pagination is sufficient
- recognizing when offset pagination becomes pathological
- distinguishing API cursors from database cursors
- designing stable ordering for mutable datasets
- mapping pagination design to PostgreSQL and ClickHouse storage/index models

The article should not be a generic tutorial. The stronger angle is: **cursor pagination is an architectural decision about stateless continuation over a deterministic index order.**

---

## Core Insight

Cursor pagination is not mainly about hiding an ID in a token. It is about replacing **scan-and-discard** with **seek-and-continue**.

Offset pagination asks the database to skip `N` rows before returning the next page. This is simple and supports random access, but deep pages become increasingly expensive and unstable under inserts or deletes. Cursor pagination instead records the last observed position in a deterministic sort order and asks the database to continue after that point.

The critical distinction is between a **stateless API cursor** and a **stateful database cursor**. A stateless API cursor is just serialized positioning metadata passed between client and server. Each request is independent. A database cursor is server-side database state tied to a transaction and connection. That may be valid for controlled batch processing, but it is generally the wrong abstraction for public web API pagination.

For production APIs, the default target should be:

- stateless API tier
- deterministic ordering
- index-compatible continuation predicate
- bounded page size
- opaque cursor token
- explicit handling of inserts, deletes, and tie-breakers

---

## Initial Notes

### Terminology

**Offset pagination**

Uses `LIMIT` and `OFFSET`.

```sql
SELECT id, name
FROM items
ORDER BY id
LIMIT 50 OFFSET 100000;
```

Simple, but the database still has to walk past skipped rows.

**API cursor**

A stateless token sent by the client and decoded by the API.

Example conceptual payload:

```json
{
  "last_id": 184392
}
```

The API uses that value to construct a continuation query.

```sql
SELECT id, name
FROM items
WHERE id > :last_id
ORDER BY id ASC
LIMIT :limit;
```

**Database cursor**

A stateful DB engine mechanism.

```sql
DECLARE item_cursor CURSOR FOR
SELECT id, name
FROM items
ORDER BY id;

FETCH 50 FROM item_cursor;
```

This requires transaction and connection state to remain alive. That is usually incompatible with horizontally scaled stateless web APIs.

---

### API Cursor vs DB Cursor

| Dimension | Stateless API Cursor | Stateful Database Cursor |
|---|---|---|
| State location | Client token | Database session |
| API tier scaling | Horizontally scalable | Tied to sticky state / connection lifecycle |
| DB connection usage | Per request | Held open across fetches |
| Web API suitability | Strong | Poor |
| Batch/export suitability | Good, but not required | Sometimes appropriate |
| Failure recovery | Cursor can be retried | Cursor/session may be lost |

Main claim:

> API cursors are a web/API pagination pattern. DB cursors are a database streaming mechanism. They should not be conflated.

---

### When DB Cursors Are Appropriate

DB cursors are not useless. They are just usually wrong for public API pagination.

Appropriate uses:

- internal batch jobs
- ETL pipelines
- long-running exports
- migration scripts
- controlled worker processes
- streaming large result sets to avoid worker OOM

Usually inappropriate uses:

- public REST APIs
- mobile infinite scroll
- high-concurrency web pagination
- multi-region stateless API tiers
- any flow requiring cheap retries across independent requests

---

### Mutable Data Edge Cases

Cursor pagination does not create a static snapshot unless the system explicitly implements snapshot semantics.

Each request is a fresh query.

Important cases:

1. **Insert after cursor**
   - Can appear in later pages.
   - Usually acceptable.

2. **Insert before cursor**
   - Usually ignored by the current traversal.
   - Prevents duplication.

3. **Delete cursor row**
   - Safe if using inequality continuation such as `id > :last_id`.
   - Risky if relying on re-finding the exact cursor row.

4. **Update sort key**
   - Can cause duplicates or missing rows if the sort column changes during traversal.
   - Mitigate with immutable sort keys or snapshot-like semantics.

Good simple rule:

> Cursor columns should be stable, deterministic, indexed, and unique after tie-breaking.

---

### Composite Cursor Design

Single-column cursor:

```sql
WHERE id > :last_id
ORDER BY id ASC
```

Composite cursor:

```sql
WHERE (created_at, id) > (:last_created_at, :last_id)
ORDER BY created_at ASC, id ASC
```

This pattern is common because timestamps are often not unique. The `id` becomes the deterministic tie-breaker.

For more complex ordering:

```sql
WHERE (timestamp, category, user_id) > (:timestamp, :category, :user_id)
ORDER BY timestamp ASC, category ASC, user_id ASC
```

Index must match:

```sql
CREATE INDEX idx_analytics_page
ON analytics_data (timestamp, category, user_id);
```

Potential covering index:

```sql
CREATE INDEX idx_analytics_page_covering
ON analytics_data (timestamp, category, user_id)
INCLUDE (revenue);
```

---

### Opaque Cursor Encoding

The public API should usually not expose raw implementation details as plain IDs once the cursor contains multiple fields.

Possible token payload:

```json
{
  "v": 1,
  "order": "created_at_id_asc",
  "created_at": "2026-05-26T12:30:00Z",
  "id": 184392
}
```

Base64-encoded JSON is enough for opacity but not integrity. If clients must not tamper with cursor values, add HMAC signing.

Important cursor token fields:

- version
- ordering mode
- last observed sort values
- direction
- optional page size constraint
- optional filter hash if cursor is only valid for a specific query/filter set

Potential follow-up article: cursor token schema and signing.

---

### PostgreSQL Notes

PostgreSQL is a clean reference system for this article because:

- B-tree indexes map naturally to seek-based pagination
- row-value comparisons support composite cursor predicates
- index-only scans are easy to demonstrate with `INCLUDE`
- `EXPLAIN ANALYZE` can show the difference between large offsets and index continuation

Postgres article example should compare:

```sql
SELECT id, name
FROM items
ORDER BY id
LIMIT 50 OFFSET 100000;
```

against:

```sql
SELECT id, name
FROM items
WHERE id > 100000
ORDER BY id
LIMIT 50;
```

Expected teaching point:

- offset pagination may still use an index, but it must traverse discarded entries
- cursor pagination can start from the known position and return only the next bounded page

---

### ClickHouse Notes

ClickHouse changes the discussion because it is column-oriented and uses sparse primary indexes over sorted parts rather than OLTP-style row-level B-tree lookup.

The cursor-like query can still work well for append-heavy analytical feeds if the filter aligns with the table `ORDER BY` key.

Postgres tuple comparison:

```sql
WHERE (timestamp, category, user_id) > (:timestamp, :category, :user_id)
```

ClickHouse-style flattened predicate:

```sql
WHERE timestamp > :timestamp
   OR (timestamp = :timestamp AND category > :category)
   OR (timestamp = :timestamp AND category = :category AND user_id > :user_id)
ORDER BY timestamp ASC, category ASC, user_id ASC
LIMIT 50;
```

Important ClickHouse framing:

- best for immutable or append-mostly event streams
- not ideal for highly mutable user-facing record sets
- pagination should align with MergeTree `ORDER BY`
- sparse indexes prune ranges/marks, not individual rows the same way a B-tree does

---

### Hash Tie-Breaker Idea

If deterministic positioning requires many columns, the cursor and index can become wide.

Possible mitigation:

- keep meaningful order columns first
- add a deterministic tie-breaker column
- use a generated or materialized hash from natural identifying fields

Example conceptual order:

```sql
ORDER BY event_time, event_hash
```

This can reduce cursor width, but it introduces collision considerations and may obscure natural ordering. It should be framed as an advanced optimization, not the default.

---

### UX Tradeoff

Cursor pagination usually sacrifices random page access.

Bad fit:

- "jump to page 437"
- total page count requirements
- spreadsheet-style arbitrary navigation

Good fit:

- infinite scroll
- activity feeds
- event streams
- audit logs
- search-after pagination
- sequential browsing

This is an important product/design point: sometimes offset pagination is chosen because the UX requires random access, not because it is technically better.

---

## Potential Structure

1. **Introduction**
   - Pagination looks trivial until scale.
   - The interesting issue is not the API parameter; it is database work and state.

2. **Offset Pagination: The Simple Default**
   - Show `LIMIT/OFFSET`.
   - Explain scan-and-discard.
   - Note where it is still acceptable.

3. **Cursor Pagination: Seek-and-Continue**
   - Show `WHERE id > :cursor ORDER BY id LIMIT n`.
   - Explain deterministic ordering.
   - Explain why this is usually better for large feeds.

4. **The Naming Trap: API Cursor vs DB Cursor**
   - Define both.
   - Explain why API cursors are stateless.
   - Explain why DB cursors hold connection/session/transaction state.

5. **State, Scaling, and Failure Recovery**
   - Stateless API tiers.
   - Retryable requests.
   - No per-user DB session.
   - DB cursor failure modes.

6. **Mutable Data Semantics**
   - Inserts before/after cursor.
   - Deletes.
   - Updated sort keys.
   - No snapshot by default.

7. **Composite Cursors**
   - `created_at + id` as canonical example.
   - Tuple comparisons in Postgres.
   - Exact index alignment.

8. **PostgreSQL Implementation**
   - Query examples.
   - Index examples.
   - Optional `EXPLAIN ANALYZE` benchmark.

9. **ClickHouse Implementation**
   - MergeTree sorted data.
   - Sparse primary index framing.
   - Flattened lexicographic predicate.
   - Analytical-feed use case.

10. **Operational Decision Matrix**
    - Offset vs API cursor vs DB cursor.
    - OLTP vs OLAP.
    - Small admin UI vs high-volume public API.

11. **Conclusion**
    - Cursor pagination is an architecture choice.
    - The goal is stateless continuation over indexed deterministic order.

---

## Evidence And Artifacts

### Benchmark Evidence To Capture

Use `postgres_scaling_lab` or a small dedicated local setup.

Tables:

```sql
CREATE TABLE items (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Populate with enough rows to make offset visible:

```sql
INSERT INTO items (name, created_at)
SELECT
    'item-' || gs,
    now() - (gs || ' seconds')::interval
FROM generate_series(1, 1000000) AS gs;
```

Compare:

```sql
EXPLAIN ANALYZE
SELECT id, name
FROM items
ORDER BY id
LIMIT 50 OFFSET 500000;
```

with:

```sql
EXPLAIN ANALYZE
SELECT id, name
FROM items
WHERE id > 500000
ORDER BY id
LIMIT 50;
```

Expected artifact:

- query plan screenshots or pasted text
- planning time
- execution time
- rows scanned/discarded
- index usage

### Composite Cursor Evidence

Table:

```sql
CREATE TABLE analytics_data (
    id BIGSERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL,
    category TEXT NOT NULL,
    user_id BIGINT NOT NULL,
    revenue NUMERIC NOT NULL
);
```

Index:

```sql
CREATE INDEX idx_analytics_page
ON analytics_data (timestamp, category, user_id, id);
```

Query:

```sql
EXPLAIN ANALYZE
SELECT timestamp, category, user_id, id, revenue
FROM analytics_data
WHERE (timestamp, category, user_id, id) > ($1, $2, $3, $4)
ORDER BY timestamp, category, user_id, id
LIMIT 50;
```

### Diagrams To Create

1. **Offset pagination**
   - client requests page 10,000
   - DB walks/skips prior rows
   - returns page

2. **API cursor pagination**
   - client sends cursor token
   - API decodes token
   - DB index seek
   - API returns page + next cursor

3. **DB cursor anti-pattern**
   - client starts session
   - API holds DB connection/transaction
   - subsequent fetches depend on live DB state
   - failure/stickiness issues

4. **Composite cursor ordering**
   - sort by `created_at`
   - tie-break by `id`
   - cursor points to exact last row

---

## Publication Notes

### Intended Audience

Primary audience:

- backend engineers
- data engineers
- systems-oriented software engineers
- engineers preparing for system design interviews

Secondary audience:

- product engineers who have used offset pagination but have not examined database execution costs
- API designers deciding between simplicity and scalability

### Readiness

Current status: idea with strong draft material.

Needs before publication:

- verify Postgres claims with local `EXPLAIN ANALYZE`
- verify exact ClickHouse tuple comparison limitations / preferred syntax against current ClickHouse behavior
- add one simple diagram
- decide whether to include FastAPI code or keep the article database/API-design focused
- add final decision matrix

### Suggested Final Article Title Options

- "API Cursors Are Not Database Cursors"
- "Cursor Pagination Is a Database Design Problem"
- "Cursor Pagination: Seek, Don’t Skip"
- "Offset vs Cursor Pagination in PostgreSQL and ClickHouse"
- "The Production Difference Between API and DB Cursors"

### Possible Conclusion

Cursor pagination is a small API surface area hiding a larger systems design decision. The important move is not replacing `offset` with an opaque string. The important move is designing stateless continuation over a deterministic, indexed ordering.

For small tools, offset pagination is fine. For high-volume feeds, event streams, and user-facing APIs over large datasets, cursor pagination is usually the more production-aligned default.

The final caution is terminology: an API cursor and a database cursor are not the same thing. One is stateless positioning metadata. The other is live database state. Confusing those two leads to poor architecture.
