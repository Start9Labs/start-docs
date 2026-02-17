---
title: "Manifest"
description: "How to define service identity, metadata, and build configuration in the manifest."
section: "startos/packaging-guide"
type: "guide"
keywords: ["manifest", "setupManifest", "images", "Docker", "alerts", "dependencies", "volumes", "i18n"]
---
# Manifest

The manifest defines service identity, metadata, and build configuration. It lives in `startos/manifest/` as two files:

- `index.ts` -- the `setupManifest()` call
- `i18n.ts` -- translated strings for `description` and `alerts`

## manifest/i18n.ts

Locale objects for user-facing manifest strings. Each is a record of locale to string:

```typescript
export const short = {
  en_US: 'Brief description (one line)',
  es_ES: 'Descripcion breve (una linea)',
  de_DE: 'Kurze Beschreibung (eine Zeile)',
  pl_PL: 'Krotki opis (jedna linia)',
  fr_FR: 'Description breve (une ligne)',
}

export const long = {
  en_US:
    'Longer description explaining what the service does and its key features.',
  es_ES:
    'Descripcion mas larga que explica que hace el servicio y sus caracteristicas principales.',
  de_DE:
    'Langere Beschreibung, die erklart, was der Dienst tut und seine wichtigsten Funktionen.',
  pl_PL:
    'Dluzszy opis wyjasniajacy, co robi usluga i jej kluczowe funkcje.',
  fr_FR:
    'Description plus longue expliquant ce que fait le service et ses fonctionnalites principales.',
}

// Export alertInstall, alertUpdate, etc. as needed (or null for no alert)
```

## manifest/index.ts

```typescript
import { setupManifest } from '@start9labs/start-sdk'
import { short, long } from './i18n'

export const manifest = setupManifest({
  id: 'my-service',
  title: 'My Service',
  license: 'MIT',
  wrapperRepo: 'https://github.com/Start9Labs/my-service-startos',
  upstreamRepo: 'https://github.com/original/my-service',
  supportSite: 'https://docs.example.com/',
  marketingSite: 'https://example.com/',
  donationUrl: null,
  docsUrl: 'https://docs.example.com/guides',
  description: { short, long },
  volumes: ['main'],
  images: {
    /* see Images Configuration below */
  },
  alerts: {
    install: null,
    update: null,
    uninstall: null,
    restore: null,
    start: null,
    stop: null,
  },
  dependencies: {},
})
```

## Required Fields

| Field               | Description                                            |
| ------------------- | ------------------------------------------------------ |
| `id`                | Unique identifier (lowercase, hyphens allowed)         |
| `title`             | Display name shown in UI                               |
| `license`           | SPDX identifier (`MIT`, `Apache-2.0`, `GPL-3.0`, etc.) |
| `wrapperRepo`       | URL to the StartOS wrapper repository                  |
| `upstreamRepo`      | URL to the original project repository                 |
| `supportSite`       | URL for user support                                   |
| `marketingSite`     | URL for the project's main website                     |
| `donationUrl`       | Donation URL or `null`                                 |
| `docsUrl`           | URL to **upstream** documentation (not wrapper docs)   |
| `description.short` | Locale object (see `manifest/i18n.ts`)                 |
| `description.long`  | Locale object (see `manifest/i18n.ts`)                 |
| `volumes`           | Storage volumes (usually `['main']`)                   |
| `images`            | Docker image configuration (including `arch`)          |
| `alerts`            | User notifications for lifecycle events (locale objects or `null`) |
| `dependencies`      | Service dependencies                                   |

## License

Check the upstream project's LICENSE file and use the correct SPDX identifier (e.g., `MIT`, `Apache-2.0`, `GPL-3.0`). Create a symlink from your project root to the upstream license:

```bash
ln -sf upstream-project/LICENSE LICENSE
```

## Icon

Symlink from upstream if available (svg, png, jpg, or webp, max 40 KiB):

```bash
ln -sf upstream-project/logo.svg icon.svg
```

## Images Configuration

Each image can include an `arch` field specifying supported architectures. It defaults to `['x86_64', 'aarch64', 'riscv64']` if omitted, but it is good practice to list architectures explicitly for transparency. The `arch` field must align with the `ARCHES` variable in the Makefile.

### Pre-built Docker Tag

Use when an image exists on Docker Hub or another registry:

```typescript
images: {
  main: {
    source: {
      dockerTag: 'nginx:1.25',
    },
    arch: ['x86_64', 'aarch64'],
  },
},
```

### Local Docker Build

Use when building from a Dockerfile in the project:

```typescript
// Dockerfile in project root
images: {
  main: {
    source: {
      dockerBuild: {},
    },
    arch: ['x86_64', 'aarch64'],
  },
},
```

**If upstream has a working Dockerfile**: Set `workdir` to the upstream directory. If the Dockerfile is named `Dockerfile`, you can omit the `dockerfile` field:

```typescript
images: {
  main: {
    source: {
      dockerBuild: {
        workdir: './upstream-project',
      },
    },
    arch: ['x86_64', 'aarch64'],
  },
},
```

For a non-standard Dockerfile name, specify `dockerfile` relative to project root:

```typescript
images: {
  main: {
    source: {
      dockerBuild: {
        workdir: './upstream-project',
        dockerfile: './upstream-project/sync-server.Dockerfile',
      },
    },
    arch: ['x86_64', 'aarch64'],
  },
},
```

**If you need a custom Dockerfile**: Create one in your project root:

```dockerfile
COPY upstream-project/ .
```

### Architecture Support

The `arch` field accepts these values:

| Value       | Architecture     |
|-------------|------------------|
| `x86_64`    | Intel/AMD 64-bit |
| `aarch64`   | ARM 64-bit       |
| `riscv64`   | RISC-V 64-bit    |

Most services support `['x86_64', 'aarch64']`. Only add `riscv64` if the upstream image actually supports it. The `ARCHES` variable in the Makefile must align (see [Makefile](./makefile.md)).

### GPU/Hardware Acceleration

For services requiring GPU access:

```typescript
images: {
  main: {
    source: {
      dockerTag: 'ollama/ollama:0.13.5',
    },
    arch: ['x86_64', 'aarch64'],
    nvidiaContainer: true,  // Enable NVIDIA GPU support
  },
},
hardwareAcceleration: true,  // Top-level flag
```

### Multiple Images

Services can define multiple images. Each image needs its own `arch` field:

```typescript
images: {
  app: {
    source: { dockerTag: 'myapp:latest' },
    arch: ['x86_64', 'aarch64'],
  },
  db: {
    source: { dockerTag: 'postgres:15' },
    arch: ['x86_64', 'aarch64'],
  },
},
```

## Alerts

Display messages to users during lifecycle events. Use locale objects for translated alerts, or `null` for no alert:

```typescript
// In manifest/i18n.ts
export const alertInstall = {
  en_US: 'After installation, run the "Get Admin Credentials" action to retrieve your password.',
  es_ES: 'Despues de la instalacion, ejecute la accion "Obtener credenciales de administrador" para recuperar su contrasena.',
  de_DE: 'Fuhren Sie nach der Installation die Aktion "Admin-Zugangsdaten abrufen" aus, um Ihr Passwort abzurufen.',
  pl_PL: 'Po instalacji uruchom akcje "Pobierz dane administratora", aby uzyskac haslo.',
  fr_FR: "Apres l'installation, executez l'action 'Obtenir les identifiants admin' pour recuperer votre mot de passe.",
}

// In manifest/index.ts
import { short, long, alertInstall } from './i18n'

alerts: {
  install: alertInstall,
  update: null,
  uninstall: null,
  restore: null,
  start: null,
  stop: null,
},
```

## Volumes

Storage volumes for persistent data. Usually just `['main']`:

```typescript
volumes: ['main'],
```

For services needing separate storage areas:

```typescript
volumes: ['main', 'db', 'config'],
```

Reference these in `main.ts` mounts as `'main'`, `'db'`, `'config'`.

## Dependencies

Declare dependencies on other StartOS services. Note that dependency `description` is a plain string, not a locale object:

```typescript
dependencies: {
  // Required dependency
  bitcoin: {
    description: 'Required for blockchain data',
    optional: false,
  },

  // Optional dependency with metadata
  'c-lightning': {
    description: 'Needed for Lightning payments',
    optional: true,
    metadata: {
      title: 'Core Lightning',
      icon: 'https://raw.githubusercontent.com/Start9Labs/cln-startos/refs/heads/master/icon.png',
    },
  },
},
```
