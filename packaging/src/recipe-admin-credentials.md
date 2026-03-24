# Prompt User to Create Admin Credentials

After installing a service, the user typically needs admin credentials to log in. The standard pattern creates a critical task during init that points to a hidden action. The action generates a password (or reads one already generated) and displays it to the user. The task blocks the user from ignoring the step.

## Solution

In `setupOnInit` (on install), generate a password and store it in a file model. Call `sdk.action.createOwnTask()` with severity `'critical'` pointing to a hidden action. The action reads the stored password and returns it in a group result with username (unmasked, copyable) and password (masked, copyable). Use `visibility: 'hidden'` so the action only appears via the task.

**Reference:** [Initialization](init.md) · [Tasks](tasks.md) · [Actions](actions.md)

## Examples

See `startos/init/` and `startos/actions/` in: [actual-budget](https://github.com/Start9Labs/actual-budget-startos), [gitea](https://github.com/Start9Labs/gitea-startos), [helipad](https://github.com/Start9Labs/helipad-startos), [lightning-terminal](https://github.com/Start9Labs/lightning-terminal-startos), [lnbits](https://github.com/Start9Labs/lnbits-startos), [nextcloud](https://github.com/Start9Labs/nextcloud-startos), [openclaw](https://github.com/Start9Labs/openclaw-startos), [vaultwarden](https://github.com/Start9Labs/vaultwarden-startos)
