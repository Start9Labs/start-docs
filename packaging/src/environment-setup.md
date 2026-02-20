# Environment Setup

Before building service packages, you need to install several development tools on your workstation. This page lists each prerequisite and how to install it.

## StartOS Device

You must have a computer running StartOS to test your packages. Follow the [installation guide](/start-os/installing.html) to install StartOS on a physical device or VM.

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

## Coding with Claude (Recommended)

AI coding tools like [Claude Code](https://docs.anthropic.com/en/docs/claude-code) can dramatically accelerate your packaging workflow. To get the best results, set up a workspace that gives Claude direct access to the packaging guide.

### 1. Create a workspace directory

Create a directory that will serve as your AI-assisted workspace. This is **not** inside your package repo — it sits alongside it.

```
mkdir my-workspace && cd my-workspace
```

### 2. Clone the docs

Clone the Start9 docs repo so Claude can read the packaging guide locally:

```
git clone https://github.com/Start9Labs/docs.git start-docs
```

### 3. Add a CLAUDE.md

> [!IMPORTANT]
> This is critical. Without this file, Claude will not know how to package a service for StartOS.

Download the provided `CLAUDE.md` and place it in your workspace root:

<a href="SAMPLE-CLAUDE.txt" download="CLAUDE.md" style="display:inline-block;padding:0.5em 1.2em;background:#58a6ff;color:#fff;border-radius:6px;text-decoration:none;font-weight:600">Download CLAUDE.md</a>

This file instructs Claude to use the local packaging guide as its primary reference.

### 4. Add your package repo

Clone or create your package repo inside the workspace:

```
git clone https://github.com/user/my-service-startos.git
```

Your workspace should look like this:

```
my-workspace/
├── CLAUDE.md            ← AI instructions (not committed anywhere)
├── start-docs/          ← packaging guide for Claude to read
└── my-service-startos/  ← your package repo
```

> [!NOTE]
> Do not put `start-docs/` or `CLAUDE.md` inside your package repo. They live alongside it in the workspace so they don't pollute your package's git history.
