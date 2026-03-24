# Set Up a Basic Service

A minimal StartOS service: one container, one web UI, one health check, one backup volume. This is the starting point for any new package — every other recipe builds on this foundation.

## Solution

Define a daemon in `setupMain()` with one subcontainer, mount a volume, and add a `checkPortListening` health check. Define a single HTTP interface in `setupInterfaces()` using `MultiHost.of()` and `createInterface()`. Define backups with `sdk.Backups.ofVolumes()` to back up the data volume.

**Reference:** [Main](main.md) · [Interfaces](interfaces.md)

## Examples

See `startos/main.ts`, `startos/interfaces.ts`, and `startos/backups.ts` in: [hello-world](https://github.com/Start9Labs/hello-world-startos), [actual-budget](https://github.com/Start9Labs/actual-budget-startos), [filebrowser](https://github.com/Start9Labs/filebrowser-startos), [uptime-kuma](https://github.com/Start9Labs/uptime-kuma-startos), [myspeed](https://github.com/Start9Labs/myspeed-startos), [ollama](https://github.com/Start9Labs/ollama-startos), [phoenixd](https://github.com/Start9Labs/phoenixd-startos)
