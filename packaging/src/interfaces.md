# Interfaces

`setupInterfaces()` defines the network interfaces your service exposes and how they are made available to the user. This function runs on service install, update, and config save.

## Single Interface

For a service with one web interface, refer to the Hello World example in the [Quick Start](./quick-start.md).

## Multiple Interfaces

Expose multiple paths (e.g., web UI and admin panel) from the same port:

```typescript
import { i18n } from './i18n'
import { sdk } from './sdk'

const uiPort = 8080

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  const uiMulti = sdk.MultiHost.of(effects, 'ui-multi')
  const uiMultiOrigin = await uiMulti.bindPort(uiPort, {
    protocol: 'http',
  })

  const ui = sdk.createInterface(effects, {
    name: i18n('Web UI'),
    id: 'ui',
    description: i18n('The web interface'),
    type: 'ui',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })

  const admin = sdk.createInterface(effects, {
    name: i18n('Admin Panel'),
    id: 'admin',
    description: i18n('Admin interface'),
    type: 'ui',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '/admin/',
    query: {},
  })

  const uiReceipt = await uiMultiOrigin.export([ui, admin])
  return [uiReceipt]
})
```

The key steps are:

1. Create a `MultiHost` and bind a port with a protocol
2. Create one or more interfaces using `sdk.createInterface()`
3. Export the interfaces from the origin and return the receipt(s)

## Interface Options

```typescript
sdk.createInterface(effects, {
  name: i18n('Display Name'),      // Shown in UI (wrap with i18n)
  id: 'unique-id',                 // Used in sdk.serviceInterface.getOwn()
  description: i18n('Description'),// Shown in UI (wrap with i18n)
  type: 'ui',                      // 'ui' or 'api'
  masked: false,                   // Hide from discovery?
  schemeOverride: null,            // Force 'https' or 'http'?
  username: null,                  // Auth username (if any)
  path: '/some/path/',             // URL path
  query: {},                       // URL query params
})
```

| Option | Type | Description |
|--------|------|-------------|
| `name` | `string` | Display name shown to the user. Wrap with `i18n()`. |
| `id` | `string` | Unique identifier. Used to retrieve this interface in [main.ts](./main.md) via `sdk.serviceInterface.getOwn()`. |
| `description` | `string` | Description shown to the user. Wrap with `i18n()`. |
| `type` | `'ui'` or `'api'` | Whether this interface is a user-facing UI or a programmatic API. |
| `masked` | `boolean` | If `true`, the interface is hidden from service discovery. |
| `schemeOverride` | `string` or `null` | Force a specific URL scheme (`'https'` or `'http'`). Use `null` to let the system decide. |
| `username` | `string` or `null` | Username for basic authentication, if required. |
| `path` | `string` | URL path appended to the base address (e.g., `'/admin/'`). |
| `query` | `object` | URL query parameters as key-value pairs. |

> [!TIP]
> The `id` you assign to an interface is what you use in `main.ts` to retrieve hostnames for that interface. For example, if you set `id: 'ui'`, you would call `sdk.serviceInterface.getOwn(effects, 'ui')` to get its address information. See [Main](./main.md#getting-hostnames) for details.
