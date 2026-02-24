# CLI Reference

StartTunnel can be fully managed from the command line.

```
start-tunnel --help
```

## Subnets

Create isolated VLANs. Each subnet is a `/24` network (up to 254 devices).

```bash
start-tunnel subnet add --subnet 10.0.1.0/24 --name "home"
start-tunnel subnet remove --subnet 10.0.1.0/24
```

## Devices

Add devices to a subnet. Each device gets a unique WireGuard config.

```bash
start-tunnel device add --subnet 10.0.1.0/24 --name "laptop"
start-tunnel device add --subnet 10.0.1.0/24 --name "phone" --ip 10.0.1.50
start-tunnel device list --subnet 10.0.1.0/24
start-tunnel device show-config --subnet 10.0.1.0/24 --ip 10.0.1.2
start-tunnel device remove --subnet 10.0.1.0/24 --ip 10.0.1.2
```

## Port Forwarding

Expose a device's port on the VPS's public IP.

```bash
start-tunnel port-forward add --source 203.0.113.5:443 --target 10.0.1.2:443
start-tunnel port-forward remove --source 203.0.113.5:443
```

## Authentication

Manage passwords and authorized SSH keys for remote API access.

```bash
start-tunnel auth set-password
start-tunnel auth reset-password
start-tunnel auth key add --name "my-key" --key "ssh-ed25519 AAAA..."
start-tunnel auth key list
start-tunnel auth key remove --key "ssh-ed25519 AAAA..."
```

## Updating

Check for and install updates.

```bash
start-tunnel update
```

## Web Interface

Manage the admin web UI.

```bash
start-tunnel web init                          # Interactive setup wizard
start-tunnel web enable                        # Enable web UI
start-tunnel web disable                       # Disable web UI
start-tunnel web set-listen 0.0.0.0:8443       # Change listen address
start-tunnel web generate-certificate my.domain.com  # Generate TLS cert for a domain
start-tunnel web reset                         # Reset web UI (clears config and password)
```
