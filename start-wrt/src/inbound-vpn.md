# Inbound VPNs

Create WireGuard VPN servers on your router for secure remote access to your home network. Each VPN server maps to a [Security Profile](security-profiles.md), so remote devices receive the same access controls as if they were physically connected.

## How It Works

An inbound VPN server listens for WireGuard connections from the Internet. When a remote device connects, it is assigned the VPN server's Security Profile — gaining access to the LAN, Internet, or both, according to that profile's rules. This is like giving someone a key to a specific door in your house rather than handing them the master key.

> [!IMPORTANT]
> Inbound VPN requires either a public IP address or [Dynamic DNS](ddns.md) so remote devices can reach your router. If your ISP uses CGNAT, inbound connections cannot reach your router directly. Consider using [StartTunnel](/start-tunnel/) as a gateway instead.

## Creating a VPN Server

1. Navigate to `Points of Entry > Inbound VPNs` and click "Add".

1. Configure the server:

   - **Label** — A descriptive name (e.g. "Home VPN", "Friends", "Work").
   - **Endpoint** — The address where remote clients will connect. Select from available options: WAN IPv4 address, WAN IPv6 address, or a DDNS domain (if [Dynamic DNS](ddns.md) is configured). If you have a dynamic IP, use a DDNS domain so clients do not need to update their configuration when your IP changes.
   - **Security Profile** — The [Security Profile](security-profiles.md) to assign to connecting clients.
   - **Port** — The WireGuard listen port (default: `51820`). Must be unique across all VPN servers. If the default is already in use, the next available port is suggested.

1. Click "Save".

## Managing Clients

Each VPN server has a client management page listing all peers. Navigate to a VPN server and click "Manage clients" from the actions menu to view the client list, which shows each peer's name, LAN IP address, and routing mode.

### Adding a Client

1. Select the VPN server and click "Add".

1. Configure the client:

   - **Label** — A name for the client (e.g. "My iPhone", "Work Laptop").
   - **LAN IP Address** — The IP address assigned to this client on the VPN subnet.
   - **Public Key** — (Optional) Enter an existing WireGuard public key if the device already has a keypair configured. Leave empty to auto-generate a keypair.
   - **Route all traffic through tunnel** — When enabled, all of the client's Internet traffic routes through the VPN (full tunnel). When disabled (the default), only LAN traffic uses the tunnel and the client uses its own Internet connection for everything else (split tunnel).

1. A WireGuard configuration is generated.

### Viewing Client Configuration

After creating a client, the configuration can be viewed in two formats:

- **File** — Displays the configuration as text. Use the copy button to copy to clipboard, or the download button to save as a `.conf` file that WireGuard apps can import.
- **QR** — Displays the configuration as a QR code. Scan with the WireGuard mobile app to configure the client without manual entry.

> [!TIP]
> Save the configuration file to your password manager. If you lose it, you will need to remove the client and create a new one.

### Changing Client Routing

After creating a client, you can switch between routing modes from the actions menu on the client list:

- **All traffic** — Full tunnel. All Internet traffic routes through the VPN.
- **LAN only** — Split tunnel. Only local network traffic uses the tunnel.

### Renaming a Client

Select "Rename" from the client's actions menu to change its display name.

### Removing a Client

Select "Delete" from the client's actions menu. The client's WireGuard configuration is immediately invalidated.

## Connecting Remote Devices

Install WireGuard on the remote device and import the configuration file.

{{#tabs global="platform"}}

{{#tab name="Mac"}}

1. Install WireGuard from the [App Store](https://apps.apple.com/us/app/wireguard/id1451685025).

1. Open WireGuard, click "Import tunnel(s) from file", and select the config file.

1. MacOS will ask you to allow the VPN configuration. Click "Allow".

1. Activate the tunnel from the WireGuard app or from System Settings > VPN.

{{#endtab}}

{{#tab name="Windows"}}

1. Install WireGuard from the [official website](https://www.wireguard.com/install/).

1. Click "Import tunnel(s) from file" and select the config file.

1. Click "Activate" to connect.

{{#endtab}}

{{#tab name="iOS"}}

1. Install WireGuard from the [App Store](https://itunes.apple.com/us/app/wireguard/id1441195209?ls=1&mt=8).

1. Tap "Add a tunnel" and either scan the QR code or import the config file.

1. Allow the VPN configuration when prompted.

1. Toggle the tunnel on to connect.

{{#endtab}}

{{#tab name="Android / Graphene"}}

1. Install WireGuard from the [Play Store](https://play.google.com/store/apps/details?id=com.wireguard.android) or the [WireGuard website](https://www.wireguard.com/install/).

1. Tap the `+` button and either scan the QR code or import the config file.

1. Allow the VPN connection when prompted.

{{#endtab}}

{{#tab name="Linux"}}

1. Install WireGuard:
   - Debian / Ubuntu: `sudo apt update && sudo apt install wireguard`
   - Fedora / RHEL: `sudo dnf update && sudo dnf install wireguard-tools`
   - Arch / Manjaro: `sudo pacman -Syu && sudo pacman -S wireguard-tools wireguard`

1. Copy the config file:

   ```
   sudo cp myconfig.conf /etc/wireguard/wg0.conf
   sudo chmod 600 /etc/wireguard/wg0.conf
   ```

1. Connect:

   ```
   sudo wg-quick up wg0
   ```

1. Verify:

   ```
   sudo wg
   ```

1. (Optional) Enable on boot:

   ```
   sudo systemctl enable wg-quick@wg0
   ```

> [!TIP]
> To disconnect: `sudo wg-quick down wg0`

{{#endtab}}

{{#endtabs}}

## Removing a VPN Server

1. Navigate to `Points of Entry > Inbound VPNs` and select "Delete" from the server's actions menu.

> [!WARNING]
> Deleting a VPN server immediately disconnects all clients and invalidates their configuration files. Clients will need new config files if a new server is created.

## Example

| VPN Server | Profile | Endpoint | Use Case |
|------------|---------|----------|----------|
| Primary | Admin | DDNS domain | Your personal remote access to everything |
| Family | Shared Services | DDNS domain | Family members accessing the home server |
| Friends | Guest | DDNS domain | Friends using your Internet connection via VPN |
