# Proposal: Static QR Code Generator Tool

Add a client-only QR code generator page to the Astro static site.

## Why

This is worth building because it is small, useful, and aligned with the existing static-site model. The tool can run entirely in the browser, so it does not require a backend, database, authentication, or tracking infrastructure. It also creates a practical reusable asset for small business work, especially branded QR codes for flyers, invoices, booking links, and printed material.

The goal is not to clone a SaaS QR platform. The goal is to build a lightweight static utility with enough styling control to replace ad hoc external tools.

## Rationale

Use an existing QR styling library instead of implementing QR encoding and rendering manually. QR correctness and scan reliability are easy to degrade, so the implementation should rely on a maintained QR rendering library and keep custom logic limited to UI, logo preprocessing, color extraction, validation, and export flow.

Preferred library:

```bash
pnpm add qr-code-styling
```

## MVP Scope

Create a page such as:

```txt
src/pages/tools/qr-code.astro
```

The page should provide:

- Text/URL input
- QR size control
- Margin control
- Foreground color
- Background color
- Dot style selector
- Corner square style selector
- Corner dot style selector
- Logo upload
- Logo size/margin controls
- Live QR preview
- PNG export
- SVG export if supported cleanly

## Static-Only Requirements

This must remain fully client-side:

- No backend
- No database
- No scan tracking
- No uploaded files sent anywhere
- Logo processing must happen in-browser
- Generated QR codes should be downloadable locally

## Nice-to-Have Enhancements

Add only after the MVP works:

- Circular logo crop using canvas
- Rounded-square logo crop using canvas
- Auto-pick QR foreground color from uploaded logo
- Contrast warning between foreground/background
- Local preset saving with localStorage
- Small “scan reliability” guidance panel

## Implementation Notes

Use Astro for the page shell, but initialize the QR generator only in the browser. Avoid server-side imports that break static rendering. If necessary, dynamically import the QR library inside a client script.

The custom logo workflow should be:

1. User uploads logo.
2. Browser reads image with FileReader.
3. Optional canvas preprocessing applies circular or rounded clipping.
4. Processed data URL is passed to the QR library as the embedded image.

## Acceptance Criteria

- Page builds in the static Astro site.
- QR updates live when text, color, shape, size, or logo settings change.
- QR remains scannable with default settings.
- PNG download works.
- No network calls are made for logo processing or QR generation.
- Tool works after deployment to Cloudflare Pages.
