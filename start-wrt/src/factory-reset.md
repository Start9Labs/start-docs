# Factory Reset

A factory reset restores StartWRT to its default state. There are two ways to reset: from the web interface (soft reset) or from a microSD card (reflash).

## Soft Reset (Web Interface)

A soft reset wipes the configuration overlay and reboots the router. The firmware itself is not reinstalled.

1. Navigate to `System > Settings`.

1. Click "Factory Reset".

1. Confirm the action.

The router will reboot. After reboot:

- WiFi works immediately using the original sticker password (restored from the router's internal storage).
- The admin password is cleared — you will be prompted to create a new one via the captive portal.
- All settings (security profiles, VPN configs, firewall rules, SSH keys) are wiped.

> [!IMPORTANT]
> A factory reset cannot be undone. Create a [backup](backups.md) first if you want to preserve your settings.

## Reflash (microSD)

A microSD reflash replaces the firmware entirely and offers two options:

- **Update** — Installs new firmware while preserving settings. See [Updating](updating.md).
- **Fresh Start** — Wipes everything and installs a clean copy of StartWRT. Equivalent to a factory reset plus a firmware reinstall.

See [Installing StartWRT](installing.md) for instructions on creating a bootable microSD card.

## What Gets Wiped

| Soft Reset | Fresh Start (microSD) |
|------------|----------------------|
| All settings and customizations | All settings and customizations |
| Admin password | Admin password |
| Firmware unchanged | Firmware replaced |
| WiFi password preserved (from eMMC) | WiFi password preserved (from eMMC, or replaced if using a custom image) |

## Lost WiFi Password

If you have lost the WiFi password printed on your router's sticker, you can create a custom firmware image with a new WiFi password baked in. Use the `startwrt-bake-password` tool to embed a new password, then reflash with the custom image. The baked-in password permanently replaces the original sticker password. See the [CLI Reference](cli-reference.md) for details.
