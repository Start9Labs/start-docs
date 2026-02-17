---
title: "Restoring Backups"
description: "Restore your StartOS server or individual services from an encrypted backup."
section: "startos/user-manual"
type: "guide"
keywords: ["restore", "backup", "recovery", "data"]
---
# Restoring Backups

## Restoring Individual Services

This option should only be necessary if you accidentally uninstall a service.

1.  Go to `System -> Restore from Backup`
1.  Select your backup drive.
1.  Decrypt the backup drive by entering the password that was used to create it.
1.  Select the service(s) you want to restore and click "Restore Selected".

> [!TIP]
> If you're restoring a backup taken from a different system architecture (x86, ARM, RISC-V) to the one you're restoring to, you may need to _reinstall_ services (not uninstall, since you will lose your data) from the marketplace after the restore completes to avoid running them more slowly in emulation.

## Restoring an Entire Server

If your StartOS data drive is lost or corrupted and you need to restore your entire server, follow instructions [here](./initial-setup.md#recover-options).
