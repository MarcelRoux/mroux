# Design Direction

## Theme

The site should feel:

- calm
- technical
- information-dense
- readable
- understated
- durable
- fast

The design may be inspired by HAMY’s site structure and clarity, but it should not clone the site.

The goal is not visual novelty. The goal is professional signal.

## Visual Priorities

Typography is the primary design system.

Prioritize:

- readable font sizes
- comfortable line height
- constrained content width
- strong heading hierarchy
- high contrast body text
- muted secondary text
- minimal borders
- generous spacing
- simple layout

## Suggested Fonts

Use a clean sans-serif for body text and a restrained monospace font for code or metadata.

Good options:

- Inter
- Geist
- IBM Plex Sans
- system font stack

For monospace:

- JetBrains Mono
- IBM Plex Mono
- ui-monospace/system monospace

## Color Palette

Use a minimal neutral palette.

Recommended direction:

- near-white background
- dark gray primary text
- muted gray secondary text
- subtle borders
- one restrained accent color

Avoid using many accent colors.

Good accent candidates:

- blue
- teal
- amber

Prefer semantic restraint over decoration.

## Layout

The site should support both quick scanning and long-form reading.

Recommended layout:

- narrow readable content column
- simple header navigation
- minimal footer
- card/list hybrid for indexes
- clear date/status/tag metadata
- root-relative links

The homepage should quickly answer:

- who this is
- what kind of engineering work he does
- where to read more
- what projects/artifacts are worth inspecting

## Navigation

Keep navigation sparse.

Initial navigation:

- About
- Projects
- Writing
- Systems
- Benchmarks
- Stats
- Resume

Avoid deeply nested navigation in v1.

## Responsiveness

The site should be excellent on desktop and acceptable on mobile.

Design for a laptop reading experience first, then ensure clean mobile collapse.

Mobile requirements:

- no horizontal scrolling
- tap-friendly navigation
- readable body text
- cards/lists stack vertically
- code blocks do not break layout
- header remains simple

## Components

Useful components:

- Layout
- Header
- Footer
- PageHeader
- ContentCard
- ProjectCard
- TagList
- StatCard
- Section
- Prose wrapper

Avoid component sprawl.

## Motion

Use little or no animation.

If animation is used, it should be subtle and not required to understand the page.

Avoid:

- dramatic page transitions
- scroll hijacking
- excessive hover effects
- animated gradients

## Imagery

Do not depend heavily on images.

If images are used, prefer:

- diagrams
- architecture sketches
- benchmark charts
- restrained project visuals

Avoid generic stock imagery.

## Accessibility

Baseline expectations:

- semantic HTML
- visible focus states
- sufficient color contrast
- descriptive link text
- alt text for meaningful images
- keyboard navigability

## Anti-Goals

Avoid:

- startup landing page aesthetic
- excessive gradients
- glassmorphism
- dark-pattern calls to action
- vanity metrics
- generic personal branding clichés
- overdesigned hero sections

The best version of the site should feel like an engineer’s public notebook, curated portfolio, and professional identity layer.
