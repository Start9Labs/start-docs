# Updating / Uninstalling

Keep StartTunnel up to date by re-running the installer, or remove it entirely when decommissioning a VPS.

## Updating

There are three ways to update StartTunnel.

### Install script

Re-run the install command:

```bash
curl -sSL https://start9labs.github.io/start-tunnel/install.sh | sh
```

The installer detects the existing installation, prompts for confirmation, and restarts the service.

### CLI

```bash
start-tunnel update
```

### Web UI

Navigate to **Settings > Version > Check for Updates**.

## Uninstalling

StartTunnel is designed to run on a dedicated VPS. To remove it, simply destroy the VPS through your hosting provider. All WireGuard keys and configuration are stored on the VPS and will be removed with it.
