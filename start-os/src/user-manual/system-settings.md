# System Settings

General system settings for your StartOS server. Navigate to `System > General Settings` in the StartOS dashboard.

## Software Update

View your current StartOS version and check for updates.

- If an update is available, click **Update** to begin the update process.
- After updating, click **Restart to apply** to reboot your server with the new version.
- If no update is available, click **Check for updates** to query the latest release.

## Server Name

Your server name is displayed along with its derived `.local` hostname. The hostname is created by lowercasing the server name, removing non-alphanumeric characters, and replacing spaces with hyphens. For example, "My Cool Server" becomes `my-cool-server.local`.

Click **Change** to open the server name dialog. After saving a new name, your `.local` address will update accordingly.

> [!WARNING]
> If you are currently connected via your `.local` address, changing the hostname will require you to switch to the new `.local` address. You will be prompted with the new address after saving.

## Language

Change the display language of the StartOS interface. Select a language from the dropdown to apply it immediately.

## Kiosk Mode

Kiosk Mode enables a display output for connecting a monitor directly to your server. This is useful for setup or troubleshooting without a separate client device.

- **Enable**: If no keyboard layout has been set, you will be prompted to select one first. A restart is required to apply the change.
- **Disable**: Click **Disable**, then restart when prompted.
- **Change Keyboard Layout**: When Kiosk Mode is enabled, your current keyboard layout is displayed. Click the edit icon to select a different layout.

> [!NOTE]
> Kiosk Mode may be unavailable on certain hardware.
