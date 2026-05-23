# QR Code Generator UX Revision Plan

## Purpose

Improve the usability of the QR code generator for a non-technical client by reducing scrolling friction, keeping the preview visible during logo adjustments, and making the tool feel guided rather than over-configured.

This plan is intentionally UX-focused. It does not change core functionality requirements. It reorganizes and presents the existing capabilities in a more usable way.

## Current UX Problems

- The control stack is too tall, so important controls can push the preview off-screen.
- Logo editing is disconnected from visual feedback because the preview often leaves view while adjusting crop, size, or padding.
- The page reads like a long settings form rather than a guided creative tool.
- Advanced QR styling options compete visually with higher-priority client tasks such as uploading a logo, adjusting crop, and downloading the final QR.
- Supporting panels such as warnings and reliability tips consume useful preview space when they are not the current focus.

## UX Goals

- Keep the live preview visible while editing on desktop.
- Prioritize the most likely client workflow: content, logo, preview, export.
- Reduce cognitive load by hiding low-priority controls until needed.
- Keep the page usable on mobile without duplicating functionality.
- Preserve the tool's current reliability guidance and warnings without letting them dominate the experience.

## Proposed Information Architecture

### Primary user flow

1. Enter text or URL.
2. Upload logo.
3. Adjust crop, zoom, size, and padding while preview remains visible.
4. Try a preset if desired.
5. Refine QR styling only if needed.
6. Review warnings and scan guidance.
7. Download PNG.

### Desktop layout

- Left column: controls
- Right column: sticky preview area

The right column should remain visible while the left column scrolls. This is the highest-value UX change.

### Mobile layout

- Single column
- Preview appears near the top, directly after the page intro
- Logo adjustment controls appear immediately after preview
- Advanced styling remains collapsed by default

## Proposed Section Order

Reorder the page to match the real client workflow:

1. `Content`
2. `Preview`
3. `Logo Adjustments`
4. `Quick Presets`
5. `QR Appearance`
6. `Advanced QR Settings`
7. `Warnings and Scan Guidance`
8. `Download Actions`

## Proposed Section Structure

### Content

- Text or URL input
- Keep minimal and always expanded

### Preview

- Sticky on desktop
- Shows live QR preview
- Includes nearby quick actions:
  - `Download PNG`
  - `Reset`
  - `Remove logo` when a logo exists

### Logo Adjustments

This becomes the main editing section for non-technical users.

- Upload logo
- Crop mode
- Image crop
- Logo size
- Logo padding
- Auto-pick foreground color
- Apply logo color

Reason:
This is the section most likely to require repeated tweaking while watching the preview.

### Quick Presets

- Small row or grid of curated presets
- Position after logo adjustments so users can either:
  - start with their logo and then theme around it, or
  - apply a preset and then refine

### QR Appearance

- Foreground color
- Background color
- Transparent background
- Dot style
- Corner square style
- Corner dot style

Reason:
These are important, but less urgent than logo editing for this client use case.

### Advanced QR Settings

Collapsed by default.

- Size
- Error correction
- Quiet zone

Reason:
These controls matter, but they are not usually the first controls a non-technical client should touch.

### Warnings and Scan Guidance

- Keep visible, but visually secondary unless warnings exist
- On desktop, this can remain under the preview
- On mobile, collapse scan guidance by default if space becomes tight

## Interaction Changes

### Sticky preview on desktop

- Use sticky positioning with a top offset so the preview remains visible while scrolling controls
- Keep the preview card, warnings card, and download action cluster in the sticky region if space allows

### Control grouping

- Use card-like grouped sections with stronger visual separation
- Give the `Logo Adjustments` section the most visual emphasis after `Content`

### Progressive disclosure

- Collapse `Advanced QR Settings` by default
- Keep `QR Appearance` expanded or partially collapsed depending on available space
- Consider allowing `Warnings and Scan Guidance` to collapse when there are zero warnings

### Inline feedback

- Keep live dimension labels
- Keep live crop/zoom labels
- Keep warning count
- Surface the most relevant warning first if space is constrained

### Action placement

- Primary download button should live near the preview, not only at the bottom of the form
- Secondary actions such as `Reset` and `Remove logo` should also live near the preview when contextually relevant

## Visual Hierarchy Changes

- Increase distinction between primary and advanced sections
- Make `Logo Adjustments` feel like the core workspace
- Reduce visual dominance of reliability guidance when there are no active warnings
- Keep warning card red only when actual warnings exist
- Use consistent section spacing so the page reads as a sequence of steps rather than a long control sheet

## Suggested Copy Changes

- Rename `Logo` to `Logo Adjustments`
- Rename `QR Style` to `QR Appearance`
- Rename `Advanced QR Settings` explicitly as advanced
- Rename `Logo padding` only if needed later; current wording is acceptable now that `Image crop` exists

## Implementation Phases

### Phase 1: Layout and ordering

- Make preview sticky on desktop
- Move preview higher in the flow
- Reorder sections to prioritize content, logo, preview, and download

### Phase 2: Progressive disclosure

- Collapse advanced settings by default
- Optionally collapse scan guidance when no warnings exist

### Phase 3: Action refinement

- Move download/reset/remove-logo actions closer to the preview
- Keep bottom actions only if needed for redundancy

## Acceptance Criteria

- On desktop, the preview remains visible during most logo adjustment work.
- On mobile, the preview appears early and does not require excessive scrolling to revisit.
- A non-technical user can upload a logo, adjust it, and download a QR without interacting with advanced settings.
- Advanced QR controls are available but no longer dominate the default view.
- Warnings remain visible and useful without overwhelming the layout when the configuration is safe.

## Recommendation

Implement the revisions in this order:

1. Sticky preview on desktop
2. Section reorder to prioritize logo workflow
3. Collapse advanced QR settings
4. Move primary actions near the preview

This sequence gives the largest UX improvement with the least functional risk.
