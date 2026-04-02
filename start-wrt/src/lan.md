# LAN Settings

The LAN (Local Area Network) page configures the router's internal network addressing. Most users will not need to change these settings — the defaults work for typical home networks. Navigate to `Network > LAN Settings`.

## IPv4

Configure the router's LAN IPv4 addressing.

- **Network Block** — Select the `/16` private IP block for your network. The first octet determines the block: `192.168.x.x`, `10.0.x.x`, or `172.16.x.x`. Each [Security Profile](security-profiles.md) receives its own `/24` subnet within this block, allowing up to 256 separate subnets with 254 devices each.

- **Router IP** — The router's address within the default subnet. The first two octets are determined by the Network Block, the third octet is configurable (0–254), and the fourth octet is always `1`. For example, with the `192.168.x.x` block and third octet `1`, the router's IP is `192.168.1.1`. This is the address you use to access the web interface.

> [!NOTE]
> DHCP is managed automatically for each Security Profile. You do not need to configure DHCP ranges or lease times.

> [!WARNING]
> Changing the Network Block or Router IP changes the router's LAN address. You will need to navigate to the new address to access the web interface. If any inbound VPN servers exist, they will be deleted because their client configurations become invalid with the new addressing.

## IPv6

Configure IPv6 for the LAN if your ISP supports it.

- **SLAAC** — Toggle to enable or disable IPv6 on the LAN via Stateless Address Autoconfiguration. When enabled, devices generate their own IPv6 addresses from the router's advertised prefix.

- **Prefix Length** — Shown when SLAAC is enabled. The LAN IPv6 prefix length must be larger (a higher number) than your WAN prefix to create a valid subnet. For example, if your ISP assigns you a `/48` prefix, you can use `/56`, `/60`, or `/64` for the LAN. A `/64` is recommended for most home networks.

> [!NOTE]
> LAN IPv6 requires WAN IPv6 to be enabled first. See [WAN Settings](wan.md#ipv6). If published port rules use IPv6, SLAAC cannot be disabled until those rules are removed.
