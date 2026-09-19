# OmniTool Overhaul — Design

**Date:** 2026-09-19
**Status:** Approved, implementing

## Problem

OmniTool advertises ~40 tools. Audit found that a large share do not work:

- **6 pure mocks** — Compare, Redact, Repair, Translate, PDF→PDF/A, Crop all run
  `setTimeout(2500)` and then claim success.
- **1 dangerous fake** — Protect PDF accepts a password, ignores it, and returns an
  **unencrypted** PDF described to the user as protected.
- **8 paid-API tools** — Word/PowerPoint/Excel→PDF, HTML→PDF, PDF→Word/PowerPoint/Excel
  require Adobe PDF Services credentials (free tier: 500 documents total, then paid).
- **2 stub routes** — `/api/convert` and `/api/remove-bg` return `mock-url-placeholder`.
- **4 simulated AI tools** — "AI Text Enhancer" is a chain of regex replacements.
- **1 production-broken tool** — Media Downloader shells out via `child_process.exec`;
  no such binary exists in a Vercel serverless function.

Deployment is also compromised: `public/lib/webviewer` is **175 MB of paid-licence Apryse
binaries committed to git** (794 files), making `public/` 194 MB. `canvas`, a native C++
module, is in `package.json` but imported nowhere.

## Constraints

Vercel free tier. No database. No paid services. No API keys.

Consequence: **every tool runs in the browser.** Zero serverless invocations, zero
bandwidth beyond static assets. State lives in memory and `localStorage`.

## Architecture

Today each tool is a 150–300 line client component re-implementing the same
upload → process → download chrome. ~6,600 lines, mostly duplication.

    src/lib/tools/registry.ts   tool metadata, search keywords, grouping
    src/lib/pdf/*.ts            pure processors: merge, split, crop, compare…
    src/lib/image/*.ts          pure processors: convert, crop, exif, palette…
    src/lib/text/*.ts           pure processors: json, hash, diff, csv…
    src/components/tool/
      ToolShell.tsx             breadcrumb, H1, work area, how-it-works, FAQ, related
      FileWorkbench.tsx         dropzone → file list → options → run → results
      TextWorkbench.tsx         input/output panes, copy, download, swap
      useFileJob.ts             progress, cancel, error, outputs, auto-ZIP

Processing logic is plain functions with no React, so it is unit-testable. Tool pages drop
to 40–100 lines of real logic. A fully config-driven engine was rejected: it fights tools
with bespoke UI (Organize PDF drag-drop, Sign PDF canvas, screen recorder).

## Visual system

Design tokens as the single source of truth in `globals.css`: type scale, spacing, radii,
one accent plus semantic surface tokens — replacing ~30 per-tool gradients. Light/dark/system
toggle via an inline pre-hydration script (no dependency, no FOUC); the hardcoded
`<html className="dark">` is removed. Homepage leads with instant client-side search over
the registry. One consistent tool-page layout.

## Catalogue — ~53 honest tools

**Keep & restyle (18):** Merge, Split, Rotate, Remove/Extract/Organize Pages, Page Numbers,
Watermark, Unlock, Compress, PDF→JPG, JPG→PDF, OCR, Scan to PDF, Sign, Image Resizer,
Image Compressor, Background Remover.

**Rebuild client-side (9):**

| Tool | Approach |
|---|---|
| Protect PDF | `@cantoo/pdf-lib` — MIT fork with real AES encryption |
| Crop PDF | pdf-lib `setCropBox` + visual overlay |
| Repair PDF | pdf-lib salvage-and-rebuild, page by page |
| Compare PDF | pdf.js text extraction + word-level diff |
| Word→PDF | `mammoth` → HTML → `jspdf` |
| Excel→PDF | SheetJS → `jspdf-autotable` |
| HTML→PDF | uploaded/pasted HTML → `jspdf` |
| PDF→Word | pdf.js extract → `docx` → real .docx |
| PDF→Excel | pdf.js extract + table heuristics → SheetJS |

**Add (26):**
- *Developer:* JSON formatter, Base64, JWT decoder, hash generator, UUID, URL encoder,
  regex tester, timestamp converter, text diff
- *Image:* format converter (bulk→ZIP), cropper, EXIF viewer/stripper, favicon generator,
  palette extractor, image→Base64
- *Text:* word counter, case converter, Markdown editor + PDF export, lorem ipsum,
  CSV↔JSON, text cleaner
- *Generators:* QR code, barcode, password generator, screen+webcam recorder, text-to-speech

**Drop (10):** Translate PDF, PDF→PDF/A, PDF↔PowerPoint, 4 simulated AI tools + AI Hub.
None are free-tier possible. **Redact PDF** is dropped specifically because a plausible
implementation (black boxes drawn over text) leaves the text extractable underneath — a
fake redaction is more dangerous than none.

Dropped routes get permanent redirects to the nearest surviving tool to preserve SEO.

**Media Downloader:** rewritten as a generic `og:image` / `og:video` extractor using plain
`fetch`. Social-platform scraping claims removed — ToS-violating and technically broken.

## Dependencies

**Remove:** `@pdftron/webviewer` (paid, 175 MB), `canvas` (native, unused).
**Add (all MIT, browser-side):** `@cantoo/pdf-lib`, `mammoth`, `xlsx`, `docx`, `jspdf`,
`jspdf-autotable`, `qrcode`, `jsbarcode`, `exifr`, `diff`.
**Keep:** Stripe (donations; integration is free).

Git history retains the Apryse blobs (123 MB `.git`). Rewriting history is out of scope —
deleting from the working tree is what fixes deploys.

## Testing

No test setup exists today. Vitest covers the pure `src/lib/**` processors, where
correctness lives. UI is verified with `next build`, lint, and manual checks.

## Phases

0. Cleanup: delete Apryse, drop dead tools, fix deps, add redirects
1. Design system: tokens, theme toggle, Header, Footer, ToolCard
2. Tool infrastructure: registry, ToolShell, workbenches, useFileJob
3. New tools: developer, image, text, generators
4. Rebuild the 9 broken tools; migrate the 18 keepers to the shell
5. Homepage search, category pages, SEO, sitemap
6. Verify: vitest, lint, next build
