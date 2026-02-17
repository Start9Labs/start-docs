# Holesail

Access your server remotely using Holesail's peer-to-peer tunneling. This method creates direct encrypted connections without port forwarding, static IPs, or centralized servers, and requires installing the Holesail service from the StartOS marketplace.

## Use Case

[Holesail](https://docs.holesail.io/) creates direct, encrypted peer-to-peer tunnels between your devices and your server. No port forwarding, static IP, or centralized servers are required. Traffic flows directly between peers as if they were on the same local network.

This is a good option when:

1. You want fast, private remote access without the complexity of setting up a VPN server.
1. You don't have control over your network (e.g. work, school, shared housing) and cannot configure port forwarding.
1. You want a simple, zero-configuration alternative to Tor that offers better performance.

## Setting Up Holesail

Holesail is not included in StartOS by default. To use Holesail, you must install the **Holesail** service from the marketplace.

1. Go to the Marketplace and install the **Holesail** service.

1. Start the Holesail service and wait for it to become healthy.

## Managing Tunnels

Once Holesail is installed and running, you can create tunnels for specific service interfaces on your server.

1. Open the Holesail service and go to **Actions > Manage Tunnels**.

1. Select a service interface to create a tunnel for. Each tunnel produces a unique connection key.

1. To view your tunnel connection keys, go to **Actions > View Tunnels**.

> [!NOTE]
> Anyone with the connection key can access the tunnel. Treat connection keys like passwords — only share them with trusted devices.

## Connecting over Holesail

To connect to a Holesail tunnel from a client device, install the Holesail client and use the connection key provided by your server.

For client installation and usage instructions, see the [Holesail documentation](https://docs.holesail.io/).
