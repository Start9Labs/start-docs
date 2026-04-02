# CLI Reference

The StartWRT router includes a CLI accessible over [SSH](ssh.md). The `startwrt` binary provides subcommands for manufacturing, firmware management, and diagnostics. Day-to-day router configuration is done through the [web interface](initial-setup.md#explore-the-web-interface) — the CLI is for advanced operations and recovery scenarios.

## startwrt init

Provision the WiFi password during manufacturing. This is a local-only command run via serial console at the factory.

```
startwrt init
```

Prompts for the 12-character WiFi password (from the device sticker), validates the character set, and writes it to the eMMC `/key_backup` partition and the WiFi configuration.

> [!NOTE]
> This command is only available when booted from microSD and no WiFi password exists on the eMMC. It is not used during normal operation.

## startwrt flash

Flash firmware from a microSD image to the router's internal eMMC storage.

```
startwrt flash
```

Used during manufacturing and the reflash wizard. Writes kernel, root filesystem, and overlay partitions to eMMC.

## startwrt manufacture

Run the full manufacturing flow (flash + init) in sequence.

```
startwrt manufacture
```

## startwrt verify

Verify the integrity of the installed firmware.

```
startwrt verify
```

## startwrt has-baked-password

Check whether the current boot image has a custom WiFi password baked in.

```
startwrt has-baked-password
```

Returns exit code 0 if a baked-in password is present, non-zero otherwise.

## startwrt-bake-password

A separate Python utility (not part of the main `startwrt` binary) that embeds a custom WiFi password into a StartWRT firmware image. Use this if you have lost the original sticker password and need to create a recovery image.

```
startwrt-bake-password <image-file> <new-password>
```

The resulting image can be written to a microSD card and used to reflash the router. The baked-in password replaces the original sticker password permanently.

> [!WARNING]
> After flashing with a custom image, the original sticker password no longer works. The password you baked in becomes the new WiFi password. Update the sticker or store the new password securely.
