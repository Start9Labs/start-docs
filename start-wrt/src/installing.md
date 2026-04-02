# Installing StartWRT

StartWRT comes pre-installed on Start9 routers. If you need to reinstall or flash a new device, follow the instructions below to create a bootable microSD card and flash the firmware.

## Requirements

- A Start9 router (BananaPi BPI-F3)
- A microSD card (4 GB or larger)
- A computer to write the image

## Download the Image

Download the latest StartWRT firmware image from the [Start9 releases page](https://github.com/Start9Labs/start-wrt/releases).

## Write the Image to microSD

{{#tabs global="platform"}}

{{#tab name="Mac"}}

1. Insert the microSD card into your computer.

1. Open the Terminal app and identify the disk:

   ```
   diskutil list
   ```

   Find your microSD card (e.g. `/dev/disk4`). Be absolutely sure you have the correct disk.

1. Unmount the disk:

   ```
   diskutil unmountDisk /dev/disk4
   ```

1. Write the image:

   ```
   sudo dd if=startwrt.img of=/dev/rdisk4 bs=1m
   ```

   Replace `startwrt.img` with the path to the downloaded file and `/dev/rdisk4` with your disk (note the `r` prefix for raw device, which is faster).

1. Eject the card:

   ```
   diskutil eject /dev/disk4
   ```

{{#endtab}}

{{#tab name="Windows"}}

1. Download and install [balenaEtcher](https://etcher.balena.io/).

1. Insert the microSD card into your computer.

1. Open balenaEtcher, select the downloaded StartWRT image, select your microSD card, and click "Flash".

1. When complete, safely eject the microSD card.

{{#endtab}}

{{#tab name="Linux"}}

1. Insert the microSD card into your computer.

1. Identify the device:

   ```
   lsblk
   ```

   Find your microSD card (e.g. `/dev/sdb`). Be absolutely sure you have the correct device.

1. Unmount any mounted partitions:

   ```
   sudo umount /dev/sdb*
   ```

1. Write the image:

   ```
   sudo dd if=startwrt.img of=/dev/sdb bs=1M status=progress
   ```

   Replace `startwrt.img` with the path to the downloaded file and `/dev/sdb` with your device.

1. Sync and remove the card:

   ```
   sync
   ```

{{#endtab}}

{{#endtabs}}

## Flash the Firmware

1. Power off the router.

1. Insert the microSD card into the router.

1. Power on the router. It will boot from the microSD card automatically.

1. Connect to the `StartWRT` WiFi network using the password printed on the sticker on the bottom of the device.

1. A captive portal will open automatically. If it does not, open a browser and navigate to any URL — you will be redirected to the setup wizard.

1. Choose one of the following:

   - **Update** — Replaces the firmware while preserving your settings. You will be prompted to create a new admin password.
   - **Fresh Start** — Wipes everything and installs a clean copy of StartWRT. You will be prompted to select a language, country, and drive, then create a new admin password.

1. When the wizard completes, power off the router, remove the microSD card, and power it back on.

> [!TIP]
> If you have lost the WiFi password on the sticker, you can build a custom image with a new password baked in using the `startwrt-bake-password` tool. See the [CLI Reference](cli-reference.md) for details.

## Next Steps

- [Initial Setup](initial-setup.md) — Set up your admin password and configure the router
