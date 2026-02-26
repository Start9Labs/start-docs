# CLAUDE.md

See README.md for what this project is, CONTRIBUTING.md for how to work on it, and ARCHITECTURE.md for how it's structured.

## Rules

- Always re-read a file before making subsequent edits — a linter/formatter auto-modifies files after changes.
- Never use custom admonition titles. `> [!WARNING] Custom Title` is broken in mdBook. Always use plain `> [!WARNING]` and put context in the body.
- Avoid nested tabs. Use separate sections with single-level tabs.
- Cross-book links must use absolute paths (`/start-tunnel/user-manual/devices.html`), not relative paths.
- Every page should have introductory prose between the H1 heading and the first H2. This text is auto-extracted for `llms.txt` to help AI decide which pages to fetch.
- When creating a new page, add it to the book's `src/SUMMARY.md` or it won't appear in the sidebar or build.
- When adding a new book, add a single line to `versions.conf` — build, deploy, and nginx routing all derive from it. No other config files need updating.

## Maintenance

- **Repo docs**: When making changes that affect project structure, conventions, build process, or product context, update the relevant repo-root files:
  - `README.md` — if the public-facing summary, books table, or CI overview changes
  - `CONTRIBUTING.md` — if setup steps, writing conventions, or contribution workflow changes
  - `ARCHITECTURE.md` — if directory structure, design decisions, build pipeline, or scripts change
  - `CLAUDE.md` — if operating rules, commands, or product context changes

## Commands

- `./build.sh` — Build all books into `docs/`
- `./serve.sh` — Build + serve on http://localhost:3000
- `cd start-os && mdbook serve -p 3001` — Live-reload a single book
- `cd scripts && npm run generate-llms-txt` — Regenerate llms.txt files

## Product Context

- **StartOS 0.4.0**: Tor is a marketplace service (not built into StartOS core). Holesail is also a marketplace service. Outbound gateways support a system default plus per-service override.
- **Packaging guide**: The docs are the single source of truth for service packaging. Code examples are based on the [hello-world](https://github.com/Start9Labs/hello-world-startos) template.
- **StartTunnel**: A WireGuard-based gateway service for clearnet access. Separate product, separate book.
- **Bitcoin Guides**: Wallet indexes, Electrum servers, archival vs pruned nodes, LND migration. The Bitcoin package on StartOS integrates btc-rpc-proxy for on-demand block fetching, so pruned nodes work transparently with multiple downstream services.
