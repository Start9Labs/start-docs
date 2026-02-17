# Gateways

A gateway is what connects your server to the Internet. Gateways handle both _inbound_ traffic (people connecting to your server) and _outbound_ traffic (your server connecting to the Internet).

## Inbound Gateways

Your router is an inbound gateway. StartTunnel is also an inbound gateway. Both create secure local networks that, by default, _cannot_ be accessed by devices outside the network.

> [!NOTE]
> If you are running StartOS on a VPS with a public IP address, there is no local network. Your gateway is inherently public and open to the Internet.

Think of an inbound gateway as a defense perimeter with hundreds of locked doors, each door leading to a unique service interface. For example, one door might say "Vaultwarden UI", another might say "Bitcoin RPC", and yet another might say "Bitcoin P2P".

If you want to let a specific person through a particular door, you give them a key. This is the equivalent of giving someone private VPN access to a specific service interface. If you want to let _everyone_ through a particular door, you remove the lock altogether. This is the equivalent of forwarding a port in your gateway, thereby exposing a particular service interface or domain to the public Internet.

For guidance on choosing a gateway for clearnet hosting, see [Clearnet](public-access/clearnet.md#choosing-a-gateway).

## Outbound Gateways

Outbound gateways control how traffic _leaves_ your server. By default, the primary Ethernet (or WiFi) connection is the system default outbound gateway, meaning all outbound traffic from all services goes out through your router to your ISP.

You can change the default outbound gateway to route all outbound traffic through a different WireGuard gateway. For example, you could route all traffic through a commercial VPN provider such as Mullvad or ProtonVPN.

You can also override the outbound gateway on a per-service basis. See [Per-Service Overrides](#per-service-overrides).

## Adding a Gateway

To add a new gateway, navigate to `System > Gateways` and click "Add".

1. Upload or paste the WireGuard configuration file from your VPN provider or StartTunnel instance.

   StartOS will automatically detect the gateway type:
   - **StartTunnel** config files are recognized and marked as **inbound-outbound** gateways, capable of both receiving inbound connections and routing outbound traffic.
   - **All other** WireGuard configs (e.g. Mullvad, ProtonVPN, or any standard WireGuard provider) are marked as **outbound-only** gateways.

1. Optionally, set the new gateway as the system default outbound gateway.

> [!TIP]
> You can also set the default outbound gateway later by clicking the overflow menu on the gateway row.

## Per-Service Outbound Overrides

By default, all services use the system default outbound gateway. To route a specific service's traffic through a different gateway:

1. Navigate to the service and go to **Actions > Set Outbound Gateway**.

1. Select a gateway. All interfaces for that service will use the selected gateway instead of the system default.

This is useful for routing sensitive services through a commercial VPN while leaving other services on the default connection.
