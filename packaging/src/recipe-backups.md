# Back Up and Restore Data

Every StartOS package must define a backup strategy. The SDK provides builders for common patterns: simple volume snapshots, PostgreSQL dumps, MySQL dumps, and incremental rsync for large datasets.

## Solution

Use `sdk.setupBackups()` with the appropriate builder. `sdk.Backups.ofVolumes('main')` for simple volume snapshots. `sdk.Backups.withPgDump()` for PostgreSQL (handles dump and restore). `sdk.Backups.withMysqlDump()` for MySQL/MariaDB. Chain `.addVolume('name')` for additional volumes. Use `.addSync({ dataPath, backupPath })` instead of `.addVolume()` for large, mostly-unchanged datasets (user uploads, media) — rsync is incremental and much faster than full volume copies.

**Reference:** [Main](main.md) · [File Models](file-models.md)

## Examples

See `startos/backups.ts` in: [hello-world](https://github.com/Start9Labs/hello-world-startos) (simple volume), [spliit](https://github.com/Start9Labs/spliit-startos) (pg_dump), [ghost](https://github.com/Start9Labs/ghost-startos) (mysqldump), [nextcloud](https://github.com/Start9Labs/nextcloud-startos) (pg_dump + rsync), [immich](https://github.com/Start9Labs/immich-startos) (pg_dump + rsync)
