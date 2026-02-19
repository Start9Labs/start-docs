# Actions

Actions are user-triggered operations that appear in the StartOS UI for your service. They can display information, accept user input, modify configuration, and more.

## Action Without Input

The simplest action type retrieves or computes a result and displays it to the user.

```typescript
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { storeJson } from '../fileModels/store.json'

export const getAdminCredentials = sdk.Action.withoutInput(
  // ID
  'get-admin-credentials',

  // Metadata
  async ({ effects }) => ({
    name: i18n('Get Admin Credentials'),
    description: i18n('Retrieve admin username and password'),
    warning: null,
    allowedStatuses: 'any',  // 'any', 'only-running', 'only-stopped'
    group: null,
    visibility: 'enabled',   // 'enabled', 'disabled', 'hidden'
  }),

  // Handler
  async ({ effects }) => {
    const store = await storeJson.read((s) => s).once()

    return {
      version: '1' as const,
      title: 'Admin Credentials',
      message: 'Your admin credentials:',
      result: {
        type: 'group',
        value: [
          {
            type: 'single',
            name: 'Username',
            description: null,
            value: 'admin',
            masked: false,
            copyable: true,
            qr: false,
          },
          {
            type: 'single',
            name: 'Password',
            description: null,
            value: store?.adminPassword ?? 'UNKNOWN',
            masked: true,
            copyable: true,
            qr: false,
          },
        ],
      },
    }
  },
)
```

## Registering Actions

All actions must be registered in `actions/index.ts`:

```typescript
import { sdk } from '../sdk'
import { getAdminCredentials } from './getAdminCredentials'

export const actions = sdk.Actions.of().addAction(getAdminCredentials)
```

## Result Types

Actions return structured results that the StartOS UI renders for the user.

### Single Value

```typescript
result: {
  type: 'single',
  name: 'API Key',
  description: null,
  value: 'abc123',
  masked: true,
  copyable: true,
  qr: false,
}
```

### Group of Values

```typescript
result: {
  type: 'group',
  value: [
    { type: 'single', name: 'Username', value: 'admin', masked: false, copyable: true, qr: false },
    { type: 'single', name: 'Password', value: 'secret', masked: true, copyable: true, qr: false },
  ],
}
```

## Tasks

Actions can be surfaced to users as tasks — notifications that prompt them to run a specific action at the right time. See [Tasks](./tasks.md) for details.

## Common Patterns

### Auto-Generate Passwords

Do not accept password input from users — users are bad at choosing passwords. Instead, auto-generate strong passwords and display them in action results:

```typescript
import { utils } from '@start9labs/start-sdk'

// Generate a strong random password
const password = utils.getDefaultString({ charset: 'a-z,A-Z,0-9', len: 22 })
```

If a user needs to recover a lost password, provide a "Reset Password" action that generates a new one and updates the service's database or config. Display the new password as a masked, copyable result.

### Registration-Gated Services

Some services require that "registrations" or "signups" be enabled for users to create accounts. This creates a security tension: the service must be open for the admin to register, but should be locked down after.

The recommended pattern:

1. **Start with registrations enabled** in the initial config.
2. **Create an important task** in `setupOnInit` advising the user to disable registrations after creating their admin account.
3. **Provide a toggle action** that reads the current registration state, flips it, and writes back.

```typescript
// In init/initializeService.ts
export const initializeService = sdk.setupOnInit(async (effects, kind) => {
  if (kind !== 'install') return
  await sdk.action.createOwnTask(effects, toggleRegistrations, 'important', {
    reason: 'After creating your admin account, disable registrations to prevent unauthorized signups.',
  })
})

// In actions/toggleRegistrations.ts
export const toggleRegistrations = sdk.Action.withoutInput(
  'toggle-registrations',
  async ({ effects }) => {
    const allowed = await configToml.read((c) => c.allow_registration).const(effects)
    return {
      name: allowed ? i18n('Disable Registrations') : i18n('Enable Registrations'),
      description: allowed
        ? i18n('Registrations are currently enabled. Run this action to disable them.')
        : i18n('Registrations are currently disabled. Run this action to enable them.'),
      warning: allowed ? null : i18n('Anyone with your URL will be able to create an account.'),
      allowedStatuses: 'any',
      group: null,
      visibility: 'enabled',
    }
  },
  async ({ effects }) => {
    const allowed = await configToml.read((c) => c.allow_registration).const(effects)
    await configToml.merge(effects, { allow_registration: !allowed })
  },
)
```

## SMTP Configuration

The SDK provides a built-in SMTP input specification for managing email credentials. This supports three modes: disabled, system SMTP (from StartOS settings), or custom SMTP.

### 1. Add SMTP to store.json.ts

Add the SMTP validator to your store's shape definition. See [File Models](./file-models.md) for more on file model patterns.

```typescript
import { matches, FileHelper } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const { object, string } = matches

const shape = object({
  adminPassword: string.optional().onMismatch(undefined),
  secretKey: string.optional().onMismatch(undefined),
  smtp: sdk.inputSpecConstants.smtpInputSpec.validator.onMismatch({
    selection: 'disabled',
    value: {},
  }),
})

export const storeJson = FileHelper.json(
  { volumeId: 'main', subpath: 'store.json' },
  shape,
)
```

### 2. Create the manageSmtp Action

```typescript
import { i18n } from '../i18n'
import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'

const { InputSpec } = sdk

export const inputSpec = InputSpec.of({
  smtp: sdk.inputSpecConstants.smtpInputSpec,
})

export const manageSmtp = sdk.Action.withInput(
  'manage-smtp',

  async ({ effects }) => ({
    name: i18n('Configure SMTP'),
    description: i18n('Add SMTP credentials for sending emails'),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  inputSpec,

  // Pre-fill form with current values
  async ({ effects }) => ({
    smtp: (await storeJson.read((s) => s.smtp).const(effects)) || undefined,
  }),

  // Save to store
  async ({ effects, input }) => storeJson.merge(effects, { smtp: input.smtp }),
)
```

### 3. Register the Action

```typescript
import { sdk } from '../sdk'
import { getAdminCredentials } from './getAdminCredentials'
import { manageSmtp } from './manageSmtp'

export const actions = sdk.Actions.of()
  .addAction(getAdminCredentials)
  .addAction(manageSmtp)
```

### 4. Use SMTP Credentials at Runtime

In your `main.ts`, resolve the SMTP credentials based on the user's selection:

```typescript
import { T } from '@start9labs/start-sdk'

export const main = sdk.setupMain(async ({ effects }) => {
  const store = await storeJson.read((s) => s).const(effects)

  // Resolve SMTP credentials based on selection
  const smtp = store?.smtp
  let smtpCredentials: T.SmtpValue | null = null

  if (smtp?.selection === 'system') {
    // Use system-wide SMTP from StartOS settings
    smtpCredentials = await sdk.getSystemSmtp(effects).const()
    if (smtpCredentials && smtp.value.customFrom) {
      smtpCredentials.from = smtp.value.customFrom
    }
  } else if (smtp?.selection === 'custom') {
    // Use custom SMTP credentials
    smtpCredentials = smtp.value
  }
  // If smtp.selection === 'disabled', smtpCredentials remains null

  // Pass to config generation
  const config = generateConfig({
    smtp: smtpCredentials,
    // ... other config
  })

  // ...
})
```

### 5. Initialize with SMTP Disabled

In `init/initializeService.ts`, set the default SMTP state:

```typescript
await storeJson.write(effects, {
  adminPassword,
  secretKey,
  smtp: { selection: 'disabled', value: {} },
})
```

### T.SmtpValue Type

The resolved SMTP credentials have this structure:

```typescript
interface SmtpValue {
  server: string
  port: number
  login: string
  password?: string | null
  from: string
}
```
