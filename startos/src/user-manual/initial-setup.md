---
title: "Initial Setup"
description: "Complete your StartOS server's initial setup, including creating a password and downloading your Root CA."
section: "startos/user-manual"
type: "guide"
keywords: ["setup", "password", "root ca", "first boot"]
---

# Initial Setup

1. Connect your server to power and Ethernet.

1. From a computer connected to the same Local Area Network (LAN) as your server, open a browser and visit [http://start.local](http://start.local).

1. Select a setup option:
   - **Start fresh**: Select this option if you are setting up a new server.

   - **Restore from Backup**: Select this option _only_ if your existing StartOS data drive has been lost or corrupted. This is for disaster recovery only.

   - **Transfer**: Select this option if you are transferring your existing data from one drive to another.

1. Set a strong master password. _Make it good. Write it down_. Resetting your password is non-trivial, but your data will be preserved.

1. Following successful initialization, you will be prompted to download a `StartOS-info.html`. This file contains your server's permanent `.local` URL and Root Certificate Authority (Root CA). It is recommended to save this file for future reference.

1. Click "Continue to Login" and follow instructions for [Trusting your Root CA](./trust-ca.md)
