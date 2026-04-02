# Updating

StartWRT firmware updates are installed by booting from a microSD card. This ensures the update process is reliable and recoverable — if anything goes wrong, the router's existing firmware remains untouched until you explicitly choose to flash.

## Check for Updates

Navigate to `System > Settings` in the web interface. If a newer version is available, you will see a notification with the version number.

## Perform the Update

1. Download the latest StartWRT firmware image from the [Start9 releases page](https://github.com/Start9Labs/start-wrt/releases).

1. Write the image to a microSD card. See [Installing StartWRT](installing.md#write-the-image-to-microsd) for platform-specific instructions.

1. Power off the router.

1. Insert the microSD card and power the router back on.

1. Connect to the `StartWRT` WiFi network using your WiFi password.

1. The captive portal will open the setup wizard. Select **Update**.

1. Create a new admin password when prompted.

1. When the process completes, power off the router, remove the microSD card, and power it back on.

> [!NOTE]
> The Update path preserves your settings — security profiles, WiFi passwords, firewall rules, SSH keys, and other configuration. The admin password is always reset during an update as a security measure, since physical access to the microSD slot is sufficient authorization.

## What Gets Preserved

| Preserved | Not Preserved |
|-----------|---------------|
| Security Profiles | Admin password (re-created during update) |
| WiFi passwords and settings | User-installed package binaries |
| Firewall rules | |
| VPN configurations | |
| SSH keys | |
| Device names | |

> [!TIP]
> User-installed package config files are preserved even though the binaries are wiped. After updating, reinstall any additional packages and their previous configuration will still be in place.
