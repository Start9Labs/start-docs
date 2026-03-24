# Recipes

This is the intent-driven entry point for StartOS service packaging. Each recipe answers one question and connects you to the reference documentation and real-world package code you need. Start here if you know *what* you want to accomplish but not *how* to accomplish it.

## Configuration

| Recipe | Description |
|--------|-------------|
| [Set Up a Basic Service](recipe-basic-service.md) | Minimal single-container service with a web UI, health check, and backup |
| [Create Configuration Actions](recipe-config-actions.md) | Let users configure your service through actions with input forms |
| [Generate Config Files](recipe-config-files.md) | Produce YAML, TOML, INI, JSON, or ENV files from user settings using FileModel |
| [Pass Config via Environment Variables](recipe-env-vars.md) | Configure your service through environment variables in the daemon definition |
| [Hardcode Config Values](recipe-hardcode-config.md) | Lock down ports, paths, or auth modes so users cannot change them |
| [Set a Primary URL](recipe-primary-url.md) | Let users choose which hostname the service uses for links, invites, and federation |
| [Set Up SMTP / Email](recipe-smtp.md) | Let users configure email sending with disabled/system/custom modes |

## Credentials & Access Control

| Recipe | Description |
|--------|-------------|
| [Auto-Generate Internal Secrets](recipe-internal-secrets.md) | Generate passwords or tokens in init for internal use (database auth, secret keys) |
| [Prompt User to Create Admin Credentials](recipe-admin-credentials.md) | Critical task on install that triggers an action to generate and display a password |
| [Reset a Password](recipe-reset-password.md) | Action that regenerates credentials and updates the running application |
| [Gate User Registration](recipe-registration-gating.md) | Toggle action that enables/disables public signups with a dynamic label |

## Setup & Lifecycle

| Recipe | Description |
|--------|-------------|
| [Require Setup Before Starting](recipe-require-setup.md) | Block service startup with a critical task until the user completes configuration |
| [Run One-Time Setup on Install](recipe-install-init.md) | Generate passwords, seed databases, or bootstrap config on first install only |
| [Bootstrap via Temporary Daemon Chain](recipe-run-until-success.md) | Start the service during init, call its API to bootstrap, then tear it down |
| [Handle Version Upgrades](recipe-version-migrations.md) | Migrate data between package versions using the version graph |
| [Handle Restore from Backup](recipe-restore-init.md) | Re-register services or fix state after restoring from backup |

## Daemons & Containers

| Recipe | Description |
|--------|-------------|
| [Run Multiple Containers](recipe-multi-daemon.md) | App + database, app + cache, app + worker — multi-daemon setups |
| [Run a PostgreSQL Sidecar](recipe-postgresql.md) | Password generation, pg_isready health check, pg_dump backup |
| [Run a MySQL/MariaDB Sidecar](recipe-mysql.md) | MySQL daemon, health check, mysqldump backup and restore |
| [Run a Redis/Valkey Cache](recipe-valkey.md) | Ephemeral cache daemon with valkey-cli ping health check |
| [Create Dynamic Daemons](recipe-dynamic-daemons.md) | Variable number of daemons based on user configuration |
| [Run a One-Shot Command](recipe-oneshot.md) | Migrations, file ownership fixes, or setup scripts before the main daemon starts |

## Networking

| Recipe | Description |
|--------|-------------|
| [Expose a Web UI](recipe-web-ui.md) | Single HTTP interface for browser access |
| [Expose Multiple Interfaces](recipe-multi-interface.md) | RPC, API, peer, WebSocket, or SSH on different ports |
| [Expose an API-Only Interface](recipe-api-interface.md) | Programmatic access with no browser UI |

## Dependencies

| Recipe | Description |
|--------|-------------|
| [Depend on Another Service](recipe-dependency.md) | Declare a dependency, read its connection info, and auto-configure |
| [Enforce Settings on a Dependency](recipe-enforce-dependency.md) | Create a cross-service task that requires specific dependency configuration |
| [Mount Volumes from Another Service](recipe-mount-dependency.md) | Read-only access to a dependency's data volume |
| [Support Alternative Dependencies](recipe-alternative-deps.md) | Let users choose between backends (e.g., LND vs CLN) |

## Data & Health

| Recipe | Description |
|--------|-------------|
| [Back Up and Restore Data](recipe-backups.md) | Volume snapshots, pg_dump, mysqldump, and incremental rsync strategies |
| [Add Standalone Health Checks](recipe-health-checks.md) | Sync progress, reachability, and other ongoing checks beyond daemon readiness |
