# Versions

StartOS uses Extended Versioning (ExVer) to manage package versions, allowing downstream maintainers to release updates without upstream changes.

## Version Format

```
[#flavor:]<upstream>[-upstream-prerelease]:<downstream>[-downstream-prerelease]
```

| Component | Description | Example |
|-----------|-------------|---------|
| `flavor` | Optional variant for diverging forks | `#libre:` |
| `upstream` | Upstream project version (SemVer) | `26.0.0` |
| `upstream-prerelease` | Upstream prerelease suffix | `-beta.1` |
| `downstream` | StartOS wrapper revision | `0`, `1`, `2` |
| `downstream-prerelease` | Wrapper prerelease suffix | `-alpha.0`, `-beta.0` |

### Flavor

Flavors are for diverging forks of a project that maintain separate version histories. Example: if a project forks into "libre" and "pro" editions that diverge significantly, each would have its own flavor prefix.

> [!NOTE]
> Do NOT use flavors for hardware variants (like GPU types) -- those should be handled via build configuration.

### Examples

| Version String | Upstream | Downstream |
|----------------|----------|------------|
| `26.0.0:0` | 26.0.0 (stable) | 0 (stable) |
| `26.0.0:0-beta.0` | 26.0.0 (stable) | 0-beta.0 |
| `26.0.0-rc.1:0-alpha.0` | 26.0.0-rc.1 | 0-alpha.0 |
| `0.13.5:0-alpha.0` | 0.13.5 (stable) | 0-alpha.0 |
| `2.3.2:1-beta.0` | 2.3.2 (stable) | 1-beta.0 |

### Version Ordering

Versions are compared by:

1. Upstream version (most significant)
2. Upstream prerelease (stable > rc > beta > alpha)
3. Downstream revision
4. Downstream prerelease (stable > rc > beta > alpha)

Example ordering (lowest to highest):

- `1.0.0-alpha.0:0`
- `1.0.0-beta.0:0`
- `1.0.0:0-alpha.0`
- `1.0.0:0-beta.0`
- `1.0.0:0` (fully stable)
- `1.0.0:1-alpha.0`
- `1.0.0:1`
- `1.1.0:0-alpha.0`

## Choosing a Version

When creating a new package:

1. **Select the latest stable upstream version** -- avoid prereleases (alpha, beta, rc) unless necessary.
2. **Match the Docker image tag** -- the version in `manifest/index.ts` `images.*.source.dockerTag` must match the upstream version.
3. **Match the git submodule** -- if using a submodule, check out the corresponding tag.
4. **Start downstream at 0** -- increment only when making wrapper-only changes.
5. **Start downstream as alpha or beta** -- use `-alpha.0` or `-beta.0` for initial releases.

### Version Consistency Checklist

Ensure these all match for upstream version `X.Y.Z`:

- Version file exists: `startos/install/versions/vX.Y.Z.0.a0.ts`
- Version string matches: `version: 'X.Y.Z:0-alpha.0'` in VersionInfo
- Docker tag matches: `dockerTag: 'image:X.Y.Z'` in `manifest/index.ts` (if using pre-built image)
- Git submodule checked out to `vX.Y.Z` tag (if applicable)

## File Structure

```
startos/install/versions/
├── index.ts              # Exports current and historical versions
├── v1.0.0.0.a0.ts        # Version 1.0.0:0-alpha.0
├── v1.0.0.0.ts           # Version 1.0.0:0 (stable)
└── v1.1.0.0.a0.ts        # Version 1.1.0:0-alpha.0
```

### Version File Naming

Convert the version string to a filename:

- Replace `.` and `:` with `.`
- Replace `-alpha.` with `.a`
- Replace `-beta.` with `.b`
- Prefix with `v`

| Version | Filename |
|---------|----------|
| `26.0.0:0-beta.0` | `v26.0.0.0.b0.ts` |
| `0.13.5:0-alpha.0` | `v0.13.5.0.a0.ts` |
| `2.3.2:1` | `v2.3.2.1.ts` |

### Version File Template

```typescript
import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const v_X_Y_Z_0_a0 = VersionInfo.of({
  version: 'X.Y.Z:0-alpha.0',
  releaseNotes: {
    en_US: 'Initial release for StartOS',
    es_ES: 'Version inicial para StartOS',
    de_DE: 'Erstveeroffentlichung fuer StartOS',
    pl_PL: 'Pierwsze wydanie dla StartOS',
    fr_FR: 'Version initiale pour StartOS',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,  // Use for initial versions or breaking changes
  },
})
```

### index.ts

```typescript
export { v_X_Y_Z_0_a0 as current } from './vX.Y.Z.0.a0'
export const other = []  // Add previous versions here for migrations
```

## Incrementing Versions

### Upstream Update

When the upstream project releases a new version:

1. Update git submodule to new tag
2. Update `dockerTag` in [manifest/index.ts](./manifest.md)
3. Create new version file with new upstream version
4. Reset downstream to 0

### Wrapper-Only Changes

When making changes to the StartOS wrapper without upstream changes:

1. Keep upstream version the same
2. Increment downstream revision
3. Create new version file

### Promoting Prereleases

To promote from alpha to beta to stable:

1. Create new version file without prerelease suffix (or with next stage)
2. Update `index.ts` to export new version as current
3. Move old version to `other` array

## Migrations

Migrations run when users update between versions:

```typescript
migrations: {
  up: async ({ effects }) => {
    // Code to migrate from previous version
    // Access volumes, update configs, etc.
  },
  down: async ({ effects }) => {
    // Code to rollback (if possible)
  },
}
```

Use `IMPOSSIBLE` for the `down` migration when:

- It is the initial version (nothing to roll back to)
- The migration involves breaking changes that cannot be reversed

```typescript
migrations: {
  up: async ({ effects }) => {
    // Migration logic
  },
  down: IMPOSSIBLE,
}
```

> [!WARNING]
> Migrations are only for migrating data that is _not_ migrated by the upstream service itself.

## preInstall vs setupOnInit

The `preInstall` function in `versionGraph.ts` and custom init functions registered via `setupOnInit` both run during installation, but at different points in the init sequence.

### Use preInstall for:

- Bootstrapping config files (writing initial FileModel values)
- Generating passwords and secrets
- Any setup that does **not** depend on interfaces, actions, or other init steps

`preInstall` runs early — before interfaces, dependencies, and actions are set up.

```typescript
// versionGraph.ts
export const versionGraph = VersionGraph.of({
  current,
  other,
  preInstall: async (effects) => {
    const postgresPassword = utils.getDefaultString({ charset: 'a-z,A-Z,0-9', len: 22 })
    await storeJson.write(effects, { postgresPassword })
    await configToml.write(effects, { /* initial config */ })
  },
})
```

### Use setupOnInit for:

- Creating tasks (tasks reference actions, which aren't available until after `actions` runs in the init sequence)
- Any setup that depends on a prior init step

```typescript
// init/initializeService.ts
export const initializeService = sdk.setupOnInit(async (effects, kind) => {
  if (kind !== 'install') return
  await sdk.action.createOwnTask(effects, toggleRegistrations, 'important', {
    reason: 'After creating your admin account, disable registrations.',
  })
})
```

> [!WARNING]
> Do **not** create tasks in `preInstall`. Tasks reference actions, and actions are not registered until later in the init sequence. Creating a task in `preInstall` will fail.
