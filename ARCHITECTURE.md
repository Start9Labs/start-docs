# Architecture

## Multi-Book Design

The site is composed of independent mdBook instances — one per product. Each book has its own `book.toml`, `src/SUMMARY.md`, and content tree. Books build into subdirectories of `docs/` and are deployed together under a shared domain.

```
start-docs/
├── start-os/             ← StartOS book
│   ├── book.toml
│   ├── theme -> ../theme
│   └── src/
│       ├── SUMMARY.md
│       ├── README.md
│       ├── architecture.md
│       ├── installing.md
│       ├── user-manual/
│       ├── faq/
│       └── firmware/
├── start-tunnel/         ← StartTunnel book
│   ├── book.toml
│   ├── theme -> ../theme
│   └── src/
│       ├── SUMMARY.md
│       ├── README.md
│       ├── architecture.md
│       ├── installing/
│       ├── user-manual/
│       └── faq.md
├── packaging/            ← Service Packaging book
│   ├── book.toml
│   ├── theme -> ../theme
│   └── src/
│       ├── SUMMARY.md
│       ├── README.md
│       ├── environment-setup.md
│       ├── quick-start.md
│       ├── ... (14 guide pages)
│       └── assets/
├── landing/              ← Static landing page at docs.start9.com/
├── theme/                ← Shared theme (CSS, JS, favicon)
├── widget/               ← docs-agent chat widget (TypeScript)
├── scripts/              ← Build-time tooling
├── build.sh              ← Builds all books
└── serve.sh              ← Builds + local dev server
```

This design was chosen over a single monolithic book because:
- Each product gets its own sidebar, search, and URL namespace
- Adding a new product means adding a new directory, not restructuring existing content
- Books can have different structures while sharing a consistent top-level pattern (Installing, User Manual, Architecture, FAQ)

## Shared Theme

The `theme/` directory at repo root is the single source of truth for styling. Each book symlinks to it (`start-os/theme -> ../theme`). This includes:
- docs-agent widget CSS/JS
- YouTube embed styling
- mdbook-tabs CSS/JS
- Theme toggle
- Favicon

## Build Pipeline

`build.sh` runs `mdbook build` in each book directory. Output goes to `docs/<book-name>/`. The landing page is copied to `docs/index.html`. CI then generates `llms.txt` and `llms-full.txt` for LLM consumption.

## Scripts

| Script | Purpose |
|--------|---------|
| `generate-llms-txt.ts` | Produces `llms.txt` (index) and `llms-full.txt` (full content) for LLM consumption |

## Cross-Book Links

mdBook validates links within a single book. Links between books use absolute paths (`/start-tunnel/user-manual/devices.html`) and are not validated at build time. There are only a handful of these.
