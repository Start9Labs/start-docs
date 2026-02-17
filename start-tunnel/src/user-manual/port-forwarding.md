---
title: "Port Forwarding"
description: "Expose a device's port on your VPS's public IP address using StartTunnel."
section: "start-tunnel/user-manual"
type: "guide"
keywords: ["start-tunnel", "port forwarding", "public", "clearnet", "expose"]
---

# Port Forwarding

Port forwarding exposes a device's port on your VPS's public IP address. This is how you make services reachable from the public Internet.

1. In StartTunnel, navigate to `Port Forwards` and click "Add".

1. Select the external IP address you want to use (there is usually only one).

1. Enter the external port and the internal (device) port. You can find the required port mapping in StartOS by clicking the "ⓘ" icon next to any public address — it will display the `externalPort -> internalPort` needed (e.g. `443 -> 5443`).

1. If you are forwarding port `443 -> 5443`, you will see a checkbox to also forward port `80 -> 5443`. This is highly recommended, as it will automatically redirect HTTP to HTTPS.

1. Click "Save".
