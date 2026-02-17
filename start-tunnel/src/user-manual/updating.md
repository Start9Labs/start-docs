---
title: "Updating / Uninstalling"
description: "Update StartTunnel to the latest version or decommission your VPS."
section: "start-tunnel/user-manual"
type: "guide"
keywords: ["start-tunnel", "update", "upgrade", "uninstall", "decommission"]
---
# Updating / Uninstalling

## Updating

Re-run the install command:

```bash
curl -sSL https://start9labs.github.io/start-tunnel/install.sh | sh
```

The installer detects the existing installation, prompts for confirmation, and restarts the service.

## Uninstalling

StartTunnel is designed to run on a dedicated VPS. To remove it, simply destroy the VPS through your hosting provider. All WireGuard keys and configuration are stored on the VPS and will be removed with it.
