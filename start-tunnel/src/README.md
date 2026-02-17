# StartTunnel

A self-hosted WireGuard VPN optimized for creating VLANs and reverse tunneling to personal servers.

Think of it as a "virtual router in the cloud." Use it for private remote access to self-hosted services, or to expose services to the public Internet without revealing your server's IP address.

- **Clearnet hosting** like Cloudflare Tunnels, but you control the server
- **Private access** like Tailscale, but fully self-hosted
- **Dead simple** — one command to install, manage everything from the CLI or web UI
- **Open source** — audit it, fork it, own it

<div class="yt-video" data-id="KZ2_jwayAgg" data-title="Intro To StartTunnel"></div>

## Guides

- [Installing](installing/) — Set up StartTunnel on a VPS
- [Subnets](user-manual/subnets.md) — Create isolated VLANs
- [Devices](user-manual/devices.md) — Add servers, phones, and laptops to a subnet
- [Port Forwarding](user-manual/port-forwarding.md) — Expose ports on your VPS's public IP
- [Updating / Uninstalling](user-manual/updating.md) — Update to the latest version or decommission your VPS
- [CLI Reference](user-manual/cli-reference.md) — Manage StartTunnel from the command line

## Learn More

- [How StartTunnel Works](architecture/) — Architecture deep-dive, comparison to Cloudflare and Tailscale, security model
- [Source Code](https://github.com/Start9Labs/start-os) — StartTunnel lives in the StartOS monorepo
- [Report Bugs](https://github.com/Start9Labs/start-os/issues) — Open an issue on GitHub
