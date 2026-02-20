# File Models

File Models represent configuration files as TypeScript definitions, providing type safety and runtime enforcement throughout your codebase.

## Supported Formats

File Models support automatic parsing and serialization for:

- `.json`
- `.yaml` / `.yml`
- `.toml`
- `.ini`
- `.env`

Custom parser/serializer support is available for non-standard formats.

## Creating a File Model

### store.json.ts (Common Pattern)

The most common file model is `store.json`, used to persist internal service state:

```typescript
import { matches, FileHelper } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const { object, string, number, boolean } = matches

const shape = object({
  adminPassword: string.optional().onMismatch(undefined),
  secretKey: string.optional().onMismatch(undefined),
  someNumber: number.optional().onMismatch(0),
  someFlag: boolean.optional().onMismatch(false),
})

export const storeJson = FileHelper.json(
  { base: sdk.volumes.main, subpath: 'store.json' },
  shape,
)
```

### YAML Configuration

```typescript
import { matches, FileHelper } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const { object, string, array } = matches

const shape = object({
  server: object({
    host: string,
    port: number,
  }),
  features: array(string),
})

export const configYaml = FileHelper.yaml(
  { base: sdk.volumes.main, subpath: 'config.yaml' },
  shape,
)
```

## Reading File Models

### Reading Methods

| Method | Purpose |
|--------|---------|
| `.once()` | Read content once, no reactivity |
| `.const(effects)` | Read content AND re-run context if changes occur |
| `.onChange(effects)` | Register callback for value changes |
| `.watch(effects)` | Create async iterator of new values |

> [!NOTE]
> All read methods return `null` if the file doesn't exist. Do NOT use try-catch for missing files.

### Examples

```typescript
// One-time read (no restart on change) - returns null if file doesn't exist
const store = await storeJson.read().once()

// Handle missing file with nullish coalescing
const keys = (await authorizedKeysFile.read().once()) ?? []

// Reactive read (service restarts if value changes)
const store = await storeJson.read().const(effects)

// Read only specific fields (subset reading)
const password = await storeJson.read((s) => s.adminPassword).once()

// Reactive subset read - daemon only restarts if secretKey changes
const secretKey = await storeJson.read((s) => s.secretKey).const(effects)
```

> [!WARNING]
> Never use an identity mapper like `.read((s) => s)`. Either omit the mapper to get the full object (`.read()`) or use it to extract a specific field (`.read((s) => s.someField)`).


### Subset Reading

Use mapping to retrieve only specific fields rather than entire files:

```typescript
// Read only adminPassword - more efficient
const password = await storeJson.read((s) => s.adminPassword).once()

// Read nested values
const serverHost = await configYaml.read((c) => c.server.host).once()
```

## Writing File Models

### Full Write

```typescript
await storeJson.write(effects, {
  adminPassword: 'secret123',
  secretKey: 'abc123',
  someNumber: 42,
  someFlag: true,
})
```

### Merge (Partial Update)

```typescript
// Only update specific fields, preserve others
await storeJson.merge(effects, { someFlag: false })
```

## Type Coercion

File Models provide runtime type coercion. For example, if a number is unexpectedly stored as a string, the validator can convert it back:

```typescript
const shape = object({
  port: number.onMismatch((val) => {
    // Convert string to number if needed
    if (typeof val === 'string') return parseInt(val, 10)
    return 8080 // default
  }),
})
```

## Best Practices

### Prefer Direct FileModel Over store.json + Environment Variables

When an upstream service reads a config file (TOML, YAML, JSON, etc.), model that file directly with `FileHelper` rather than storing values in `store.json` and passing them as environment variables. A direct FileModel provides:

- **Two-way binding**: Actions can read and write the upstream config file directly.
- **Simpler main.ts**: Mount the config file from the volume into the subcontainer. No need to read and regenerate it.
- **Easy user configuration**: Exposing config options via Actions is as simple as `configToml.merge(effects, { key: newValue })`.

Use `store.json` only for internal package state that has no upstream config file equivalent (e.g., a generated PostgreSQL password that the upstream service doesn't read from its own config file).

```typescript
// GOOD: Model the upstream config directly
export const configToml = FileHelper.toml(
  { base: sdk.volumes['my-data'], subpath: 'config.toml' },
  shape,
)

// In main.ts, mount the volume so the config file is accessible in the subcontainer.
// You can mount the individual file or an entire directory that contains it.
const appSub = await sdk.SubContainer.of(effects, { imageId: 'my-app' },
  sdk.Mounts.of().mountVolume({
    volumeId: 'my-data',
    subpath: 'config.toml',
    mountpoint: '/etc/my-app/config.toml',
    readonly: false,
    type: 'file',
  }),
  'my-app-sub',
)

// Reactive read triggers daemon restart when config changes (e.g. via actions)
await configToml.read((c) => c.some_mutable_setting).const(effects)

// In an action, toggle a setting directly
await configToml.merge(effects, { allow_registration: !current })
```

> [!WARNING]
> Do NOT read a FileModel in main.ts and then write it back to the subcontainer rootfs. The file already lives on the volume — just mount it.

## Common Patterns

### Optional Fields with Defaults

```typescript
const shape = object({
  // Optional with undefined default
  apiKey: string.optional().onMismatch(undefined),

  // Optional with value default
  port: number.optional().onMismatch(8080),

  // Required field
  name: string,
})
```

### Nested Objects

```typescript
const shape = object({
  database: object({
    host: string,
    port: number,
    name: string,
  }),
  smtp: object({
    enabled: boolean,
    server: string.optional().onMismatch(undefined),
  }),
})
```

### Hardcoded Literal Values

For values that should always be a specific literal and never change (e.g., internal ports, paths, auth modes), use `literal().onMismatch()`:

```typescript
import { matches, FileHelper } from '@start9labs/start-sdk'

const { object, string, literal } = matches

const port = 8080
const dataDir = '/data'

const shape = object({
  // These values are hardcoded and will be corrected on the next merge
  port: literal(port).onMismatch(port),
  dataDir: literal(dataDir).onMismatch(dataDir),
  auth: literal('password').onMismatch('password'),
  tls: literal(false).onMismatch(false),

  // This value can vary
  password: string.optional().onMismatch(undefined),
})
```

This pattern ensures:

- The value is validated to match the literal exactly
- If the file ends up with a different value (e.g., user edits it manually), it's corrected on the next `merge()`
- You can use `merge()` to update only the non-literal fields without specifying the hardcoded ones

### Using SDK Input Spec Validators

For complex types like SMTP, use the SDK's built-in validators. See [Actions](./actions.md) for the full SMTP configuration walkthrough.

```typescript
import { sdk } from '../sdk'

const shape = object({
  adminPassword: string.optional().onMismatch(undefined),
  smtp: sdk.inputSpecConstants.smtpInputSpec.validator.onMismatch({
    selection: 'disabled',
    value: {},
  }),
})
```
