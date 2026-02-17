# Initialization

`setupOnInit` runs during container initialization. The `kind` parameter indicates why init is running:

| Kind | When | Use For |
|------|------|---------|
| `'install'` | Fresh install | Generate passwords, create admin users, bootstrap via API |
| `'restore'` | Restoring from backup | Re-register triggers, skip password generation |
| `null` | Container rebuild, server restart | Register long-lived triggers (e.g., `.const()` watchers) |

## Init Kinds

### Install Only

For one-time setup that generates new state:

```typescript
export const initializeService = sdk.setupOnInit(async (effects, kind) => {
  if (kind !== 'install') return

  // Create a critical task for the user to perform before they can start the service
  await sdk.action.createOwnTask(effects, createPassword, 'critical', {
    reason: i18n('Create your admin password'),
  })
})
```

### Restore

For setup that should also run when restoring from backup (but not on container rebuild):

```typescript
export const initializeService = sdk.setupOnInit(async (effects, kind) => {
  if (kind === null) return // Skip on container rebuild

  // Runs on both install and restore
  await sdk.action.createOwnTask(effects, getAdminPassword, 'critical', {
    reason: i18n('Retrieve the admin password'),
  })
})
```

### Always (Container Lifetime)

For registering `.const()` triggers that need to persist for the container's lifetime. These re-register on container rebuild:

```typescript
export const initializeService = sdk.setupOnInit(async (effects, kind) => {
  // Runs on install, restore, AND container rebuild

  // Register a watcher that lives for the container lifetime
  someConfig.read((c) => c.setting).const(effects)

  // Install-specific setup
  if (kind === 'install') {
    const adminPassword = utils.getDefaultString({
      charset: 'a-z,A-Z,0-9',
      len: 22,
    })
    await storeJson.write(effects, { adminPassword })
  }
})
```

## Basic Structure

```typescript
// init/initializeService.ts
import { utils } from '@start9labs/start-sdk'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { storeJson } from '../fileModels/store.json'
import { getAdminPassword } from '../actions/getAdminPassword'

export const initializeService = sdk.setupOnInit(async (effects, kind) => {
  if (kind !== 'install') return

  // Generate and store password
  const adminPassword = utils.getDefaultString({
    charset: 'a-z,A-Z,0-9',
    len: 22,
  })
  await storeJson.write(effects, { adminPassword })

  // Create task prompting user to retrieve password
  await sdk.action.createOwnTask(effects, getAdminPassword, 'critical', {
    reason: i18n('Retrieve the admin password'),
  })
})
```

## Registering initializeService

Add your custom init function to `init/index.ts`:

```typescript
import { sdk } from '../sdk'
import { setDependencies } from '../dependencies'
import { setInterfaces } from '../interfaces'
import { versionGraph } from '../install/versionGraph'
import { actions } from '../actions'
import { restoreInit } from '../backups'
import { initializeService } from './initializeService'

export const init = sdk.setupInit(
  restoreInit,
  versionGraph,
  setInterfaces,
  setDependencies,
  actions,
  initializeService, // Add this
)

export const uninit = sdk.setupUninit(versionGraph)
```

## runUntilSuccess Pattern

Use `runUntilSuccess(timeout)` to run daemons and oneshots during init, waiting for completion before continuing. This is essential for setup tasks that need a running server.

### Oneshots Only

For simple sequential tasks (like database migrations):

```typescript
await sdk.Daemons.of(effects)
  .addOneshot('migrate', {
    subcontainer: appSub,
    exec: { command: ['python', 'manage.py', 'migrate', '--noinput'] },
    requires: [],
  })
  .addOneshot('create-superuser', {
    subcontainer: appSub,
    exec: {
      command: ['python', 'manage.py', 'createsuperuser', '--noinput'],
      env: {
        DJANGO_SUPERUSER_USERNAME: 'admin',
        DJANGO_SUPERUSER_PASSWORD: adminPassword,
      },
    },
    requires: ['migrate'],
  })
  .runUntilSuccess(120_000) // 2 minute timeout
```

### Daemon + Dependent Oneshot

For services that require calling an API after the server starts (e.g., bootstrapping via HTTP):

```typescript
await sdk.Daemons.of(effects)
  .addDaemon('server', {
    subcontainer: appSub,
    exec: { command: ['node', 'server.js'] },
    ready: {
      display: null,
      fn: () =>
        sdk.healthCheck.checkPortListening(effects, 8080, {
          successMessage: 'Server ready',
          errorMessage: 'Server not ready',
        }),
    },
    requires: [],
  })
  .addOneshot('bootstrap', {
    subcontainer: appSub,
    exec: {
      command: [
        'node',
        '-e',
        `fetch('http://127.0.0.1:8080/api/bootstrap', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: '${adminPassword}' })
        }).then(r => {
          if (!r.ok) throw new Error('Bootstrap failed');
          process.exit(0);
        }).catch(e => {
          console.error(e);
          process.exit(1);
        })`,
      ],
    },
    requires: ['server'], // Waits for daemon to be healthy
  })
  .runUntilSuccess(120_000)
```

**How it works:**

1. The daemon starts and runs its health check
2. Once healthy, the dependent oneshot executes
3. When the oneshot completes successfully, `runUntilSuccess` returns
4. All processes are cleaned up automatically

### Making HTTP Calls Without curl

Many slim Docker images do not have curl. Use the runtime's built-in HTTP capabilities instead.

**Node.js (v18+):**

```typescript
command: [
  'node',
  '-e',
  `fetch('http://127.0.0.1:${port}/api/endpoint', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: 'value' })
  }).then(r => r.ok ? process.exit(0) : process.exit(1))
    .catch(() => process.exit(1))`,
]
```

**Python:**

```typescript
command: [
  'python',
  '-c',
  `import urllib.request, json
req = urllib.request.Request(
  'http://127.0.0.1:${port}/api/endpoint',
  data=json.dumps({'key': 'value'}).encode(),
  headers={'Content-Type': 'application/json'},
  method='POST'
)
urllib.request.urlopen(req)`,
]
```

## Common Patterns

### Generate Random Password

```typescript
import { utils } from '@start9labs/start-sdk'

const password = utils.getDefaultString({
  charset: 'a-z,A-Z,0-9',
  len: 22,
})
```

### Create User Task

Prompt the user to run an action after install:

```typescript
await sdk.action.createOwnTask(effects, getAdminPassword, 'critical', {
  reason: i18n('Retrieve the admin password'),
})
```

Priority levels: `'critical'`, `'high'`, `'medium'`, `'low'`

### Checking Init Kind

```typescript
export const initializeService = sdk.setupOnInit(async (effects, kind) => {
  // kind === 'install': Fresh install
  // kind === 'restore': Restoring from backup
  // kind === null: Container rebuild / server restart

  if (kind === 'install') {
    // Generate new passwords, bootstrap server
  }

  if (kind !== null) {
    // Runs on install OR restore (skip container rebuild)
  }

  // No check: runs on ALL init types (install, restore, container rebuild)
})
```
