# SSH Access

Access your router's command line over SSH for advanced troubleshooting, package management, or direct configuration. SSH uses public key authentication — passwords are not accepted.

## Adding an SSH Key

1. Navigate to `System > Settings > SSH Keys`.

1. Click "Add Key".

1. Paste your public key (the contents of `~/.ssh/id_ed25519.pub` or `~/.ssh/id_rsa.pub`).

1. Give the key a name (e.g. "MacBook", "Desktop").

1. Click "Save".

> [!TIP]
> If you do not have an SSH key pair, generate one:
>
> ```
> ssh-keygen -t ed25519
> ```
>
> This creates a private key (`~/.ssh/id_ed25519`) and a public key (`~/.ssh/id_ed25519.pub`). Add the public key to StartWRT. Never share the private key.

## Connecting

Once your key is added, connect from a terminal:

```
ssh root@192.168.0.1
```

Replace `192.168.0.1` with your router's LAN IP address if you have changed it from the default.

## Removing an SSH Key

1. Navigate to `System > Settings > SSH Keys`.

1. Select the key and click "Remove".

> [!WARNING]
> Removing all SSH keys disables SSH access entirely. Ensure you can still access the web interface before removing your last key.

## What You Can Do Over SSH

SSH gives you root access to the underlying OpenWrt system. Common tasks:

- View and edit UCI configuration files in `/etc/config/`
- Install additional packages with `opkg`
- Run diagnostic commands (`ping`, `traceroute`, `nslookup`, `tcpdump`)
- Inspect firewall rules with `nft list ruleset`
- Monitor WireGuard tunnels with `wg show`
