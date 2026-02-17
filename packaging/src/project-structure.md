---
title: "Project Structure"
description: "Directory layout and file structure of a StartOS service package."
section: "packaging"
type: "guide"
keywords:
  [
    "project structure",
    "directory layout",
    "startos directory",
    "actions",
    "fileModels",
    "init",
    "install",
  ]
---

# Project Structure

## Root Directory Layout

A StartOS package follows this organizational pattern:

```
my-service-startos/
├── assets/                 # Supplementary files (required, can be empty)
│   └── README.md
├── startos/                # Primary development directory
│   ├── actions/            # User-facing action scripts
│   ├── fileModels/         # Type-safe config file representations
│   ├── i18n/               # Internationalization
│   │   ├── index.ts        # setupI18n() call (boilerplate)
│   │   └── dictionaries/
│   │       ├── default.ts  # English strings keyed by index
│   │       └── translations.ts  # Translations for other locales
│   ├── init/               # Container initialization logic
│   ├── install/            # Version management and migrations
│   │   └── versions/
│   ├── manifest/           # Static service metadata
│   │   ├── index.ts        # setupManifest() call
│   │   └── i18n.ts         # Static translations: manifest descriptions/alerts
│   ├── backups.ts          # Backup volumes and exclusions
│   ├── dependencies.ts     # Service dependencies
│   ├── index.ts            # Exports (boilerplate)
│   ├── interfaces.ts       # Network interface definitions
│   ├── main.ts             # Daemon runtime and health checks
│   ├── sdk.ts              # SDK initialization (boilerplate)
│   └── utils.ts            # Package-specific utilities
├── .gitignore
├── Dockerfile              # Optional - for custom images
├── icon.svg                # Service icon (max 40 KiB)
├── LICENSE                 # Package license (symlink to upstream)
├── Makefile                # Project config (includes s9pk.mk)
├── s9pk.mk                 # Shared build logic (boilerplate)
├── package.json
├── package-lock.json
├── README.md
├── tsconfig.json
└── upstream-project/       # Git submodule (optional)
```

## Core Files

### Boilerplate Files

These files typically require minimal modification:

- `.gitignore`
- `Makefile` - Just includes `s9pk.mk` (see [Makefile](./makefile.md))
- `s9pk.mk` - Shared build logic, copy from template without modification
- `package.json` / `package-lock.json`
- `tsconfig.json`

### Dockerfile (optional)

It is recommended to pull an existing Docker image as shown in the [Quick Start](./quick-start.md). If necessary, you can define a custom image using a Dockerfile in the project root.

### icon.svg

The service's visual identifier. Maximum size is 40 KiB. Accepts `.svg`, `.png`, `.jpg`, and `.webp` formats.

### LICENSE

The package's software license, which should always match the upstream service's license. If your package contains multiple upstream services with different licenses, select the more restrictive license. Create a symlink:

```bash
ln -sf upstream-project/LICENSE LICENSE
```

### README.md

Documentation template that should be customized for your specific service.

## assets/

Stores supplementary files and scripts needed by the service, such as configuration generators. **Required** -- create with at least a README.md if empty. It should rarely be necessary to use this directory.

## startos/

The `startos/` directory is where you take advantage of the StartOS SDK and APIs. This is the primary development directory containing all SDK integration files and package logic.

### Core TypeScript Modules

| File              | Purpose                                         |
| ----------------- | ----------------------------------------------- |
| `main.ts`         | Daemon runtime configuration and health checks  |
| `interfaces.ts`   | Network interface definitions and port bindings |
| `backups.ts`      | Backup volumes and exclusion patterns           |
| `dependencies.ts` | Service dependencies and version requirements   |
| `sdk.ts`          | SDK initialization (boilerplate)                |
| `utils.ts`        | Package-specific constants and helper functions |
| `index.ts`        | Module exports (boilerplate)                    |

#### backups.ts

`setupBackups()` is where you define what volumes to back up as well as what directories or files to _exclude_ from backups.

#### dependencies.ts

`setupDependencies()` is where you define any dependencies of this package, including their versions, whether or not they need to be running or simply installed, and which health checks, if any, need to be passing for this package to be satisfied.

#### index.ts

This file is plumbing, used for exporting package functions to StartOS.

#### interfaces.ts

`setupInterfaces()` is where you define the service interfaces and determine how they are exposed. This function executes on service install, update, and config save. It takes the user's config input as an argument, which will be `null` for install and update.

#### main.ts

`setupMain()` is where you define the daemons that compose your service's runtime. It runs each time the service is started. Daemon comes with built-in health checks that can optionally be displayed to the user. You can also use `setupMain()` to define additional health checks, such as tracking and displaying a sync percentage.

#### manifest/

The manifest directory defines static metadata about the service, such as ID, name, description, release notes, helpful links, volumes, images, hardware requirements, alerts, and dependencies. See [Manifest](./manifest.md) for details.

#### sdk.ts

This file is plumbing, used to imbue the generic Start SDK with package-specific type information defined in `manifest.ts` and `store.ts`. The exported SDK is what should be used throughout the `startos/` directory. It is a custom SDK just for this package.

#### utils.ts

This file is for defining constants and functions specific to your package that are used throughout the code base. Many packages will not make use of this file.

### Subdirectories

| Directory     | Purpose                                                               |
| ------------- | --------------------------------------------------------------------- |
| `actions/`    | Custom user-facing scripts displayed as buttons in the UI             |
| `fileModels/` | Type-safe representations of config files (.json, .yaml, .toml, etc.) |
| `i18n/`       | Internationalization: default dictionary and translated strings       |
| `init/`       | Container initialization logic (install, update, restart)             |
| `install/`    | Version management and migration logic                                |
| `manifest/`   | Service metadata (ID, name, description, images) with i18n            |

### actions/

```
actions/
├── index.ts
├── action1.ts
└── action2.ts
```

In the `actions/` directory, you define custom actions for your package.

Actions are predefined scripts that display as buttons to the user. They accept arbitrary input and return structured data that can be optionally displayed masked or as QR codes. For example, a `config.ts` action might present a validated form that represents an underlying config file of the service, allowing users to configure the service without needing SSH or the command line. A `resetPassword` action could use the upstream service's CLI to generate a new password for the primary admin, then display it to the user.

Each action receives its own file and is also passed into `Actions.of()` in `actions/index.ts`.

### fileModels/ (optional)

```
fileModels/
├── store.json.ts
└── config.json.ts
```

In the `fileModels/` directory, you can create separate `.ts` files from which you export a file model for each file from the file system you want to represent. Supported file formats are `.yaml`, `.toml`, `.json`, `.env`, `.ini`, `.txt`. For alternative file formats, you can use the `raw` method and provide custom serialization and parser functions.

These `.ts` files afford a convenient and type-safe way for your package to read, write, monitor, and react to files on the file system.

It is common for packages to have a `store.json.ts` file model as a convenient place to persist arbitrary data that are needed by the package but _not_ persisted by the upstream service. For example, you might use `store.json` to persist startup flags or login credentials.

### init/

```
init/
├── index.ts
├── customInitFn1.ts
└── customInitFn2.ts
```

In the `init/` directory, you define the container initialization sequence for your package as well as optional custom init functions.

Container initialization takes place under the following circumstances:

1. Package install (including fresh install, update, downgrade, and restore)
2. _Server_ (not service) restart
3. "Container Rebuild" (a built-in Action that must be manually triggered by the user)

> [!NOTE]
> Starting or restarting a service _does not_ trigger container initialization. Even if a service is stopped, the container still exists with event listeners still active.

#### init/index.ts

`setupInit()` is where you define the specific order in which functions will be executed when your container initializes.

- `restoreInit` and `versionGraph` must remain first and second. Do not move them.
- `setInterfaces`, `setDependencies`, `actions` are recommended to remain in this order, but could be rearranged if necessary.
- Any custom init functions can be appended to the list of built-in functions, or even inserted between them. Most custom init functions are simply appended to the list.

It is possible to limit the execution of custom init functions to specific _kinds_ of initialization. For example, if you only wanted to run a particular init function on fresh install and ignore it for updates and restores, `setupOnInit()` provides a `kind` variable (one of `install`, `update`, `restore`) that you can use for conditional logic. `kind` can also be null, which means the container is being initialized due to a server restart or manual container rebuild, rather than installation.

### install/

```
install/
├── versions/
└── versionGraph.ts
```

In the `install/` directory, you manage package versions and define pre-install and migration logic. See [Versions](./versions.md) for full details.

#### versionGraph.ts

`VersionGraph.of()` is where you index the current version as well as other versions of your package. The function accepts a `preInstall` argument where you can define custom logic to run once, before anything else, _on initial installation only_. A common use case of the preInstall function is to seed files that other init functions expect to exist.

#### versions/

```
versions/
├── index.ts
├── v1_0_3_2.ts
└── v1_0_2_0.ts
```

In the `versions/` directory, you create a new file for each new package version. In each version file, use `VersionInfo.of()` to provide the version number, release notes, and any migrations that should run.

Similar to `preInstall`, migration `up` and `down` functions run once, before anything else, _upon updating or downgrading to that version only_.

All versions should then be provided in `index.ts`, either as the current version or list of other versions.

> [!WARNING]
> Migrations are only for migrating data that is _not_ migrated by the upstream service itself.
