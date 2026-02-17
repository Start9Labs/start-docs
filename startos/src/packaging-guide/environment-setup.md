---
title: "Environment Setup"
description: "Install the required development tools for building StartOS service packages."
section: "startos/packaging-guide"
type: "guide"
keywords: ["development", "setup", "docker", "nodejs", "start-cli", "squashfs"]
---
# Environment Setup

## StartOS Device

You must have a computer running StartOS to test your packages. Follow the [installation guide](../installing.md) to install StartOS on a physical device or VM.

## Docker

[Docker](https://docs.docker.com/get-docker/) is essential for building and managing container images that will be used for the final `.s9pk` build. It handles pulling base images and building custom container images from Dockerfiles.

Follow the [official Docker installation guide](https://docs.docker.com/engine/install/) for your platform.

## Make

[Make](https://www.gnu.org/software/make/) is a build automation tool used to execute build scripts defined in Makefiles and coordinate the packaging workflow (building and installing s9pk binaries to StartOS).

**Linux (Debian-based)**:

```sh
sudo apt install build-essential
```

**macOS**:

```sh
xcode-select --install
```

## Node.js v22 (Latest LTS)

[Node.js](https://nodejs.org/en/) is required for compiling TypeScript code used in StartOS package configurations.

The recommended installation method is [nvm](https://github.com/nvm-sh/nvm):

```sh
nvm install 22
nvm use 22
```

You can also download Node.js directly from [nodejs.org](https://nodejs.org/).

## SquashFS

SquashFS is used to create compressed filesystem images that package your compiled service code.

**Linux (Debian-based)**:

```sh
sudo apt install squashfs-tools squashfs-tools-ng
```

**macOS** (requires [Homebrew](https://brew.sh/)):

```sh
brew install squashfs
```

## Start CLI

[start-cli](https://github.com/Start9Labs/start-cli/) is the core development toolkit for building StartOS packages. It provides package validation, s9pk file creation, and development workflow management.

Install using the automated installer script:

```sh
curl -fsSL https://start9labs.github.io/start-cli/install.sh | sh
```

## Verification

After installation, verify all tools are available:

```sh
docker --version
make --version
node --version
mksquashfs -version
start-cli --version
```

> [!TIP]
> If any command is not found, revisit the installation steps for that tool and ensure it is on your system PATH.
