# Depend on Another Service

When your service needs another StartOS service (e.g., Bitcoin Core for a wallet, or PostgreSQL from a shared instance), declare it as a dependency. You can require it to be installed, running, or healthy, and optionally pin a version range.

## Solution

In `setupDependencies()`, return an object mapping dependency package IDs to their requirements: `kind: 'running'` (must be running and healthy), `kind: 'exists'` (just installed), a `versionRange`, and `healthChecks` specifying which of the dependency's health checks must pass. Read the dependency's connection info in `setupMain` either via `sdk.serviceInterface.get()` or directly as `http://<package-id>.startos:<port>`.

**Reference:** [Dependencies](dependencies.md)

## Examples

See `startos/dependencies.ts` in: [electrs](https://github.com/Start9Labs/electrs-startos), [fulcrum](https://github.com/Start9Labs/fulcrum-startos), [jam](https://github.com/Start9Labs/jam-startos), [lightning-terminal](https://github.com/Start9Labs/lightning-terminal-startos), [lnbits](https://github.com/Start9Labs/lnbits-startos), [lnd](https://github.com/Start9Labs/lnd-startos), [mempool](https://github.com/Start9Labs/mempool-startos), [open-webui](https://github.com/Start9Labs/open-webui-startos), [public-pool](https://github.com/Start9Labs/public-pool-startos), [robosats](https://github.com/Start9Labs/robosats-startos), [bitcoin-explorer](https://github.com/Start9Labs/bitcoin-explorer-startos), [helipad](https://github.com/Start9Labs/helipad-startos), [cln](https://github.com/Start9Labs/cln-startos), [btcpayserver](https://github.com/Start9Labs/btcpayserver-startos), [albyhub](https://github.com/Start9Labs/albyhub-startos), [immich](https://github.com/Start9Labs/immich-startos), [jellyfin](https://github.com/Start9Labs/jellyfin-startos), [start9-pages](https://github.com/Start9Labs/start9-pages-startos), [ride-the-lightning](https://github.com/Start9Labs/ride-the-lightning-startos)
