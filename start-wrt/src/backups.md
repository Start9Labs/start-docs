# Backups

Back up your router's configuration so you can restore it after an update, factory reset, or hardware failure. Backups capture your settings — security profiles, WiFi passwords, firewall rules, VPN configurations, SSH keys, and other customizations.

## Creating a Backup

1. Navigate to `System > Settings > Backup`.

1. Click "Create Backup".

1. A backup file will be downloaded to your computer.

Store the backup file in a safe location, such as a password manager or encrypted drive.

> [!TIP]
> Create a backup before performing firmware updates. While the Update path preserves settings, having a backup provides an extra safety net.

## Restoring a Backup

1. Navigate to `System > Settings > Backup`.

1. Click "Restore Backup".

1. Select the backup file from your computer.

1. Click "Restore".

The router will apply the configuration and restart.

> [!WARNING]
> Restoring a backup overwrites your current configuration entirely. Any changes made since the backup was created will be lost.

## What Is Included

| Included | Not Included |
|----------|--------------|
| Security Profiles | Admin password |
| WiFi passwords | System logs |
| Firewall rules | Device history |
| VPN server and client configs | Data usage counters |
| SSH keys | |
| DDNS settings | |
| LAN/WAN settings | |
| Router name, timezone, language | |

> [!NOTE]
> The admin password is never included in backups. After restoring, you will use the admin password you set during the restore process, not the one from the backup.
