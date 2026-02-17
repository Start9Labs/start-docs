# Start9 Docs

The official documentation for [Start9](https://start9.com) products — covering StartOS, StartTunnel, and Service Packaging.

**Live site:** [docs.start9.com](https://docs.start9.com)

## Books

| Product | URL | Content |
|---------|-----|---------|
| [StartOS](startos/) | [docs.start9.com/startos](https://docs.start9.com/startos/) | Installation, user manual, architecture, FAQ, firmware |
| [StartTunnel](start-tunnel/) | [docs.start9.com/start-tunnel](https://docs.start9.com/start-tunnel/) | Installation, user manual, architecture, FAQ |
| [Service Packaging](packaging/) | [docs.start9.com/packaging](https://docs.start9.com/packaging/) | Developer guide for building and publishing StartOS services |

## How It Works

Built with [mdBook](https://rust-lang.github.io/mdBook/) and deployed to GitHub Pages. Each product is an independent mdBook instance sharing a common theme.

On push to `master`, GitHub Actions:
1. Builds all books into a single `docs/` output directory
2. Generates `llms.txt` and `llms-full.txt` for LLM consumption
3. Indexes the content for the embedded [Start Bot](widget/) chat widget via RAG ([Voyage AI](https://www.voyageai.com/) embeddings + [start9-me](https://github.com/Start9Labs/start9-me) semantic search)
4. Deploys to GitHub Pages

## Getting Started

See [CONTRIBUTING.md](CONTRIBUTING.md) for local development setup and how to submit changes.

See [ARCHITECTURE.md](ARCHITECTURE.md) for how the repo is structured and why.
