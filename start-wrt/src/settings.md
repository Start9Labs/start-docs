# Settings

The Settings page contains system preferences, account management, and advanced tools. Navigate to `System > Settings`. The page is organized into tabs: General, Password, SSH Keys, Backup, Logs, Activity, and Advanced. See also [SSH Access](ssh.md) and [Backups](backups.md) for dedicated documentation on those tabs.

## General

### Preferences

- **Theme** — System, Dark, or Light. System follows your browser or OS preference.
- **Language** — Select the language for the web interface.
- **Timezone** — Set the router's local timezone. This affects [WAN Schedules](security-profiles.md#wan-schedules), [WiFi Schedules](wifi-schedules.md), activity timestamps, and log timestamps.

### Remote Access

Controls whether the web interface is accessible from outside the local network.

- **When behind NAT** (default) — Allows remote access only when the router is behind NAT (typical home network with a private IP). This is the recommended setting for most users.
- **Never** — Disables remote access entirely. The admin interface is only accessible from devices on the local network.
- **Always** — Enables remote access at all times, even with a public IP.

> [!WARNING]
> Selecting "Always" exposes your router's admin interface to the Internet. Only use this if you understand the security implications and have a strong admin password.

### Security

- **Download Root CA** — Download the router's Root CA certificate. Installing this certificate on your devices allows browsers and apps to trust the router's HTTPS connections without security warnings.

### Updates

When a firmware update is available, a banner appears at the top of the General page showing the new version number. Expand the banner to view release notes before updating. See [Updating](updating.md) for the full update procedure.

## Password

Change your admin password. The admin password protects the web interface and is separate from the WiFi password.

1. Navigate to `System > Settings > Password`.

1. Enter your current password.

1. Enter and confirm your new password (minimum 12 characters).

1. Click "Save".

## Logs

View real-time system logs streamed from the router via WebSocket. Useful for diagnosing network issues, monitoring VPN connections, or verifying firewall behavior.

Navigate to `System > Settings > Logs` to open the live log viewer. You can download the full log as a text file or scroll to the bottom to follow new entries in real time.

## Activity

View a log of administrative actions taken through the web interface. Each entry shows:

- **Status icon** — Green check for successful actions, red X for failures.
- **Timestamp** — When the action occurred.
- **Summary** — A description of the action performed.
- **Error details** — If the action failed, the error message is shown below the summary.

Individual entries can be deleted, or click "Clear All" to remove the entire log. The list is paginated with 10 entries per page.

## Advanced

The Advanced tab contains power-user tools:

- **Launch LuCI Interface** — Opens the underlying OpenWrt LuCI admin panel in a new tab for direct access to low-level configuration.
- **Download Support Diagnostics** — Generates and downloads a diagnostic bundle for troubleshooting with Start9 support.
- **Factory Reset** — Erases all settings and reboots the router. See [Factory Reset](factory-reset.md) for details.

> [!WARNING]
> Factory reset is irreversible. Create a [backup](backups.md) first if you want to preserve your configuration.
