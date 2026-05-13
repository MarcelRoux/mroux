---
title: "Polling Distributed State Instead of Sleeping: Understanding DNSSEC During Domain Migration"
description: "A DNSSEC migration investigation showing why polling observable distributed state is better than blindly waiting fixed provider timelines."
status: "idea"
created: "2026-05-13"
updated: "2026-05-13"
slug: "dnssec-cloudflare-migration"

summary: >
  Investigate how DNSSEC trust chains behave during a migration
  from Squarespace to Cloudflare and explain why observable
  distributed state validation is superior to blindly waiting
  provider-recommended fixed durations.

publish_priority: "high"
estimated_effort: "medium"

related_projects:
  - mroux
related_articles: []

canonical_topics:
  - distributed systems
  - dns
  - dnssec
  - infrastructure
  - observability
  - operations

tags:
  - cloudflare
  - distributed-systems
  - dns
  - dnssec
  - domain
  - networking
  - observability
  - operations
  - squarespace
  - trust-chains

potential_sections:
  - Introduction
  - The Migration Problem
  - What DNSSEC Actually Is
  - Understanding DS, DNSKEY, and RRSIG
  - DNS Trust Chains
  - Why Providers Recommend Waiting
  - Observing State Instead Of Sleeping
  - Using The Verisign DNSSEC Debugger
  - Recursive Resolvers And Cache Divergence
  - Comparing Resolver Perspectives
  - Interpreting The Results
  - Operational Lessons
  - Conclusion

key_questions:
  - "Why do providers recommend 24–48 hour waits during DNSSEC-related migrations?"
  - "What actually changes in the DNSSEC trust chain during migration?"
  - "How can migration state be validated directly?"
  - "What role do DS records play in delegation trust?"
  - "How do recursive resolvers and TTLs influence operational guidance?"
  - "Why can different recursive resolvers observe different DNSSEC states simultaneously?"

hypotheses:
  - "Operational wait recommendations are intentionally conservative rather than exact indicators of current distributed state."
  - "DNS propagation is often observable and measurable rather than unknowable."
  - "Polling authoritative distributed state is generally superior to blindly sleeping fixed durations."
  - "There is no singular globally synchronized DNS propagation state because recursive resolvers cache and refresh independently."

references:
  - "https://dnssec-debugger.verisignlabs.com/mroux.net"
  - "https://developers.cloudflare.com/dns/dnssec/"
  - "https://support.squarespace.com/hc/en-us/articles/360002101888-Adding-custom-DNS-records-to-your-Squarespace-managed-domain"
  - "https://datatracker.ietf.org/doc/html/rfc4033"
  - "https://datatracker.ietf.org/doc/html/rfc4034"
  - "https://datatracker.ietf.org/doc/html/rfc4035"

artifacts:
  screenshots:
    - "Verisign DNSSEC debugger showing DS records absent for mroux.net"
  diagrams:
    - "DNSSEC trust chain diagram"
    - "Root -> TLD -> Domain delegation diagram"
  commands:
    - "dig DS mroux.net"
    - "dig DS mroux.net +short"
    - "dig DNSKEY mroux.net"
    - "dig +dnssec mroux.net"
    - "dig DS mroux.net @1.1.1.1"
    - "dig DS mroux.net @8.8.8.8"
    - "dig DNSKEY mroux.net @1.1.1.1"
  datasets: []

future_expansions:
  - "TTLs and the mythology of DNS propagation"
  - "Polling vs sleeping in distributed systems"
  - "Practical observability techniques for infrastructure migrations"
  - "Recursive resolvers, cache divergence, and distributed consistency"
  - "Understanding authoritative vs recursive DNS infrastructure"
---

## Context

During migration of `mroux.net` from Squarespace-managed DNS toward Cloudflare, provider documentation recommended disabling DNSSEC and waiting:

- Cloudflare: approximately 24 hours
- Squarespace: approximately 48 hours

However, direct inspection using the Verisign DNSSEC debugger showed that the required DNSSEC trust-chain state had already converged.

Specifically:

- no DS records existed for `mroux.net` in the `.net` zone
- no DNSKEY records existed for the domain
- the authoritative nameservers remained reachable
- the trust chain was effectively removed already

This suggests the operationally relevant migration state became observable significantly earlier than the provider-recommended fixed waiting windows.

Subsequent investigation revealed an even more interesting distributed-systems characteristic.

An earlier query against a local recursive resolver still returned a DS record for `mroux.net`, implying that resolver still had cached state indicating the parent `.net` zone advertised DNSSEC delegation.

However, queries against public recursive resolvers:

- `1.1.1.1` (Cloudflare)
- `8.8.8.8` (Google)

showed:

- no DS records existed
- no DNSKEY records existed
- the DNSSEC trust chain had already been removed cleanly

This demonstrated that different recursive resolvers could observe different DNSSEC states simultaneously depending on cache state and refresh timing.

The article should explore the difference between:

- conservative operational guidance
- actual distributed state convergence

and use this to explain broader systems-engineering principles.

---

## Core Insight

The deeper value of the article is not merely explaining how to migrate a domain.

The real insight is:

```txt
observable distributed state is preferable to blind waiting
```

The DNS ecosystem is often treated as:

- mysterious
- eventually consistent in unknowable ways
- impossible to reason about precisely

But the migration investigation revealed something more subtle:

```txt
there is no single global DNS propagation state
```

Different recursive resolvers:

- cache independently
- expire TTLs independently
- refresh upstream records independently
- may temporarily disagree about trust-chain state

This means operational guidance such as:

```txt
wait 24–48 hours
```

is often a conservative simplification rather than an exact statement about current distributed state.

The DNSSEC debugger demonstrates this clearly by:

- traversing the trust chain
- validating DS records
- validating DNSKEY records
- validating RRSIG relationships
- identifying whether delegation trust exists

The article should frame DNSSEC as:

```txt
a distributed cryptographic trust system
```

rather than:

```txt
a checkbox in a DNS provider UI
```

The operational lesson generalizes well beyond DNS:

```txt
poll observable state instead of blindly sleeping fixed durations
```

This principle applies broadly to:

- deployments
- infrastructure migrations
- CI/CD systems
- distributed systems
- database failover
- stream-processing systems
- asynchronous orchestration

---

## Initial Notes

The screenshot from the Verisign debugger is extremely valuable because it exposes:

- DS records
- DNSKEY records
- RRSIG validation
- trust-chain traversal
- authoritative nameserver responses

The article should explain:

- root trust anchors
- TLD delegation
- DS record purpose
- DNSKEY purpose
- RRSIG purpose
- why removal of DS records matters during migration

Potential emphasis:

The investigation unexpectedly exposed a real-world example of distributed cache divergence.

A local recursive resolver continued returning stale DS records while public recursive resolvers (`1.1.1.1` and `8.8.8.8`) already agreed the DS records had been removed.

This is an excellent example of:

- eventual consistency
- cache invalidation timing
- recursive resolver independence
- observable distributed state convergence

Provider timelines likely exist because:

- support simplification
- resolver caching behavior
- worst-case TTL assumptions
- operational safety margins
- user-error mitigation

rather than because the state necessarily remains unresolved for that duration.

Need to explain carefully:

- authoritative nameservers vs recursive resolvers
- propagation vs caching
- trust-chain invalidation
- why absence of DS records is desired here

Potential diagrams:

- Root -> .net -> mroux.net trust chain
- DNSSEC validation flow
- migration state transition diagram
- polling vs sleeping comparison

---

## Potential Structure

1. Introduction
2. Migrating `mroux.net` From Squarespace To Cloudflare
3. Why Providers Recommend Waiting 24–48 Hours
4. What DNSSEC Actually Is
5. Understanding DS, DNSKEY, and RRSIG
6. DNSSEC Trust Chains Explained
7. Inspecting DNSSEC State Directly
8. Using The Verisign DNSSEC Debugger
9. Recursive Resolvers And Cache Divergence
10. Comparing Resolver Perspectives
11. Interpreting The Debugger Output
12. Why The Migration Was Already Safe
13. Polling Distributed State Instead Of Sleeping
14. Broader Operational Lessons
15. Conclusion

---

## Evidence And Artifacts

Primary evidence:

- Verisign DNSSEC debugger screenshot
- live DNSSEC debugger output
- provider documentation recommending waiting
- `dig` command outputs
- authoritative nameserver responses
- recursive resolver comparison outputs
- stale resolver observations from local recursive infrastructure

Potential commands:

```bash
# Check DS records through the local recursive resolver.

dig DS mroux.net

; <<>> DiG 9.10.6 <<>> DS mroux.net
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 31738
;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 0

;; QUESTION SECTION:
;mroux.net.   IN DS

;; ANSWER SECTION:
mroux.net.  12801 IN DS 26386 8 2 81CBE91B0F282F981870F76B519969A896F743CC61A9E0A4BB59A9D5 4F55C4F6

;; Query time: 0 msec
;; SERVER: <local-recursive-resolver>#53(<local-recursive-resolver>)
;; WHEN: Wed May 13 13:17:18 MDT 2026
;; MSG SIZE  rcvd: 75

dig DS mroux.net +short
26386 8 2 81CBE91B0F282F981870F76B519969A896F743CC61A9E0A4BB59A9D5 4F55C4F6

# Check DNSKEY records through the local recursive resolver.

dig DNSKEY mroux.net

; <<>> DiG 9.10.6 <<>> DNSKEY mroux.net
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 26874
;; flags: qr rd ra; QUERY: 1, ANSWER: 0, AUTHORITY: 0, ADDITIONAL: 0

;; QUESTION SECTION:
;mroux.net.   IN DNSKEY

;; Query time: 1071 msec
;; SERVER: <local-recursive-resolver>#53(<local-recursive-resolver>)
;; WHEN: Wed May 13 13:18:44 MDT 2026
;; MSG SIZE  rcvd: 27

# Request DNSSEC-related records through the local recursive resolver.

dig +dnssec mroux.net

; <<>> DiG 9.10.6 <<>> +dnssec mroux.net
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 7172
;; flags: qr rd ra; QUERY: 1, ANSWER: 0, AUTHORITY: 0, ADDITIONAL: 0

;; QUESTION SECTION:
;mroux.net.   IN A

;; Query time: 186 msec
;; SERVER: <local-recursive-resolver>#53(<local-recursive-resolver>)
;; WHEN: Wed May 13 13:19:00 MDT 2026
;; MSG SIZE  rcvd: 27

# Compare public recursive resolver perspectives.

dig DS mroux.net @1.1.1.1

; <<>> DiG 9.10.6 <<>> DS mroux.net @1.1.1.1
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 59330
;; flags: qr rd ra; QUERY: 1, ANSWER: 0, AUTHORITY: 1, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 1232
;; QUESTION SECTION:
;mroux.net.   IN DS

;; AUTHORITY SECTION:
net.   900 IN SOA a.gtld-servers.net. nstld.verisign-grs.com. 1778700176 1800 900 604800 900

;; Query time: 38 msec
;; SERVER: 1.1.1.1#53(1.1.1.1)
;; WHEN: Wed May 13 13:23:17 MDT 2026
;; MSG SIZE  rcvd: 111

dig DS mroux.net @8.8.8.8

; <<>> DiG 9.10.6 <<>> DS mroux.net @8.8.8.8
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 2227
;; flags: qr rd ra; QUERY: 1, ANSWER: 0, AUTHORITY: 1, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 512
;; QUESTION SECTION:
;mroux.net.   IN DS

;; AUTHORITY SECTION:
net.   900 IN SOA a.gtld-servers.net. nstld.verisign-grs.com. 1778700176 1800 900 604800 900

;; Query time: 44 msec
;; SERVER: 8.8.8.8#53(8.8.8.8)
;; WHEN: Wed May 13 13:23:28 MDT 2026
;; MSG SIZE  rcvd: 111

dig DNSKEY mroux.net @1.1.1.1

; <<>> DiG 9.10.6 <<>> DNSKEY mroux.net @1.1.1.1
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 23743
;; flags: qr rd ra; QUERY: 1, ANSWER: 0, AUTHORITY: 1, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 1232
;; QUESTION SECTION:
;mroux.net.   IN DNSKEY

;; AUTHORITY SECTION:
mroux.net.  300 IN SOA ns-cloud-a1.googledomains.com. cloud-dns-hostmaster.google.com. 8 21600 3600 259200 300

;; Query time: 132 msec
;; SERVER: 1.1.1.1#53(1.1.1.1)
;; WHEN: Wed May 13 13:23:39 MDT 2026
;; MSG SIZE  rcvd: 131
```

Potential references:

- RFC 4033
- RFC 4034
- RFC 4035
- Cloudflare DNSSEC documentation
- Squarespace migration documentation

---

## Publication Notes

Primary audience:

- software engineers
- infrastructure engineers
- DevOps/platform engineers
- technically curious developers

Secondary audience:

- engineers unfamiliar with DNSSEC internals
- people performing registrar/DNS migrations

The article should remain:

- technical
- evidence-driven
- operationally grounded
- protocol-oriented
- systems-oriented
- observability-oriented
- grounded in real distributed-state behavior

Avoid turning it into:

- generic Cloudflare tutorial
- registrar walkthrough
- superficial networking explanation

Potential follow-up articles:

- DNS propagation myths
- Recursive resolvers explained
- Polling vs sleeping in distributed systems
- Observability-driven infrastructure operations
- Understanding TTLs operationally
- Distributed cache consistency in practice
- Why DNS propagation is not globally synchronized
