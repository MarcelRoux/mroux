
# Page Progress Indication

## Purpose

Long-form technical pages should help readers understand:

- where they are in the article
- how much content remains
- which section is currently active
- how the page is structured

This is especially useful for:

- systems notes
- benchmark writeups
- protocol investigations
- long-form technical articles
- operational postmortem-style writing

The goal is not decorative animation.

The goal is:

```txt
reader orientation for dense technical content
```

---

## Desired Behavior

For long-form content pages, support two related UI elements:

1. A reading progress bar
2. An active-section table of contents

These should be implemented as lightweight client-side enhancements on top of static Astro pages.

They should not require:

- Cloudflare Functions
- Workers
- backend state
- analytics infrastructure
- user accounts
- persistence

This keeps the site static-first while improving readability.

---

## Reading Progress Bar

### Behavior

A horizontal progress bar should indicate how far the reader has progressed through the current page.

Expected behavior:

- fixed near the top of the viewport
- fills left-to-right as the reader scrolls
- unobtrusive
- does not cover content
- works on long article pages
- optional or hidden on short pages

### Implementation Model

The progress value can be computed in the browser from scroll position:

```txt
scrollTop / (documentHeight - viewportHeight)
```

Then applied to a CSS custom property or inline transform.

Example model:

```txt
static Astro page
  + tiny client-side script
  + CSS transform scaleX(progress)
```

This does not make the site dynamic in the backend sense. It remains a static deployment with small browser-side behavior.

### Recommended Visual Style

Use:

- thin height, roughly 2–4px
- muted accent color
- no animation beyond scroll-linked fill
- no text label
- no decorative effects

Avoid:

- large bars
- gradients
- bouncing/animated indicators
- percentage labels
- sticky UI that competes with content

---

## Active Section Table Of Contents

### Behavior

A table of contents should list article headings and highlight the heading currently visible or nearest to the top of the viewport.

Expected behavior:

- generated from page headings
- links use heading anchors
- active heading is visually highlighted
- clicking an entry scrolls to the section
- works without backend state
- remains readable and unobtrusive

This is especially useful for articles with multiple sections such as:

- DNSSEC migration analysis
- protocol comparisons
- benchmark methodology
- systems design notes

### Implementation Model

The table of contents should be generated at build time from article headings where possible.

The active heading should be updated in the browser using `IntersectionObserver`.

Conceptual flow:

```txt
article headings
  -> build-time heading list
  -> render table of contents
  -> browser observes headings
  -> currently visible heading receives active state
```

Pure HTML/CSS can render the table of contents, but practical active-heading highlighting currently requires JavaScript.

This is acceptable because:

- it is progressive enhancement
- the content remains readable without JavaScript
- the links still work without JavaScript
- no backend is required

---

## Static-First Constraint

This feature must preserve the site architecture:

```txt
Astro static site
+ minimal client-side enhancement
+ Cloudflare Pages
```

It must not introduce:

- server-side rendering
- runtime APIs
- visitor tracking
- persistent user state
- Cloudflare Workers
- Cloudflare Pages Functions

The implementation should remain compatible with static hosting.

---

## Accessibility Requirements

The table of contents should use semantic navigation.

Recommended structure:

```html
<nav aria-label="Table of contents">
  <ol>
    <li><a href="#section-id">Section title</a></li>
  </ol>
</nav>
```

The progress bar should not be the only way to understand page structure.

Accessibility considerations:

- TOC links should be keyboard accessible
- active state should not rely on color alone
- heading anchors should be stable
- skip links should continue to work
- progress bar should be decorative or have appropriate ARIA treatment

For the progress bar, prefer either:

```html
<div aria-hidden="true"></div>
```

or, if exposed semantically:

```html
<div role="progressbar" aria-valuemin="0" aria-valuemax="100"></div>
```

The decorative version is likely sufficient for v1 because the table of contents provides the meaningful structure.

---

## Responsive Behavior

Desktop:

- progress bar fixed at top
- table of contents can appear in a right-side rail
- article body remains the primary focus

Mobile:

- progress bar can remain at top
- table of contents should collapse, move above content, or be omitted initially
- avoid a sticky side rail on small screens
- no horizontal overflow

Initial recommendation:

```txt
desktop: progress bar + right-side TOC
mobile: progress bar + simple inline TOC near article top
```

---

## Suggested Components

Potential components:

```txt
src/components/ReadingProgress.astro
src/components/TableOfContents.astro
src/layouts/ArticleLayout.astro
```

`ArticleLayout.astro` should decide whether to render these elements.

Possible frontmatter flag:

```yaml
show_progress: true
show_toc: true
```

Default behavior can be:

```txt
show on article-like long-form pages
hide on short/index pages
```

---

## Suggested Implementation Sketch

### Reading Progress

Basic structure:

```html
<div class="reading-progress" aria-hidden="true">
  <div class="reading-progress__bar"></div>
</div>
```

Conceptual CSS:

```css
.reading-progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  z-index: 50;
}

.reading-progress__bar {
  height: 100%;
  transform-origin: left center;
  transform: scaleX(var(--reading-progress, 0));
}
```

Conceptual script:

```js
const updateProgress = () => {
  const scrollTop = window.scrollY;
  const documentHeight = document.documentElement.scrollHeight;
  const viewportHeight = window.innerHeight;
  const maxScroll = documentHeight - viewportHeight;
  const progress = maxScroll > 0 ? scrollTop / maxScroll : 0;

  document.documentElement.style.setProperty(
    "--reading-progress",
    String(Math.min(1, Math.max(0, progress)))
  );
};

window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);
updateProgress();
```

### Active TOC Highlighting

Conceptual approach:

```js
const headings = [...document.querySelectorAll("article h2[id], article h3[id]")];
const tocLinks = new Map(
  [...document.querySelectorAll('[data-toc-link]')].map((link) => [
    link.getAttribute("href")?.replace("#", ""),
    link,
  ])
);

const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

    if (!visible) return;

    for (const link of tocLinks.values()) {
      link.removeAttribute("aria-current");
      link.classList.remove("is-active");
    }

    const activeLink = tocLinks.get(visible.target.id);
    activeLink?.setAttribute("aria-current", "true");
    activeLink?.classList.add("is-active");
  },
  {
    rootMargin: "-20% 0px -70% 0px",
    threshold: 0,
  }
);

headings.forEach((heading) => observer.observe(heading));
```

This should be refined during implementation, but the design direction is sound.

---

## Content Requirements

This feature works best when long-form pages use predictable heading structure.

Article content should generally follow:

```txt
h1 page title
h2 major sections
h3 subsections
```

Avoid skipping heading levels arbitrarily.

Good heading hygiene improves:

- accessibility
- table of contents generation
- search indexing
- agent readability
- article structure

---

## When To Add This

Do not prioritize this before core content exists.

Recommended trigger:

```txt
add after 2–3 substantial long-form pages exist
```

Good candidate pages:

- DNSSEC migration article
- protocol benchmark methodology
- systems design notes
- long benchmark writeups

This feature is valuable only when there is enough dense content to justify orientation aids.

---

## Non-Goals

Do not add:

- user-specific reading progress persistence
- account-based completion tracking
- analytics-backed progress tracking
- backend state
- comments
- gamification
- noisy animations

This is not a course platform feature.

It is a reading affordance for technical articles.

---

## Final Recommendation

Implement this later as a small progressive enhancement.

The correct framing is:

```txt
static article + build-time structure + minimal client-side scroll awareness
```

not:

```txt
dynamic app feature
```

This keeps the site aligned with its core architecture while improving the reading experience for dense technical material.
