# CLI Reference

StartOS can be fully managed from the command line using `start-cli`. Connect via [SSH](ssh.md) and run:

```
start-cli --help
```

## Authentication

Login, logout, and manage sessions.

```bash
start-cli auth login
start-cli auth logout
start-cli auth reset-password
start-cli auth session list
start-cli auth session kill
```

## Server

Restart, shutdown, update, and configure the server.

```bash
start-cli server restart
start-cli server shutdown
start-cli server update
start-cli server logs
start-cli server kernel-logs
start-cli server metrics
start-cli server time
start-cli server update-firmware
start-cli server set-smtp
start-cli server test-smtp
start-cli server clear-smtp
start-cli server set-language
start-cli server set-keyboard
start-cli server set-ifconfig-url
start-cli server experimental governor
start-cli server experimental zram
```

## Packages

Install, manage, and monitor services.

```bash
start-cli package list
start-cli package install
start-cli package start <PACKAGE>
start-cli package stop <PACKAGE>
start-cli package restart <PACKAGE>
start-cli package uninstall <PACKAGE>
start-cli package logs <PACKAGE>
start-cli package action run <PACKAGE> <ACTION>
start-cli package rebuild <PACKAGE>
start-cli package set-outbound-gateway <PACKAGE>
```

## Backups

Create backups and manage backup targets (network shares).

```bash
start-cli backup create
start-cli backup target list
start-cli backup target cifs
start-cli backup target mount <TARGET>
start-cli backup target umount <TARGET>
start-cli package backup restore
```

## Networking

Manage gateways, DNS, ACME certificates, and tunnels.

```bash
# Gateways
start-cli net gateway list
start-cli net gateway set-name <GATEWAY> <NAME>
start-cli net gateway set-default-outbound <GATEWAY>
start-cli net gateway check-dns <GATEWAY>
start-cli net gateway check-port <GATEWAY>
start-cli net gateway forget <GATEWAY>

# DNS
start-cli net dns set-static
start-cli net dns query <DOMAIN>

# ACME (Let's Encrypt)
start-cli net acme init
start-cli net acme remove

# Tunnels
start-cli net tunnel add
start-cli net tunnel remove
```

## SSH

Manage authorized SSH keys.

```bash
start-cli ssh add
start-cli ssh list
start-cli ssh remove
```

## WiFi

Connect to and manage wireless networks.

```bash
start-cli wifi add
start-cli wifi connect
start-cli wifi remove
start-cli wifi get
start-cli wifi available
start-cli wifi country
start-cli wifi set-enabled
```

## Notifications

View and manage system notifications.

```bash
start-cli notification list
start-cli notification mark-seen
start-cli notification remove
```

## Kiosk

Enable or disable kiosk mode for the local display.

```bash
start-cli kiosk enable
start-cli kiosk disable
```

## Disk

List disks and repair filesystem issues.

```bash
start-cli disk list
start-cli disk repair
```

## Diagnostics

Troubleshoot issues with logs and container rebuilds.

```bash
start-cli diagnostic logs
start-cli diagnostic kernel-logs
start-cli diagnostic error
start-cli diagnostic restart
start-cli diagnostic rebuild
```
