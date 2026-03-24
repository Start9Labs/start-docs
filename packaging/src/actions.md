# Actions

Actions are user-triggered operations that appear in the StartOS UI for your service. They can display information, accept user input, modify configuration, and more.

## Action Without Input

The simplest action type retrieves or computes a result and displays it to the user.

```typescript
import { i18n } from "../i18n";
import { sdk } from "../sdk";
import { storeJson } from "../fileModels/store.json";

export const getAdminCredentials = sdk.Action.withoutInput(
  // ID
  "get-admin-credentials",

  // Metadata
  async ({ effects }) => ({
    name: i18n("Get Admin Credentials"),
    description: i18n("Retrieve admin username and password"),
    warning: null,
    allowedStatuses: "any", // 'any', 'only-running', 'only-stopped'
    group: null,
    visibility: "enabled", // 'enabled', 'disabled', 'hidden'
  }),

  // Handler
  async ({ effects }) => {
    const store = await storeJson.read().once();

    return {
      version: "1",
      title: "Admin Credentials",
      message: "Your admin credentials:",
      result: {
        type: "group",
        value: [
          {
            type: "single",
            name: "Username",
            description: null,
            value: "admin",
            masked: false,
            copyable: true,
            qr: false,
          },
          {
            type: "single",
            name: "Password",
            description: null,
            value: store?.adminPassword ?? "UNKNOWN",
            masked: true,
            copyable: true,
            qr: false,
          },
        ],
      },
    };
  },
);
```

## Registering Actions

All actions must be registered in `actions/index.ts`:

```typescript
import { sdk } from "../sdk";
import { getAdminCredentials } from "./getAdminCredentials";

export const actions = sdk.Actions.of().addAction(getAdminCredentials);
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
    { type: 'single', name: 'Username', description: null, value: 'admin', masked: false, copyable: true, qr: false },
    { type: 'single', name: 'Password', description: null, value: 'secret', masked: true, copyable: true, qr: false },
  ],
}
```

## Tasks

Actions can be surfaced to users as tasks — notifications that prompt them to run a specific action at the right time. See [Tasks](./tasks.md) for details.

## Implementation Examples

### Auto-Generate Passwords

Do not accept password input from users — users are bad at choosing passwords. Instead, auto-generate strong passwords and display them in action results:

```typescript
import { utils } from "@start9labs/start-sdk";

// Generate a strong random password
const password = utils.getDefaultString({ charset: "a-z,A-Z,0-9", len: 22 });
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
  if (kind !== "install") return;
  await sdk.action.createOwnTask(effects, toggleRegistrations, "important", {
    reason:
      "After creating your admin account, disable registrations to prevent unauthorized signups.",
  });
});

// In actions/toggleRegistrations.ts
import { configToml } from '../fileModels/config.toml'

export const toggleRegistrations = sdk.Action.withoutInput(
  "toggle-registrations",
  async ({ effects }) => {
    const allowed = await configToml
      .read((c) => c.allow_registration)
      .const(effects);
    return {
      name: allowed
        ? i18n("Disable Registrations")
        : i18n("Enable Registrations"),
      description: allowed
        ? i18n(
            "Registrations are currently enabled. Run this action to disable them.",
          )
        : i18n(
            "Registrations are currently disabled. Run this action to enable them.",
          ),
      warning: allowed
        ? null
        : i18n("Anyone with your URL will be able to create an account."),
      allowedStatuses: "any",
      group: null,
      visibility: "enabled",
    };
  },
  async ({ effects }) => {
    const allowed = await configToml
      .read((c) => c.allow_registration)
      .const(effects);
    await configToml.merge(effects, { allow_registration: !allowed });
  },
);
```

## Action With Input

For actions that accept user input, use `sdk.Action.withInput()` with an `InputSpec` form, a prefill function, and a handler:

```typescript
import { sdk } from '../sdk'
import { configFile } from '../fileModels/config'
import { i18n } from '../i18n'
const { InputSpec, Value } = sdk

const inputSpec = InputSpec.of({
  timeout: Value.number({
    name: i18n('Session Timeout'),
    description: i18n('How long before idle sessions expire'),
    required: false,
    default: 30,
    min: 1,
    max: 1440,
    step: 1,
    integer: true,
    units: 'minutes',
  }),
})

export const configure = sdk.Action.withInput(
  'configure',
  {
    name: i18n('Configure'),
    description: i18n('Adjust service settings'),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  },
  inputSpec,
  // Prefill form with current values
  async ({ effects }) => {
    const current = await configFile.read((c) => c.timeout).once()
    return { timeout: current }
  },
  // Handler — write new values
  async ({ effects, input }) => {
    await configFile.merge(effects, { timeout: input.timeout })
  },
)
```

The five arguments to `withInput` are: action ID, metadata (static object or async function), input spec, prefill function, and handler.

## SMTP Configuration

The SDK provides a built-in SMTP input specification for managing email credentials. This supports three modes: disabled, system SMTP (from StartOS settings), or custom SMTP with provider presets (Gmail, Amazon SES, SendGrid, Mailgun, Proton Mail, or custom).

### 1. Add SMTP to store.json.ts

Use the SDK's `smtpShape` zod schema in your store's shape definition. See [File Models](./file-models.md) for more on file model patterns.

```typescript
import { FileHelper, smtpShape, z } from "@start9labs/start-sdk";
import { sdk } from "../sdk";

const shape = z.object({
  adminPassword: z.string().optional(),
  secretKey: z.string().optional(),
  smtp: smtpShape,
});

export const storeJson = FileHelper.json(
  { base: sdk.volumes.main, subpath: "./store.json" },
  shape,
);
```

### 2. Create the manageSmtp Action

Use `smtpPrefill()` in the prefill function to bridge between the stored `SmtpSelection` type and the input spec's expected type. These types represent the same data but are structurally different in TypeScript (the store uses a flat union, the input spec uses a distributed discriminated union), so `smtpPrefill()` handles the conversion.

```typescript
import { smtpPrefill } from "@start9labs/start-sdk";
import { i18n } from "../i18n";
import { storeJson } from "../fileModels/store.json";
import { sdk } from "../sdk";

const { InputSpec } = sdk;

export const inputSpec = InputSpec.of({
  smtp: sdk.inputSpecConstants.smtpInputSpec,
});

export const manageSmtp = sdk.Action.withInput(
  "manage-smtp",

  async ({ effects }) => ({
    name: i18n("Configure SMTP"),
    description: i18n("Add SMTP credentials for sending emails"),
    warning: null,
    allowedStatuses: "any",
    group: null,
    visibility: "enabled",
  }),

  inputSpec,

  // Pre-fill form with current values
  async ({ effects }) => ({
    smtp: smtpPrefill(await storeJson.read((s) => s.smtp).const(effects)),
  }),

  // Save to store
  async ({ effects, input }) => storeJson.merge(effects, { smtp: input.smtp }),
);
```

### 3. Register the Action

```typescript
import { sdk } from "../sdk";
import { getAdminCredentials } from "./getAdminCredentials";
import { manageSmtp } from "./manageSmtp";

export const actions = sdk.Actions.of()
  .addAction(getAdminCredentials)
  .addAction(manageSmtp);
```

### 4. Use SMTP Credentials at Runtime

In your `main.ts`, resolve the SMTP credentials based on the user's selection:

```typescript
import { T } from "@start9labs/start-sdk";

export const main = sdk.setupMain(async ({ effects }) => {
  const store = await storeJson.read().const(effects);

  // Resolve SMTP credentials based on selection
  const smtp = store?.smtp;
  let smtpCredentials: T.SmtpValue | null = null;

  if (smtp?.selection === "system") {
    // Use system-wide SMTP from StartOS settings
    smtpCredentials = await sdk.getSystemSmtp(effects).const();
    if (smtpCredentials && smtp.value.customFrom) {
      smtpCredentials.from = smtp.value.customFrom;
    }
  } else if (smtp?.selection === "custom") {
    // Use custom SMTP credentials from the selected provider
    const { host, from, username, password, security } =
      smtp.value.provider.value;
    smtpCredentials = {
      host,
      port: Number(security.value.port),
      from,
      username,
      password: password ?? null,
      security: security.selection,
    };
  }
  // If smtp.selection === 'disabled', smtpCredentials remains null

  // Pass to config generation
  const config = generateConfig({
    smtp: smtpCredentials,
    // ... other config
  });

  // ...
});
```

### 5. Initialize with SMTP Disabled

In `init/initializeService.ts`, set the default SMTP state:

```typescript
await storeJson.write(effects, {
  adminPassword,
  secretKey,
  smtp: { selection: "disabled", value: {} },
});
```

### T.SmtpValue Type

The resolved SMTP credentials (returned by `sdk.getSystemSmtp()`) have this structure:

```typescript
interface SmtpValue {
  host: string;
  port: number;
  from: string;
  username: string;
  password: string | null | undefined;
  security: "starttls" | "tls";
}
```

### SmtpSelection Type

The stored SMTP selection (from `smtpShape`) has this structure:

```typescript
type SmtpSelection =
  | { selection: "disabled"; value: Record<string, never> }
  | { selection: "system"; value: { customFrom?: string | null } }
  | {
      selection: "custom";
      value: {
        provider: {
          selection: string; // "gmail", "ses", "sendgrid", etc.
          value: {
            host: string;
            from: string;
            username: string;
            password?: string | null;
            security: {
              selection: "tls" | "starttls";
              value: { port: string };
            };
          };
        };
      };
    };
```
