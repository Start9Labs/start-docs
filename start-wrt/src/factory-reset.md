# Factory Reset

A factory reset restores StartWRT to its default state at unboxing. There are two ways to reset: from the web interface (soft reset) or from a microSD card (reflash).

## Soft Reset (Web Interface)

A soft reset erases the overlay filesystem where all configuration changes are stored, then reboots the router. The base firmware (read-only squashfs) is untouched — only your customizations are removed. The Wi-Fi sticker password persists because it is stored separately on eMMC.

1. Navigate to `System > Settings`.

1. Click "Factory Reset".

1. Confirm the action.

The router will reboot. After reboot:

- Wi-Fi works immediately using the original sticker password (restored from the router's onboard eMMC).
- The admin password is cleared — you will be prompted to create a new one via the captive portal.
- All settings (security profiles, VPN configs, firewall rules, SSH keys, etc) are wiped.

> [!WARNING]
> A factory reset cannot be undone. Create a [backup](backups.md) first if you want to preserve your settings.

## Reflash (microSD)

A microSD reflash replaces the firmware entirely and offers two options:

- **Keep Settings** — Installs new firmware while preserving settings. See [Updating](updating.md).
- **Fresh Start** — Wipes everything and installs a clean copy of StartWRT. Equivalent to a factory reset plus a firmware reinstall.

See [Installing StartWRT](installing.md) for instructions on creating a bootable microSD card.

## What Gets Wiped

| Soft Reset | Fresh Start (microSD) |
|------------|----------------------|
| All settings and customizations | All settings and customizations |
| Admin password | Admin password |
| Firmware unchanged | Firmware replaced |
| Wi-Fi password preserved (from eMMC) | Wi-Fi password preserved (from eMMC, or replaced if using a custom image) |

## Lost Wi-Fi Password

If you have lost the Wi-Fi password printed on your router's sticker, you can create a custom firmware image with a new Wi-Fi password baked in. See [Installing StartWRT](installing.md#recovering-a-lost-or-compromised-wifi-password) for the full procedure.
