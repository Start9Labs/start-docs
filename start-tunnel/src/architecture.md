---
title: "StartTunnel"
description: "Architecture deep-dive: how StartTunnel works, security model, comparison with Cloudflare Tunnel and Tailscale."
section: "start-tunnel"
type: "guide"
keywords:
  [
    "start-tunnel",
    "wireguard",
    "vpn",
    "architecture",
    "cloudflare",
    "tailscale",
    "security",
  ]

product: StartTunnel
tagline: A self-hosted WireGuard VPN optimized for creating VLANs and reverse tunneling to personal servers.
category: networking
license: MIT
source: https://github.com/Start9Labs/start-os
installer: https://github.com/Start9Labs/start-tunnel
docs: https://docs.start9.com
issues: https://github.com/Start9Labs/start-os/issues

architecture:
  protocol: WireGuard
  port_forwarding: iptables DNAT (Layer 3/4 NAT)
  tls_termination: at origin service (VPS never decrypts)
  self_hosted: fully
  telemetry: none
  accounts_required: none
  coordination_server: none

crypto:
  symmetric: ChaCha20-Poly1305
  key_exchange: Curve25519
  hashing: BLAKE2s
  post_quantum: pre-shared keys (PSK) per peer

requirements:
  os: Debian 12+ (Bookworm)
  architectures: [x86_64, aarch64, riscv64]
  root: true
  dedicated_vps: true
  public_ip: required for clearnet port forwarding only

features:
  - Isolated VLAN subnets (/24 networks, up to 254 devices each)
  - WireGuard device management with auto-generated configs
  - TCP and UDP port forwarding to any device on any subnet
  - Web UI with self-signed TLS and Root CA
  - Full CLI management (subnets, devices, port-forwards, auth, web)
  - Password and SSH key authentication

cli_commands:
  - command: start-tunnel subnet add/remove
    description: Create or delete isolated VLAN subnets
  - command: start-tunnel device add/remove/list/show-config
    description: Manage devices and generate WireGuard configs
  - command: start-tunnel port-forward add/remove
    description: Forward public ports to devices on subnets
  - command: start-tunnel auth set-password/reset-password
    description: Manage admin password
  - command: start-tunnel auth key add/list/remove
    description: Manage SSH keys for remote API access
  - command: start-tunnel web init/enable/disable/reset
    description: Manage the admin web interface
  - command: start-tunnel web set-listen/generate-certificate
    description: Configure web UI listen address and TLS certificates

comparison:
  vs_cloudflare_tunnel:
    summary: Cloudflare terminates TLS at their edge and can inspect plaintext traffic. StartTunnel does L3/L4 NAT passthrough.
    tls: Cloudflare terminates at edge; StartTunnel passes through to origin
    self_hosted: Cloudflare edge is proprietary; StartTunnel is fully self-hosted
    privacy: Cloudflare sees all traffic; StartTunnel has no third party in the data path
    tos: Cloudflare prohibits video streaming without R2/Stream; StartTunnel has no restrictions
    cost: Cloudflare free (50 users), then $7/user/mo; StartTunnel free + VPS (~$5-10/mo)
  vs_tailscale:
    summary: Tailscale uses a proprietary coordination server. Device-to-device is E2E encrypted, but Funnel terminates TLS at Tailscale ingress.
    tls: Tailscale Funnel terminates at ingress; StartTunnel passes through to origin
    self_hosted: Tailscale coordination server proprietary (Headscale exists); StartTunnel fully self-hosted
    privacy: Tailscale sees metadata (IPs, devices, OS); StartTunnel has no third party
    cost: Tailscale free (3 users), then $5-18/user/mo; StartTunnel free + VPS (~$5-10/mo)

---

# StartTunnel

A self-hosted WireGuard VPN optimized for creating VLANs and reverse tunneling to personal servers.

Think of it as a "virtual router in the cloud." Use it for private remote access to self-hosted services, or to expose services to the public Internet without revealing your server's IP address.

- **Clearnet hosting** like Cloudflare Tunnels, but you control the server
- **Private access** like Tailscale, but fully self-hosted
- **Dead simple** — one command to install, manage everything from the CLI or web UI
- **Open source** — audit it, fork it, own it

> [!NOTE]
> For setup instructions, see the [User Manual](./user-manual/).

## Features

- **Create Subnets** — Each subnet creates a private VLAN, similar to the LAN created by a home router
- **Add Devices** — Servers, phones, laptops get a LAN IP and unique WireGuard config
- **Forward Ports** — Expose specific ports on specific devices to the public Internet

## How StartTunnel Compares

StartTunnel occupies a unique position between Cloudflare Tunnel and Tailscale. All three solve the problem of connecting devices across the Internet, but they make fundamentally different trade-offs around trust, control, and convenience.

### Architecture

**StartTunnel** is a WireGuard VPN server that runs on a VPS you control. Clients connect via standard WireGuard tunnels. Port forwarding uses kernel-level iptables NAT (Layer 3/4) to route public traffic to devices on the VPN. There is no central service, no coordination server, and no third party in the data path.

**Cloudflare Tunnel** runs a daemon (`cloudflared`) on your machine that makes outbound connections to Cloudflare's global edge network. Public traffic hits Cloudflare's CDN first, where Cloudflare terminates TLS, inspects the request at Layer 7, and proxies it to your origin through the tunnel.

**Tailscale** is a mesh VPN built on WireGuard. A proprietary coordination server (hosted by Tailscale Inc.) distributes keys and facilitates peer discovery, while actual traffic flows directly between devices. For public exposure, Tailscale Funnel routes traffic through Tailscale's ingress servers, which terminate TLS.

### Privacy and Trust

This is the most important difference. It comes down to: **who can see your traffic?**

**StartTunnel**: Nobody but you. Port forwarding operates at Layer 3/4 (iptables DNAT), meaning the VPS rewrites IP headers and forwards packets without inspecting payloads. If a service uses HTTPS, TLS terminates at the service itself — the VPS never sees plaintext. For VPN traffic between devices, WireGuard provides end-to-end encryption. Since you own the VPS, there is no third party with access to your traffic or metadata.

**Cloudflare Tunnel**: Cloudflare terminates TLS at their edge and re-encrypts to your origin. This means Cloudflare can — and does — see plaintext traffic. They offer "TLS inspection" as a feature and can scan request bodies, filter content, and inject responses. Using Cloudflare Tunnel requires trusting a publicly traded company not to misuse its position as a man-in-the-middle on all your traffic.

**Tailscale**: For device-to-device traffic, encryption is end-to-end — even Tailscale's DERP relay servers forward encrypted packets they cannot read. However, the coordination server (run by Tailscale Inc.) sees metadata: which devices are connecting, their IPs, OS versions, and connection state. Tailscale explicitly states it is "not an anonymity service." For public exposure via Funnel, Tailscale's ingress servers terminate TLS, similar to Cloudflare.

### Self-Hosting and Sovereignty

**StartTunnel**: Fully self-hosted. You rent a VPS, run the installer, and own the entire stack. No phone-home, no telemetry, no accounts, no dependency on any company's infrastructure. If Start9 disappeared tomorrow, your tunnel would keep working.

**Cloudflare Tunnel**: The `cloudflared` client runs on your machine, but all traffic must route through Cloudflare's proprietary global network. You cannot self-host the edge. If Cloudflare goes down — as happened in a [5.5-hour outage in November 2025](https://blog.cloudflare.com/18-november-2025-outage/) — your services go down with it.

**Tailscale**: The client is mostly open source, but the coordination server is proprietary. [Headscale](https://github.com/juanfont/headscale) is a community-built open source alternative, but it reimplements a narrower scope (single tailnet) and is not maintained by Tailscale. By default, you depend on Tailscale Inc. for key distribution, peer discovery, and DERP relays.

### Vendor Lock-In and Terms of Service

**StartTunnel**: MIT licensed. No terms of service. No content restrictions. No account that can be terminated. Use it however you want.

**Cloudflare Tunnel**: Cloudflare's ToS [prohibit streaming video or large file serving](https://www.cloudflare.com/service-specific-terms-zero-trust-services/) unless you use Cloudflare R2/Stream. Cloudflare reserves the right to terminate accounts "at any time, with or without notice for any reason or no reason at all." Your services are one policy change away from going dark.

**Tailscale**: More permissive terms than Cloudflare, but you still depend on a company's continued goodwill and operation. The free tier (3 users, 100 devices) has limits that paid tiers expand.

### Comparison Table

|                            | StartTunnel                               | Cloudflare Tunnel                          | Tailscale                                               |
| -------------------------- | ----------------------------------------- | ------------------------------------------ | ------------------------------------------------------- |
| **Architecture**           | WireGuard VPN to your VPS                 | Outbound tunnel to Cloudflare edge         | WireGuard mesh with coordination server                 |
| **Who sees your traffic?** | Only you                                  | Cloudflare (TLS terminated at edge)        | Nobody for P2P; Tailscale for Funnel                    |
| **TLS termination**        | At the origin service (L3/L4 passthrough) | At Cloudflare's edge (L7 proxy)            | At origin for P2P; at Tailscale for Funnel              |
| **Self-hostable?**         | Fully                                     | Client only; edge is proprietary           | Client + DERP relays; coordination server via Headscale |
| **Open source**            | Fully (MIT)                               | Client only (Apache-2.0)                   | Client mostly; coordination server proprietary          |
| **Requires account?**      | No                                        | Yes (Cloudflare account)                   | Yes (via third-party identity provider)                 |
| **DNS management**         | None (bring your own)                     | Optional (Cloudflare DNS or external)      | MagicDNS for private; \*.ts.net for Funnel              |
| **Works behind CGNAT?**    | Yes (clients initiate outbound UDP)       | Yes (client initiates outbound QUIC/HTTP2) | Yes (hole-punching + DERP fallback)                     |
| **Subnet isolation**       | Yes (isolated VLANs)                      | N/A                                        | ACLs between devices                                    |
| **Protocol**               | TCP + UDP forwarding                      | HTTP/S, TCP, UDP (via QUIC)                | Any (WireGuard tunnel)                                  |
| **DDoS protection**        | None (use VPS provider's)                 | Built-in (Cloudflare network)              | None                                                    |
| **Global edge/CDN**        | No (single VPS location)                  | Yes (Cloudflare's global network)          | No (direct P2P or DERP relay)                           |
| **Content restrictions**   | None                                      | No video streaming without R2/Stream       | None                                                    |
| **Cost**                   | Free + VPS (~$5-10/mo)                    | Free (50 users); $7/user/mo above          | Free (3 users); $5-18/user/mo                           |

### What You Give Up

StartTunnel prioritizes sovereignty over convenience. That means:

- **No DDoS protection** — Your VPS IP is exposed on forwarded ports. Use your VPS provider's DDoS protection, or place a CDN in front if needed.
- **No global edge network** — Traffic routes through one VPS, not a global CDN. Latency depends on VPS location.
- **No built-in DNS** — You manage your own DNS records.
- **No identity provider integration** — Authentication is key-based and password-based, not SSO.
- **You manage the VPS** — Minimal maintenance (Debian + one binary), but it's yours to keep updated.

For many self-hosters, these trade-offs are not just acceptable — they're the point.

## Security

StartTunnel is built on [WireGuard](https://www.wireguard.com/), a modern VPN protocol with a minimal, auditable codebase (~4,000 lines of code in-kernel).

- **Encryption**: ChaCha20-Poly1305 for symmetric encryption, Curve25519 for key exchange, BLAKE2s for hashing
- **Pre-shared keys**: Each peer connection uses an additional pre-shared key (PSK) for a layer of post-quantum resistance
- **Key isolation**: Private keys are generated on-device and never leave the device. Only public keys are exchanged.
- **TLS passthrough**: Port-forwarded traffic is not decrypted by the VPS. If your service uses HTTPS, TLS terminates at the service, not the tunnel.

## Requirements

- Debian 12+ (Bookworm or newer)
- x86_64, aarch64, or riscv64
- Root access
- Public IP (required for clearnet port forwarding; not required for private VPN use)

## Source Code

The StartTunnel source code and release binaries live in the [StartOS monorepo](https://github.com/Start9Labs/start-os). The [start-tunnel repo](https://github.com/Start9Labs/start-tunnel) hosts the installer script via GitHub Pages.

To report bugs or request features, [open an issue](https://github.com/Start9Labs/start-os/issues).
