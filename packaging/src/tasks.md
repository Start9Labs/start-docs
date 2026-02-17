---
title: "Tasks"
description: "Create tasks that prompt users to run actions at the right time."
section: "packaging"
type: "guide"
keywords: ["tasks", "prompts", "createOwnTask", "createTask", "notifications", "actions"]
---

# Tasks

Tasks are notifications that appear in the StartOS UI prompting the user to run a specific [action](./actions.md). They are commonly used to surface important information after install or restore, request required configuration, or coordinate setup with dependency services.

## Own Tasks

Use `sdk.action.createOwnTask()` to prompt the user to run one of your service's own actions.

```typescript
await sdk.action.createOwnTask(effects, getAdminCredentials, 'critical', {
  reason: i18n('Retrieve the admin password'),
})
```

### Parameters

| Parameter  | Type                                       | Description                                            |
| ---------- | ------------------------------------------ | ------------------------------------------------------ |
| `effects`  | `Effects`                                  | Provided by the calling context                        |
| `action`   | `ActionDefinition`                         | The action to prompt the user to run                   |
| `severity` | `'critical' \| 'high' \| 'medium' \| 'low'` | How urgently the task is surfaced in the UI           |
| `options`  | `{ reason: string }`                       | Human-readable explanation shown to the user           |

### Severity Levels

- **critical** — Blocks the service from starting until the user completes the task. Use for essential setup like retrieving generated passwords or accepting terms.
- **high** — Prominently displayed but does not block the service.
- **medium** — Standard priority notification.
- **low** — Informational, least prominent.

## Common Patterns

### Prompt on Install Only

Generate a password and prompt the user to retrieve it. Skip on restore (password already exists) and container rebuild:

```typescript
export const initializeService = sdk.setupOnInit(async (effects, kind) => {
  if (kind !== 'install') return

  const adminPassword = utils.getDefaultString({ charset: 'a-z,A-Z,0-9', len: 22 })
  await storeJson.write(effects, {
    adminPassword,
    smtp: { selection: 'disabled', value: {} },
  })

  await sdk.action.createOwnTask(effects, getAdminCredentials, 'critical', {
    reason: i18n('Retrieve the admin password'),
  })
})
```

### Prompt on Install and Restore

Useful when the user should always be reminded of credentials, even after restoring from backup:

```typescript
export const initializeService = sdk.setupOnInit(async (effects, kind) => {
  if (kind === null) return // Skip on container rebuild

  if (kind === 'install') {
    const adminPassword = utils.getDefaultString({ charset: 'a-z,A-Z,0-9', len: 22 })
    await storeJson.write(effects, { adminPassword })
  }

  await sdk.action.createOwnTask(effects, getAdminCredentials, 'critical', {
    reason: i18n('Retrieve the admin password'),
  })
})
```

### Prompt for Required Configuration

Ask the user to configure something before the service can function:

```typescript
await sdk.action.createOwnTask(effects, manageSmtp, 'high', {
  reason: i18n('Configure email settings to enable notifications'),
})
```

## Dependency Tasks

Use `sdk.action.createTask()` to prompt the user to run an action on a dependency service. The action must be imported from the dependency's package.

```typescript
import { someAction } from 'dependency-package/startos/actions/someAction'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  await sdk.action.createTask(effects, 'dependency-id', someAction, 'critical', {
    input: {
      kind: 'partial',
      value: { /* fields matching the action's input spec */ },
    },
    when: { condition: 'input-not-matches', once: false },
    reason: i18n('Configure the dependency for use with this service'),
  })

  return {
    'dependency-id': {
      kind: 'running',
      versionRange: '>=1.0.0:0',
      healthChecks: [],
    },
  }
})
```

### Parameters

| Parameter  | Type                                       | Description                                            |
| ---------- | ------------------------------------------ | ------------------------------------------------------ |
| `effects`  | `Effects`                                  | Provided by the calling context                        |
| `packageId`| `string`                                   | The dependency's service ID                            |
| `action`   | `ActionDefinition`                         | Imported from the dependency's package                 |
| `severity` | `'critical' \| 'high' \| 'medium' \| 'low'` | How urgently the task is surfaced                    |
| `options`  | `object`                                   | See below                                              |

### Options

| Field      | Type                                                  | Description                                                      |
| ---------- | ----------------------------------------------------- | ---------------------------------------------------------------- |
| `input`    | `{ kind: 'partial', value: Partial<InputSpec> }`      | Pre-fill fields in the action's input form                       |
| `when`     | `{ condition: 'input-not-matches', once: boolean }`   | Re-trigger until the action's input matches the provided values  |
| `reason`   | `string`                                              | Human-readable explanation shown to the user                     |
| `replayId` | `string` (optional)                                   | Prevents duplicate tasks across restarts                         |

> [!NOTE]
> The dependency must be listed in your `package.json` so the action can be imported (e.g., `"synapse-startos": "file:../synapse-wrapper"`). See [Dependencies](./dependencies.md) for more on cross-service integration.
