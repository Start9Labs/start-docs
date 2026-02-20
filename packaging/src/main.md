# Main

`setupMain()` defines the runtime behavior of your service -- daemons, health checks, volume mounts, environment variables, and config file generation. It runs each time the service is started.

## Basic Structure

```typescript
import { i18n } from "./i18n";
import { sdk } from "./sdk";
import { uiPort } from "./utils";

export const main = sdk.setupMain(async ({ effects }) => {
  /**
   * ======================== Setup (optional) ========================
   *
   * In this section, we fetch any resources or run any desired preliminary commands.
   */
  console.info(i18n("Starting Hello World!"));

  /**
   * ======================== Daemons ========================
   *
   * In this section, we create one or more daemons that define the service runtime.
   *
   * Each daemon defines its own health check, which can optionally be exposed to the user.
   */
  return sdk.Daemons.of(effects).addDaemon("primary", {
    subcontainer: await sdk.SubContainer.of(
      effects,
      { imageId: "hello-world" },
      sdk.Mounts.of().mountVolume({
        volumeId: "main",
        subpath: null,
        mountpoint: "/data",
        readonly: false,
      }),
      "hello-world-sub",
    ),
    exec: { command: ["hello-world"] },
    ready: {
      display: i18n("Web Interface"),
      fn: () =>
        sdk.healthCheck.checkPortListening(effects, uiPort, {
          successMessage: i18n("The web interface is ready"),
          errorMessage: i18n("The web interface is not ready"),
        }),
    },
    requires: [],
  });
});
```

## Reactive vs One-time Reads

When reading configuration in `main.ts`, you choose how the system responds to changes:

| Method            | Returns             | Behavior on Change                                  |
| ----------------- | ------------------- | --------------------------------------------------- |
| `.once()`         | Parsed content only | Nothing -- value is stale                           |
| `.const(effects)` | Parsed content      | Re-runs the `setupMain` context, restarting daemons |

```typescript
// Reactive: re-runs setupMain when value changes (restarts daemons)
const store = await storeJson.read().const(effects);

// One-time: read once, no re-run on change
const store = await storeJson.read().once();
```

### Subset Reading

Use a mapper function to read only specific fields. This is more efficient and limits reactivity to only the fields you care about:

```typescript
// Read only secretKey - re-runs only if secretKey changes
const secretKey = await storeJson.read((s) => s.secretKey).const(effects);
```

### Other Reading Methods

| Method                         | Purpose                             |
| ------------------------------ | ----------------------------------- |
| `.onChange(effects, callback)` | Register callback for value changes |
| `.watch(effects)`              | Create async iterator of new values |

## Getting Hostnames

Use a mapper function to extract only the data you need. The service only restarts if the mapped result changes, not if other interface properties change:

```typescript
// With mapper - only restarts if hostnames change
const allowedHosts =
  (await sdk.serviceInterface
    .getOwn(effects, "ui", (i) =>
      i?.addressInfo?.format("hostname-info").map((h) => h.hostname.value),
    )
    .const()) || [];

// Without mapper - restarts on any interface change (not recommended)
const uiInterface = await sdk.serviceInterface.getOwn(effects, "ui").const();
const allowedHosts =
  uiInterface?.addressInfo
    ?.format("hostname-info")
    .map((h) => h.hostname.value) ?? [];
```

## Oneshots (Runtime)

Oneshots are tasks that run on every startup before daemons. Use them for idempotent operations like migrations:

```typescript
// change ownership of a directory
.addOneshot('chown', {
  subcontainer,
  exec: {
    command: ['chown', '-R', 'user:user', '/data',],
    user: 'root',
  },
  requires: [],
})
.addOneshot('collectstatic', {
  subcontainer: appSub,
  exec: { command: ['python', 'manage.py', 'collectstatic', '--noinput'] },
  requires: ['migrate'],
})
```

> [!WARNING]
> Do NOT put one-time setup tasks (like `createsuperuser`) in `main.ts` oneshots -- they run on every startup and will fail on subsequent runs. Use `init/initializeService.ts` instead. See [Initialization Patterns](./init.md) for details.

## Exec Command

### Using Upstream Entrypoint

If the upstream Docker image has a compatible `ENTRYPOINT`/`CMD`, use `sdk.useEntrypoint()` instead of specifying a custom command. This is the simplest approach and ensures compatibility with the upstream image:

```typescript
.addDaemon('primary', {
  subcontainer: appSub,
  exec: {
    command: sdk.useEntrypoint(),
  },
  // ...
})
```

You can pass an array of arguments to override the image's `CMD` while keeping the `ENTRYPOINT`:

```typescript
.addDaemon('postgres', {
  subcontainer: postgresSub,
  exec: {
    command: sdk.useEntrypoint(['-c', 'random_page_cost=1.0']),
  },
  // ...
})
```

**When to use `sdk.useEntrypoint()`:**

- Upstream image has a working entrypoint that starts the service correctly
- You want to use the entrypoint but optionally override CMD arguments
- Examples: Ollama, Jellyfin, Vaultwarden, Postgres

### Custom Command

Use a custom command array when you need to bypass the entrypoint entirely:

```typescript
.addDaemon('primary', {
  subcontainer: appSub,
  exec: {
    command: ['/opt/app/bin/start.sh', '--port=' + uiPort],
  },
  // ...
})
```

## Environment Variables

Pass environment variables to a daemon or oneshot via the `env` option on `exec`:

```typescript
.addDaemon('main', {
  subcontainer: appSub,
  exec: {
    command: sdk.useEntrypoint(),
    env: {
      DATABASE_URL: 'sqlite:///data/db.sqlite3',
      SECRET_KEY: store?.secretKey ?? '',
    },
  },
  // ...
})
```

## Health Checks

All user-facing strings must be wrapped with `i18n()`:

```typescript
ready: {
  display: i18n('Web Interface'),  // Shown in UI
  fn: () =>
    sdk.healthCheck.checkPortListening(effects, 8080, {
      successMessage: i18n('Service is ready'),
      errorMessage: i18n('Service is not ready'),
    }),
},
```

## Volume Mounts

```typescript
sdk.Mounts.of()
  // Mount entire volume (directory)
  .mountVolume({
    volumeId: "main",
    subpath: null,
    mountpoint: "/data",
    readonly: false,
  })
  // Mount specific file from volume (requires type: 'file')
  .mountVolume({
    volumeId: "main",
    subpath: "config.py",
    mountpoint: "/app/config.py",
    readonly: true,
    type: "file", // Required when mounting a single file
  });
```

## Writing to Subcontainer Rootfs

For config files that are *generated from code* on every startup (e.g., a Python settings file built from hostnames and secrets), write directly to the subcontainer's rootfs:

```typescript
// Write a generated config to subcontainer rootfs
await writeFile(
  `${appSub.rootfs}/app/config.py`,
  generateConfig({ secretKey, allowedHosts }),
);
```

> [!WARNING]
> If the config file is managed by a FileModel, do NOT read it and write it back to rootfs. Mount it from the volume instead — the file already exists there.

**When to use rootfs vs volume mounts:**

- **Rootfs**: Config files *generated from code* that don't exist on a volume (e.g., built from hostnames, env vars, or templates)
- **Volume mount (directory)**: Mount a directory that contains the config file alongside other persistent data. The config file is just one of many files in the mounted directory.
- **Volume mount (file)**: Mount a single config file with `type: 'file'` when the config lives on a volume that is otherwise unrelated to the container's filesystem.

## Executing Commands in SubContainers

Use `exec` or `execFail` to run commands in a subcontainer:

| Method       | Behavior on Non-zero Exit                                            |
| ------------ | -------------------------------------------------------------------- |
| `exec()`     | Returns result with `exitCode`, `stdout`, `stderr` -- does NOT throw |
| `execFail()` | Throws an error on non-zero exit code                                |

```typescript
// exec() - manual error handling (good for optional/warning cases)
const result = await appSub.exec(["update-ca-certificates"], { user: "root" });
if (result.exitCode !== 0) {
  console.warn("Failed to update CA certificates:", result.stderr);
}

// execFail() - throws on error (good for required commands)
// Uses the default user from the Dockerfile (no need to specify { user: '...' })
await appSub.execFail(["git", "clone", "https://github.com/user/repo.git"]);

// Override user when needed (e.g., run as root)
await appSub.exec(["update-ca-certificates"], { user: "root" });
```

The `user` option is optional. If omitted, commands run as the default user defined in the Dockerfile (`USER` directive). Only specify `{ user: 'root' }` when you need elevated privileges.

**Use `execFail()` when:**

- The command must succeed for the service to work correctly
- You are in `initializeService.ts` and want installation to fail if setup fails
- You want automatic error propagation

**Use `exec()` when:**

- The command failure is not critical (warnings, optional setup)
- You need to inspect the exit code or output regardless of success/failure
- You want custom error handling logic

## Config File Generation

A common pattern is to define a helper function that generates a config file string from your service's configuration values:

```typescript
function generateConfig(config: {
  secretKey: string;
  allowedHosts: string[];
}): string {
  const hostsList = config.allowedHosts.map((h) => `'${h}'`).join(", ");

  return `
SECRET_KEY = '${config.secretKey}'
ALLOWED_HOSTS = [${hostsList}]
DATABASE = '/data/db.sqlite3'
`;
}
```
