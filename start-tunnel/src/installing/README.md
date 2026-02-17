# Installing

Install StartTunnel on a Debian VPS by renting a server, running the one-line installer script, and initializing the web interface. The entire process takes just a few minutes.

## 1. Get a VPS

Rent a cheap Debian 12+ VPS with a dedicated public IP. Minimum CPU/RAM/disk is fine. For bandwidth, no need to exceed your home Internet's upload speed.

### Requirements

- Debian 12+ (Bookworm or newer)
- x86_64, aarch64, or riscv64
- Root access
- Public IP (required for clearnet port forwarding; not required for private VPN use)

> [!IMPORTANT]
> StartTunnel is designed to be the sole application on your VPS. The installer disables UFW and manages its own firewall rules via iptables. Do not run other Internet-facing services on the same VPS.

## 2. Run the installer

SSH into your VPS and run:

```bash
curl -sSL https://start9labs.github.io/start-tunnel/install.sh | sh
```

> [!NOTE]
> If DNS resolution is not working on your VPS, the installer will configure public DNS resolvers (Google, Cloudflare, Quad9) and back up your existing `/etc/resolv.conf`.

## 3. Initialize the web interface

```bash
start-tunnel web init
```

You will be guided through setup and shown your web URL, password, and Root CA certificate. To access the web interface without browser warnings, [trust the Root CA on your device](/start-os/user-manual/trust-ca.html).

On subsequent runs (e.g. after updating), the password is not shown again. If you forget it, reset it with `start-tunnel auth reset-password`.

## 4. Next steps

- [Subnets](../user-manual/subnets.md) — Create isolated VLANs
- [Devices](../user-manual/devices.md) — Add servers, phones, and laptops
- [Port Forwarding](../user-manual/port-forwarding.md) — Expose ports on your VPS's public IP

