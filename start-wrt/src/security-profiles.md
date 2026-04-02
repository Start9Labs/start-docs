# Security Profiles

Security Profiles are the core concept in StartWRT. Every device on the network is assigned a Security Profile that governs what it can access — LAN devices, the Internet, DNS servers, VPN tunnels, and time-of-day restrictions. Profiles replace the need to manually configure VLANs, firewall zones, subnets, and routing tables.

## How Profiles Work

Behind the scenes, each Security Profile creates an isolated network environment:

- **VLAN** — Layer 2 isolation so devices on different profiles cannot see each other's traffic
- **Subnet** — A dedicated `/24` IP range with its own DHCP server and gateway
- **Firewall zone** — Rules controlling what the profile can access (LAN, Internet, specific devices)
- **DNS** — Inherited from the system, the outbound VPN, or overridden with custom servers
- **Outbound routing** — Which gateway or VPN chain handles the profile's Internet traffic
- **Schedule** — Optional time-of-day restrictions on Internet access

You do not need to configure any of these individually. When you create a profile, StartWRT sets up all the underlying networking automatically.

## How Devices Get Profiles

A device's Security Profile is determined by its **point of entry** — how it connects to the network:

- **Ethernet** — The physical port a device plugs into. Each port maps to a profile. See [Ethernet](ethernet.md).
- **WiFi** — The password a device uses to join the WiFi network. Each password maps to a profile. See [Wi-Fi](wifi.md).
- **Inbound VPN** — The WireGuard server a device connects to remotely. Each VPN server maps to a profile. See [Inbound VPNs](inbound-vpn.md).

One SSID, multiple passwords. One router, multiple isolated networks. The profile abstraction keeps it simple.

## Creating a Profile

1. Navigate to `Security Profiles` and click "Add".

1. Configure the profile:

   - **Name** — A descriptive name (e.g. "Admin", "Guest", "Children", "Smart Devices").

   - **Subnet** — The third octet of the profile's `/24` subnet. For example, a value of `2` creates the subnet `192.168.2.0/24`. Each profile must have a unique subnet. The gateway address is always `.1` within the subnet (e.g. `192.168.2.1`).

   - **Outbound Routing** — Choose how traffic from this profile reaches the Internet. Select **WAN** for direct Internet access, or choose an [Outbound VPN](outbound-vpn.md) to route all traffic through that VPN.

   - **Custom DNS** — Override the DNS servers for this profile. When enabled, specify up to three DNS servers (Primary required, Secondary and Tertiary optional). Each server has a **Secure (DoH)** toggle for DNS-over-HTTPS encryption. When Custom DNS is off, the profile uses the outbound VPN's DNS (if routing through a VPN) or the system DNS from [WAN Settings](wan.md).

   - **LAN Access** — Controls which other profiles this profile can communicate with on the local network:
     - **All** — Full access to devices on all profiles.
     - **Same profile** — Only communicate with devices on this same profile.
     - **Whitelist** — Select specific profiles from a list.

   - **Auto whitelist new profiles** — Shown only in Whitelist mode. When enabled, newly created profiles are automatically added to this profile's whitelist. Useful for admin profiles that should maintain access to all network segments.

   - **WAN Access** — Controls Internet access for devices on this profile:
     - **Allow All** — Unrestricted Internet access.
     - **Block All** — No Internet access. Devices can only reach LAN resources permitted by the LAN Access setting.
     - **Whitelist** — Allow connections only to specific destination IPs or CIDR ranges (e.g. `1.1.1.1, 8.8.8.0/24`).
     - **Blacklist** — Block connections to specific destination IPs or CIDR ranges, allow everything else.

1. Click "Save".

## Editing a Profile

1. Navigate to `Security Profiles` and select the profile.

1. Modify any settings and click "Save".

> [!WARNING]
> Changing a profile's settings takes effect immediately for all devices currently assigned to that profile.

## Deleting a Profile

1. Navigate to `Security Profiles` and select the profile.

1. Click "Delete".

> [!WARNING]
> Deleting a profile disconnects all devices assigned to it. You must first remove or reassign all points of entry (Ethernet ports, WiFi passwords, VPN servers) that reference the profile.

> [!NOTE]
> The primary LAN profile cannot be deleted.

## WAN Schedules

Each profile can optionally restrict Internet access during specific time periods. Schedules define **block windows** — periods when WAN access is disabled for devices on the profile. Outside of these windows, the profile's normal WAN access rules apply.

1. Navigate to `Security Profiles`, select the profile, and click "WAN Schedule" from the actions menu.

1. The schedule is displayed as a 7-day visual timeline grid, with one row per day of the week.

1. Click "Add" to create a block window:

   - Set the **start** and **end** times. Times use quarter-hour granularity (15-minute increments). End time must be later than start time.
   - Select which **days** of the week the window applies to.
   - Click "Save".

1. Multiple block windows per day are supported.

> [!TIP]
> Double-click an existing window to edit or delete it. Drag windows to adjust their position on the timeline.

> [!NOTE]
> WAN Schedules block Internet access, not LAN access. Devices can still reach LAN resources during blocked periods according to the profile's LAN Access setting.

## Example Profiles

Here is an example of how a household might use Security Profiles:

| Profile | WAN Access | LAN Access | DNS | Outbound Gateway | Schedule |
|---------|------------|------------|-----|-------------------|----------|
| **Admin** | Allow All | All | System | Mullvad VPN | — |
| **Children** | Allow All | Same profile | Custom (filtering) | DNS-filtering VPN | Block 9 PM - 7 AM |
| **Guest** | Allow All | Same profile | System | Proton VPN | — |
| **Smart Devices** | Whitelist | Same profile | System | WAN | — |
| **Shared Services** | Block All | Whitelist | System | — | — |
