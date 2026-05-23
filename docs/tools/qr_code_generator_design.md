# QR Code Generator Design (Client-Facing v1)

## Purpose

Create a polished, static, client-only QR code generator at `/tools/qr-code` for a non-technical client who needs branded QR output within one week.

The tool must allow visual customization (theme, logo, logo crop) while preserving scan reliability through clear defaults and warnings.

## Confirmed Product Intent

- Primary user: non-technical client (direct use).
- Payload type: generic text/URL input (no forced `https://`; user tests manually before export).
- Safety model: warnings first, with a quick safe-default reset.
- Visual customization: core feature, not optional polish.
- Auto color extraction from uploaded logo: v1 feature, with user override.
- Logo upload: optional; >1MB warns but is still user-controlled.
- Core export: PNG only for v1 to preserve QR sharpness and print reliability.
- Route: `/tools/qr-code` only for now; no nav integration yet.
- High-value education: scan reliability panel visible by default.
- Delivery target: near-complete, polished v1.

## Scope

### In Scope (v1)

- Generic text/URL input field with live preview updates.
- QR styling controls:
  - size
  - margin (quiet zone)
  - foreground color
  - background color
  - optional transparent background mode
  - dot style
  - corner square style
  - corner dot style
- Logo upload and embedding:
  - optional upload
  - file size warning for files over 1MB
  - logo size control
  - logo margin control
  - crop modes:
    - none (original)
    - circle crop
    - rounded rectangle crop
  - auto foreground color extraction from uploaded logo, with manual override
- Presets (small curated set, no sprawl).
- Reliability guidance panel (always visible on load).
- Warning system for risky settings.
- “Reset to safe defaults” action.
- Export button:
  - `Download PNG` -> `qr_code.png`

### Out of Scope (deferred)

- SVG export
- JPEG export
- copy current configuration as JSON for debugging/support
- server-side processing/storage
- analytics/tracking
- account/preset sync
- nav/menu updates

## Technical Approach

### Framework and Rendering

- Keep Astro page static: `src/pages/tools/qr-code.astro`.
- Initialize QR rendering in browser only (client script).
- Use `qr-code-styling` for reliable QR generation and drawing.
- Dynamically import `qr-code-styling` in browser-only execution paths.
- Avoid SSR-time imports that can break static output.
- Use high QR error correction by default to better tolerate embedded logos and styling.

### Data and Privacy

- Fully local execution in browser.
- No logo upload/network transfer.
- No backend or API dependencies.

### Logo Preprocessing Pipeline

1. User selects image.
2. File is read with `FileReader`.
3. Image is drawn to in-memory canvas.
4. Crop mask is applied based on selected mode:
   - none
   - circle
   - rounded rectangle
5. Processed image is converted to Data URL.
6. Dominant/accent logo color is extracted from the processed image and proposed as the QR foreground color.
7. Data URL is passed to QR renderer as embedded logo.

## UX Design

### Layout

- Two-column desktop layout:
  - left: controls
  - right: live preview + export actions + reliability panel
- Single-column mobile layout with preview surfaced early.

### Controls Organization

- Section: `Content`
  - text/URL input
- Section: `QR Style`
  - size, margin, colors, dot/corner styles
- Section: `Logo`
  - upload, crop mode, logo size, logo margin
  - file-size advisory warning (>1MB)
  - auto color extraction toggle/apply action
- Section: `Presets`
  - compact preset list
- Actions:
  - reset safe defaults
  - download PNG

### Preset Strategy (No Sprawl)

Use 3-4 curated presets only:

- `Clean` (high contrast, classic)
- `Soft Brand` (gentle rounding)
- `Bold Contrast` (high visual emphasis)
- `Minimal Ink` (lighter visual style but still scan-safe)

Each preset updates style controls and reliability-aligned defaults, including logo presentation settings (for example crop mode) when a logo is present. Users can freely adjust settings after applying a preset.

## Reliability and Guardrails

### Visible Reliability Panel (default open)

Panel includes concise guidance:

- keep contrast high between foreground/background
- keep sufficient quiet zone
- avoid oversized logos
- test scan on at least one phone before print
- print test before bulk production

### Warning Conditions (non-blocking)

Warn when:

- foreground/background contrast is low
- quiet zone margin is too small
- logo size exceeds recommended share of QR area
- input is empty
- uploaded logo exceeds 1MB
- transparent background mode may reduce scan reliability on low-contrast surfaces

Warnings are informative, not hard blocks, to preserve client experimentation.

### Safe Defaults

Provide one-click reset that restores scan-safe baseline values for:

- size
- quiet zone margin
- high-contrast colors
- opaque white background (transparent mode disabled by default)
- conservative dot/corner styles
- conservative logo size/margin
- no crop distortion

## Export Behavior

- PNG export via QR library download flow.
- PNG is the only v1 export format to preserve sharp edges and reduce print-scan risk.
- PNG export supports either solid background color or transparent background.
- Filename:
  - `qr_code.png`

## Accessibility and Usability

- Label all form controls clearly.
- Keep instructional copy plain-language for non-technical users.
- Ensure color contrast of UI controls meets accessibility expectations.
- Ensure keyboard-operable form and action buttons.

## Performance

- Client-only bundle should remain modest.
- Debounce rapid control updates where needed for smooth preview.
- Handle large logo files gracefully with warnings.

## Acceptance Criteria (Implementation Sign-off)

- Static Astro build succeeds.
- Tool is accessible at `/tools/qr-code`.
- Text/URL input, style controls, and logo controls update preview live.
- Circle and rounded-corner logo crop options function correctly.
- Auto color extraction from uploaded logo works and can be manually overridden.
- File size warning appears for logo uploads over 1MB.
- Reliability panel is visible by default.
- Warnings appear for risky configurations.
- Transparent background mode works and displays a contrast guidance warning.
- Safe default reset restores opaque white background by default.
- PNG download works with required filename.
- Generated QR codes remain scannable using default iOS and Android camera apps.
- No backend/network dependency for QR generation or logo processing.
- Mobile and desktop layouts are usable and readable.

## Implementation Notes

- Keep internal links root-relative.
- Keep code modular: separate state, warnings, and export helpers where practical.
- Favor maintainability and understandable defaults over control sprawl.
