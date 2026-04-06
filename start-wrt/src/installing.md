# Installing StartWRT

StartWRT comes pre-installed on Start9 routers. If you need to reinstall or flash a new device, follow the instructions below to create a bootable microSD card and flash the firmware.

## Requirements

- A Start9 router (BananaPi BPI-F3)
- A microSD card (4 GB or larger)
- A computer to write the image

## Download the Image

1. Download the latest StartWRT firmware image from the [Start9 releases page](https://github.com/Start9Labs/start-wrt/releases).

1. Verify the SHA256 checksum against the one listed on GitHub (optional but recommended).
   - **Mac**. Open a terminal and run:

         openssl dgst -sha256 startwrt.img

   - **Linux**. Open a terminal and run:

         sha256sum startwrt.img

   - **Windows**. Open PowerShell and run:

         Get-FileHash startwrt.img

## Bake a Wi-Fi Password (bare devices only)

If you are flashing a bare BananaPi BPI-F3 that was not factory-provisioned by Start9, the image has no Wi-Fi password. You must bake one in before writing to microSD:

```
startwrt-bake-password startwrt.img <your-password>
```

This embeds the password directly into the image file. When the router boots, this password will be used for the default Wi-Fi network.
## Write the Image to microSD

1. Download and install [balenaEtcher](https://www.balena.io/etcher) onto your Linux, Mac, or Windows computer.

1. Insert the microSD card into your computer.

1. Open balenaEtcher, click "Select Image", and select the StartWRT image you just downloaded.

1. Click "Select Target" and select your microSD card.

   > [!WARNING]
   > BE ABSOLUTELY CERTAIN you have selected the correct target drive. Whatever target you select will be **COMPLETELY ERASED**!!

1. Click "Flash!". You may be asked to approve the unusually large disk target and/or enter your password. Both are normal.

## Flash the Firmware

1. Power off the router.

1. Insert the microSD card into the router.

1. Power on the router. It will boot from the microSD card automatically.

1. Connect to the `StartWRT` Wi-Fi network using your Wi-Fi password (the sticker password for factory devices, or the password you baked into the image).

1. A captive portal will open automatically. If it does not, open a browser and navigate to `router.lan`.

1. The setup wizard will prompt you to create a new admin password (minimum 12 characters). If the router already has firmware on the eMMC, you will also be given a choice:

   - **Keep Settings** — Replaces the firmware while preserving your existing configuration.
   - **Fresh Start** — Erases all router configuration and installs fresh firmware. The Wi-Fi password stored on eMMC is preserved — to change it, use `startwrt-bake-password` and reflash with the resulting image.

   On a new device with no existing firmware, the wizard skips this choice and proceeds directly to the password step.

1. When the wizard completes, power off the router, remove the microSD card, and power it back on.

## Recovering a Lost or Compromised Wi-Fi Password

If you have lost the Wi-Fi password on the sticker, or need to change a compromised password, use the [`startwrt-bake-password`](https://github.com/Start9Labs/start-wrt/tree/master/startwrt-bake-password) Python script from the start-wrt repository to create a recovery image:

1. Download the latest StartWRT firmware image from the [Start9 releases page](https://github.com/Start9Labs/start-wrt/releases).

1. Bake a new Wi-Fi password into the image:

   ```
   startwrt-bake-password startwrt.img <new-password>
   ```

1. Write the image to a microSD card using [balenaEtcher](#write-the-image-to-microsd).

1. Insert the microSD card into the router and boot. Follow the [Flash the Firmware](#flash-the-firmware) steps above, using your new password to connect to Wi-Fi.

The baked-in password permanently replaces the original sticker password on the router's eMMC.

## Next Steps

- [Initial Setup](initial-setup.md) — Set up your admin password and configure the router
