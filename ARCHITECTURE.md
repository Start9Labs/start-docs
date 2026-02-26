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
├── bitcoin-guides/       ← Bitcoin Guides book
│   ├── book.toml
│   ├── theme -> ../theme
│   └── src/
│       ├── SUMMARY.md
│       ├── README.md
│       ├── archival-vs-pruned.md
│       ├── electrum-servers.md
│       ├── bitcoin-wallets.md
│       ├── lightning-wallets.md
│       └── lnd-migration.md
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

## Versioning

Each book is versioned independently via `versions.conf` at repo root:

```
start-os=0.4.0.x
start-tunnel=1.0.x
packaging=0.4.0.x
bitcoin-guides=1.0.x
```

Adding a new book only requires adding a line to `versions.conf` — the build script, deploy workflow, and nginx routing all derive from this file automatically.

Build output goes to `docs/<book>/<version>/` (e.g. `docs/start-os/0.4.0.x/`). The `site-url` is set via environment variable at build time so mdbook generates correct search indexes and canonical URLs for the versioned path.

## Build Pipeline

`build.sh` iterates over `versions.conf` and runs `mdbook build` in each book directory with versioned output paths. The landing page is copied to `docs/index.html`. CI then generates `llms.txt` and `llms-full.txt` for LLM consumption.

## Deployment

Deployment is via GitHub Actions (`.github/workflows/deploy.yml`):

1. Build all books and generate llms.txt
2. rsync each versioned book directory to the VPS at `/var/www/html/docs.start9.com/`
3. Generate and upload `book_versions.conf` (nginx map config) from `versions.conf`
4. Reload nginx

The nginx site configs are fully generic — they contain no book names. The book list is controlled entirely by `book_versions.conf`, which the deploy workflow generates from `versions.conf`. Unversioned URLs (e.g. `/start-os/`) are redirected to the latest version via nginx maps. The `?version=` query param can override this for linking to specific versions.

The deploy key is stored as the `DOCS_DEPLOY_KEY` GitHub Actions secret.

## Scripts

| Script | Purpose |
|--------|---------|
| `generate-llms-txt.ts` | Produces `llms.txt` (index) and `llms-full.txt` (full content) for LLM consumption |

## Cross-Book Links

mdBook validates links within a single book. Links between books use unversioned absolute paths (`/start-tunnel/user-manual/devices.html`) — nginx redirects these to the latest versioned path. These are not validated at build time. There are only a handful of these.
