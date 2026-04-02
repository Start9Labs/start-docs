# Devices

The Devices page shows all devices that have connected to your router, organized into Online (currently connected) and Offline (previously seen) groups. Each device is associated with a [Security Profile](security-profiles.md) based on its [point of entry](points-of-entry.md).

## Viewing Devices

Navigate to `Network > Devices` to see the device list. Each entry shows:

- **Name** — The device's hostname or a custom name you have assigned. Click to open the device detail page.
- **Connection** — How the device connects: Ethernet, Wi-Fi 2.4 GHz, Wi-Fi 5 GHz, or VPN.
- **MAC address** — The device's unique hardware identifier.
- **IP address** — The device's IPv4 and IPv6 addresses. A lock icon indicates a reserved (static) IP address.
- **Data and Speed** — Cumulative data usage and real-time upload/download speed for online devices.

## Device Detail Page

Click a device name to open its detail page:

- **Summary** — Displays the device's current status (online/offline), connection type, [Security Profile](security-profiles.md), IPv4 and IPv6 addresses, and real-time upload/download speed.

- **Data Usage** — A chart showing historical upload and download over time. Use the dropdown to select a time period: Last 24 Hours, Last Week, Last 30 Days, or Last 3 Months.

- **Name** — Edit the custom display name for this device. If left empty, the device's hostname is used.

- **Reserved IP** — Toggle on to assign a fixed IPv4 address that persists across reboots. Enter the desired IP address within the device's profile subnet. Useful for servers, printers, NAS devices, or any device that needs a consistent address.

- **Forget** — Remove an offline device from the list. Custom name and reserved IP settings are lost. If the device reconnects, it will appear as a new entry.

> [!TIP]
> Reserve an IP for any device you plan to use with [Published Ports](published-ports.md). Port forwarding rules require a stable IP address to ensure traffic always reaches the correct device.

> [!NOTE]
> Forgetting a device only removes it from the list. If the device reconnects, it will reappear.
