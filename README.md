# Start9 Docs

The official documentation for [Start9](https://start9.com) products — covering StartOS, StartTunnel, Service Packaging, and Bitcoin Guides.

**Live site:** [docs.start9.com](https://docs.start9.com)

## Books

| Product | URL | Content |
|---------|-----|---------|
| [StartOS](start-os/) | [docs.start9.com/start-os](https://docs.start9.com/start-os/) | Installation, user manual, architecture, FAQ, firmware |
| [StartTunnel](start-tunnel/) | [docs.start9.com/start-tunnel](https://docs.start9.com/start-tunnel/) | Installation, user manual, architecture, FAQ |
| [Service Packaging](packaging/) | [docs.start9.com/packaging](https://docs.start9.com/packaging/) | Developer guide for building and publishing StartOS services |
| [Bitcoin Guides](bitcoin-guides/) | [docs.start9.com/bitcoin-guides](https://docs.start9.com/bitcoin-guides/) | Guides for running Bitcoin and related services on StartOS |

## How It Works

Built with [mdBook](https://rust-lang.github.io/mdBook/) and deployed via rsync to a VPS. Each product is an independent mdBook instance sharing a common theme.

On push to `master`, GitHub Actions:
1. Builds all books into versioned `docs/` output directories
2. Generates `llms.txt` and `llms-full.txt` for LLM consumption
3. Indexes the content for the embedded [Start Bot](widget/) chat widget via RAG ([Voyage AI](https://www.voyageai.com/) embeddings + [start9-me](https://github.com/Start9Labs/start9-me) semantic search)
4. Deploys to the VPS via rsync and reloads nginx

## Getting Started

See [CONTRIBUTING.md](CONTRIBUTING.md) for local development setup and how to submit changes.

See [ARCHITECTURE.md](ARCHITECTURE.md) for how the repo is structured and why.
