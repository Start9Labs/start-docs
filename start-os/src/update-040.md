# Update to StartOS 0.4.0

StartOS 0.4.0 is a completely new operating system. It will eventually be available as a normal over-the-air update, but for early access it requires a USB flash install. This guide walks you through the process step by step.

> [!WARNING]
> This is early-access software. Bugs are still possible. Follow every step carefully — skipping the service update or backup steps can result in **permanent data loss**.

## Before You Begin

StartOS 0.4.0 is currently in alpha. The latest release is **0.4.0-alpha.21**, available on the [GitHub releases page](https://github.com/Start9Labs/start-os/releases/tag/v0.4.0-alpha.21).

## Step 1: Update to StartOS 0.3.5.1

You must be running **StartOS 0.3.5.1** before updating to 0.4.0. If you are on an older version, update to 0.3.5.1 first using the normal [update mechanism](updating-startos.md).

## Step 2: Update All Services

On StartOS 0.3.5.1, update **all installed services** to their latest available versions.

> [!WARNING]
> This step is **required**. If you do not update services before migrating, they may fail to migrate on 0.4.0, potentially requiring you to roll back to 0.3.5.1 or lose data entirely.

The one exception is **Bitcoin**, which can safely remain at version 28.x or 29.x. All other services must be on their latest version.

## Step 3: Create a Full System Backup

After updating your services, create a [full system backup](backup-create.md). Back up every service.

> [!WARNING]
> Do **not** skip this step. Migration failures are a real possibility during alpha, and without a backup your data could be lost permanently.

## Step 4: Flash the USB Drive

Download the 0.4.0-alpha.21 ISO for your platform from the [GitHub releases page](https://github.com/Start9Labs/start-os/releases/tag/v0.4.0-alpha.21). Under "ISO Downloads" at the top of the release notes, select the ISO for your hardware:

- **Server One (2023)** or other x86_64 hardware — download the **x86_64 (AMD64)** ISO
- **Server Pure** — download the **x86_64 (AMD64) Slim (FOSS-only)** ISO
- **Raspberry Pi** — not yet available for 0.4.0, but support is coming soon

Flash the ISO to a USB drive following the [Download](installing-startos.md#download) and [Flash](installing-startos.md#flash) sections of the install guide.

## Step 5: Stop All Services

Return to your running StartOS server and stop all services. Wait for each service to fully stop before proceeding.

## Step 6: Shut Down the Server

Shut down the server through the StartOS UI.

## Step 7: Boot from USB

1. Insert the flashed USB drive into your server.

1. Power on the server.

1. The installer should boot from the USB drive and become available at `http://start.local`.

> [!TIP]
> If the server boots into your existing StartOS instead of the installer, you may need to enter your BIOS settings and change the boot order to prioritize USB. This should not be necessary on Start9 hardware, but may be needed on third-party devices.

## Step 8: Run the Installer

1. Select your language.

1. Select your keyboard layout (if using kiosk mode).

1. Select the **OS drive** and the **data drive**. These can be the same drive if your server only has one. Double-check that you have selected the correct drive for each.

1. When prompted, select **Preserve** to keep your existing data.

   > [!WARNING]
   > If you do not select "Preserve", all data on the drive will be erased.

1. Optionally set a new password, or skip to keep your current password.

## Step 9: Wait

The migration process can take **hours**, depending on how much data you have. Be patient and do not power off or unplug your server.

## Step 10: Reboot

When the update is complete, follow the on-screen instructions to remove the USB drive and reboot.

## Step 11: Update All Services

Every installed service will have an update available for the 0.4.0 marketplace. Update **all** of them — including Bitcoin — before doing anything else. The 0.4.0 versions are repackaged for the new system, even if the underlying software version is the same.

## Step 12: Create a Fresh Backup

Before starting any services, create a [full system backup](backup-create.md) to a **fresh drive**.

> [!WARNING]
> Backups from StartOS 0.3.5.1 **cannot** be restored onto 0.4.0. You need a 0.4.0 backup. This is your safety net going forward — do not skip it.

## Step 13: Start Your Services

Once all services are updated and backed up, you can start them.

## Post-Migration Notes

### Tor Cleanup

During migration, the **Tor** service is automatically installed with all your existing onion addresses intact. However, Tor is rarely needed in StartOS 0.4.0 — most users will be better served by [LAN](lan.md), [VPN](inbound-vpn.md), [clearnet](clearnet.md), or [Holesail](holesail.md) access.

You are encouraged to review your service interfaces and delete any Tor addresses you no longer need. To manage onion addresses, open the Tor service and go to **Actions > Manage Onion Services**.

### Explore the New System

Take time to explore the new UI and read the documentation. StartOS 0.4.0 is a fundamentally different system from 0.3.x. The docs include a support chat where you can get help using your support access code.
