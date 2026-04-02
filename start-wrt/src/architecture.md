# Architecture

StartWRT is a fork of OpenWrt with a custom Rust backend and Angular web interface. It reimagines the router experience by abstracting raw networking primitives (VLANs, firewall zones, routing tables) behind the [Security Profile](security-profiles.md) model.

## Components

- **OpenWrt** — The base operating system. Handles kernel-level networking, WiFi drivers, and package management. StartWRT uses a fork targeting the SpacemiT K1 / BananaPi BPI-F3 board.
- **Rust backend** — A single binary (`startwrt`) that runs as both the RPC server (daemon mode) and the CLI. It manages all UCI configuration, service reloads, TLS certificates, authentication, and system operations.
- **Angular frontend** — A single-page application embedded in the backend binary. Communicates with the backend over JSON-RPC 2.0 via a single endpoint (`/rpc/v1`).

## Data Flow

```
Browser (Angular SPA)
  → HTTP POST /rpc/v1 (JSON-RPC 2.0, session cookie)
  → Axum router (ports 80/443)
  → Session auth middleware
  → RPC handler
  → UCI config read/write
  → Service reload (e.g. /etc/init.d/network reload)
  → JSON-RPC response
```

The frontend never touches UCI files, shell commands, or system services directly. Every operation goes through a purpose-built RPC method on the backend.

## UCI as Source of Truth

All persistent configuration lives in UCI files under `/etc/config/`. There is no separate database. The backend reads and writes these files using a custom Rust UCI parser (`uciedit`) that provides:

- **Typed access** — Compile-time-safe access to UCI sections via `#[derive(TypedSection)]`
- **Atomic writes** — Temp file, write, fsync, rename pattern to prevent corruption
- **Conflict detection** — Mtime checking with automatic retry on concurrent writes

## Security Profile Internals

When you create a [Security Profile](security-profiles.md), the backend orchestrates changes across multiple UCI config files:

| UCI Config | What Changes |
|------------|-------------|
| `network` | New bridge interface, VLAN, and subnet |
| `firewall` | New zone with inter-zone forwarding rules |
| `dhcp` | New DHCP server for the profile's subnet |
| `wireless` | New PSK entry in `wpa_psk_file` (for WiFi passwords) |

This is why the web interface never exposes raw VLANs or firewall rules — the profile abstraction handles all of it consistently.

## VLAN Isolation

Device isolation uses bridge VLAN filtering at Layer 2. Each Security Profile is assigned a unique VLAN ID. Traffic is tagged at the entry point (Ethernet port, WiFi password, or VPN server) and can only reach destinations within the same VLAN unless the firewall explicitly allows inter-zone traffic.

This approach works identically whether the router uses a hardware switch (DSA) or software bridging.

## Authentication

- **Admin password** — Stored as a SHA-512 hash in `/etc/shadow`
- **Sessions** — Random token (base32) stored as SHA-256 hash in `/etc/startwrt/sessions.json`; 1-day expiry; HTTP-only SameSite=Strict cookie
- **Rate limiting** — 3 login attempts per 20 seconds
- **SSH** — Public key authentication only (no password auth)
- **CLI auth** — Local auth cookie generated at daemon startup in `/run/startwrt/rpc.authcookie`

## WiFi Identity PSK

StartWRT's multi-password WiFi uses WPA2's `wpa_psk_file` with dynamic VLAN assignment. Each password in the PSK file is associated with a VLAN ID. When a device authenticates, hostapd matches the password, looks up the VLAN, and places the device on the correct bridge interface — all transparently.

```
WiFi Interface (SSID: "StartWRT")
├── Sticker password → dynamic_vlan = ALLOWED → default LAN
├── "guest-pass" → VLAN 101 → Guest profile subnet
├── "kids-pass" → VLAN 102 → Children profile subnet
└── "iot-pass" → VLAN 103 → Smart Devices profile subnet
```

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Base OS | OpenWrt (SpacemiT K1 target) |
| Backend | Rust (Tokio, Axum, rpc-toolkit) |
| Frontend | Angular 21, TypeScript 5.9, Taiga UI v5 |
| Config storage | UCI files (`/etc/config/`) |
| API protocol | JSON-RPC 2.0 over HTTP |
| VPN | WireGuard (kernel module) |
| TLS | rustls (Root CA → Intermediate → Server cert chain) |

## Source Code

The StartWRT source code lives in the [start-wrt repository](https://github.com/Start9Labs/start-wrt).

To report bugs or request features, [open an issue](https://github.com/Start9Labs/start-wrt/issues).
