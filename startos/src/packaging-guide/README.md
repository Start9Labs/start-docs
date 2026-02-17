---
title: "Packaging Guide"
description: "Learn how to package self-hosted services for StartOS using the Start SDK."
section: "startos/packaging-guide"
type: "index"
keywords: ["packaging", "developer", "sdk", "services", "s9pk"]
---
# Packaging Guide

StartOS is a _Server OS_ -- a Linux distribution optimized for administering servers. While operating systems like Mac, Windows, and Ubuntu are designed for client devices such as phones and laptops, StartOS provides a graphical interface for server administration that eliminates the need to "pop the hood" and use the command line.

Through the StartOS web interface, users can discover, download, install, configure, monitor, back up, and generally manage any variety of self-hosted, open-source software.

## What is a StartOS Package?

What makes this experience possible is a unique package format (`.s9pk`) that permits services to take advantage of StartOS APIs. In its most basic form, a package is a thin metadata wrapper around a service that allows it to be discovered, installed, and run on StartOS. Beyond that, the StartOS APIs grant developers an incredible degree of creative capacity to define the end-user experience for their service. Developers can:

- Display instructions and tooltips
- Present alerts and warnings under certain conditions
- Run arbitrary code on install, update, and uninstall
- Represent configuration files as validated forms with all varieties of form inputs
- Define scripts and commands that present as buttons with optional inputs
- Write health checks that run on an interval and are optionally displayed
- Automatically install and configure dependencies
- Maintain state and optionally expose particular values to users or dependent services
- Grant users flexible networking options such as LAN, Tor, and clearnet
- Offer one-click, encrypted backups of targeted data

## Table of Contents

1. [Environment Setup](./environment-setup.md) - Install the required development tools
1. [Quick Start](./quick-start.md) - Create, build, and install your first package
1. [Project Structure](./project-structure.md) - Understand the file layout of a StartOS package
1. [Manifest](./manifest.md) - Define your service metadata, release notes, and alerts
1. [Versions](./versions.md) - Handle install, update, and downgrade logic
1. [Main](./main.md) - Configure daemons, health checks, and the service lifecycle
1. [Initialization](./init.md) - Run code when your service initializes
1. [Interfaces](./interfaces.md) - Expose network interfaces to users
1. [Actions](./actions.md) - Define user-facing buttons and scripts
1. [Tasks](./tasks.md) - Prompt users to run actions at the right time
1. [File Models](./file-models.md) - Represent and validate configuration files
1. [Dependencies](./dependencies.md) - Declare and configure service dependencies
1. [Makefile](./makefile.md) - Automate build and install workflows
1. [Writing READMEs](./writing-readmes.md) - Write effective service documentation
