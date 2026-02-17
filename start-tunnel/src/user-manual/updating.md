# Updating / Uninstalling

Keep StartTunnel up to date by re-running the installer, or remove it entirely when decommissioning a VPS.

## Updating

Re-run the install command:

```bash
curl -sSL https://start9labs.github.io/start-tunnel/install.sh | sh
```

The installer detects the existing installation, prompts for confirmation, and restarts the service.

## Uninstalling

StartTunnel is designed to run on a dedicated VPS. To remove it, simply destroy the VPS through your hosting provider. All WireGuard keys and configuration are stored on the VPS and will be removed with it.
