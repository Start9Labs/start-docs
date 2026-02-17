# CLAUDE.md

See README.md for what this project is, CONTRIBUTING.md for how to work on it, and ARCHITECTURE.md for how it's structured.

## Rules

- Always re-read a file before making subsequent edits — a linter/formatter auto-modifies files after changes.
- Never use custom admonition titles. `> [!WARNING] Custom Title` is broken in mdBook. Always use plain `> [!WARNING]` and put context in the body.
- Avoid nested tabs. Use separate sections with single-level tabs.
- Cross-book links must use absolute paths (`/start-tunnel/user-manual/devices.html`), not relative paths.
- Every page needs YAML frontmatter. The pre-commit hook auto-syncs `title`, `section`, and `type` — don't worry about getting those exactly right. `description` and `keywords` must be provided manually.
- When creating a new page, add it to the book's `src/SUMMARY.md` or it won't appear in the sidebar or build.

## Maintenance

- **Frontmatter**: When editing any page, review its frontmatter. If the page content changes significantly (new heading, shifted topic, expanded scope), update `description` and `keywords` to reflect the current content.
- **Repo docs**: When making changes that affect project structure, conventions, build process, or product context, update the relevant repo-root files:
  - `README.md` — if the public-facing summary, books table, or CI overview changes
  - `CONTRIBUTING.md` — if setup steps, writing conventions, or contribution workflow changes
  - `ARCHITECTURE.md` — if directory structure, design decisions, build pipeline, or scripts change
  - `CLAUDE.md` — if operating rules, commands, or product context changes

## Commands

- `./build.sh` — Build all books into `docs/`
- `./serve.sh` — Build + serve on http://localhost:3000
- `cd startos && mdbook serve -p 3001` — Live-reload a single book
- `cd scripts && npm run validate-frontmatter` — Run frontmatter validation

## Product Context

- **StartOS 0.4.0**: Tor is a marketplace service (not built into StartOS core). Holesail is also a marketplace service. Outbound gateways support a system default plus per-service override.
- **Packaging guide**: The docs are the single source of truth for service packaging. Code examples are based on the [hello-world](https://github.com/Start9Labs/hello-world-startos) template.
- **StartTunnel**: A WireGuard-based gateway service for clearnet access. Separate product, separate book.
