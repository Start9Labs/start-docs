# LAN

Connect to your server over your local network using its `.local` mDNS address or direct IP address. This is the fastest connection method, as traffic stays on your LAN and never reaches the Internet.

## Use Case

Local connections are the fastest possible, as they do not reach out to the Internet. You must be connected to the same Local Area Network (LAN) as your server.

## Watch the Video

<div class="yt-video" data-id="lAMI43MC7fQ" data-title="Connecting Locally"></div>

## Option 1: Local domain

During [initial setup](../initial-setup.md), you choose a server name, and your `.local` domain is derived from it. For example, a server named "My Cool Server" gets the domain `my-cool-server.local`. This domain uses [Multicast DNS (mDNS)](https://en.wikipedia.org/wiki/Multicast_DNS) to serve as an alias for your server's LAN IP address. You can change your server name at any time in [System Settings](../system-settings.md).

> [!TIP]
> The local domain is useful because, by default, your router will sometimes change your server's IP address on the LAN. If your server's LAN IP address changes, the local domain will continue to work, even if you move or get a new router!

## Option 2: IP Address

Your router automatically assigns your server an IP address on the LAN. The address can be found (1) in your StartOS dashboard at `System -> StartOS UI`, (2) in your router dashboard, or (3) by `pinging` your server's `.local` domain from the command line of a computer on the same network.

> [!IMPORTANT]
> Your router may unexpectedly change your server's IP address on the LAN. To avoid this, we _highly_ recommend assigning a static IP address. This becomes _necessary_ if you intend to access your server via VPN or clearnet. It also makes the local domain unnecessary. All routers support setting a static IP address for devices on the LAN. Refer to your router's user manual for detailed instructions.

## Private Domains

A private domain is similar to your server's [local domain](#option-1-local-domain), except it also works for [VPN](./vpn.md) connectivity, and it can be _anything_. It can be a real domain you control, a made up domain, or even a domain controlled by someone else.

Similar to your local domain, private domains can only be accessed when connected to the same LAN as your server, either physically or via VPN, and they require trusting your server's Root CA.

### Adding a Private Domain

1. If you haven't already, assign a static IP address to your server on the LAN. Refer to your router's user manual for detailed instructions.

1. On the service interface page, click "Add Domain" on the desired gateway table and select "Private Domain".

1. Enter a fully qualified domain name. It can be _anything_. For example: `domain.com`, `private.domain.internal`, `nextcloud.private`, `nextcloud.fake-tld`, or `facebook.com`.

1. Click "Save".

1. StartOS will automatically test your DNS configuration. If the test passes, the domain is ready to use. If it fails, a setup modal will appear with instructions to configure your DNS server and the ability to re-test.

### DNS for Private Domains

When you add a private domain, StartOS automatically creates a DNS record on its internal DNS server. For this to work, your gateway must use StartOS for DNS. StartOS will test this automatically and guide you through the setup if needed. The details depend on your gateway type:

- **Router**: Set StartOS as your router's primary DNS server. All routers support this feature. Refer to your router's user manual for detailed instructions.

  > [!WARNING]
  > It is possible that StartOS is already using your router for DNS. Therefore you cannot instruct your router to use StartOS for DNS. This is circular. If StartOS detects a potential circular DNS situation, it will warn you. To resolve this issue, override [the DNS servers used by StartOS](#server-dns-settings) to no longer use your router.

- **StartTunnel**: SSH into your StartTunnel VPS and run the following command

      start-tunnel dns defer

If your private domain is a real domain that you control, you can alternatively configure its DNS record at your registrar to resolve to your server's _LAN IP address_. In this case, the StartOS DNS server is not needed.

## Server DNS Settings

StartOS uses the DNS servers provided by your router via [DHCP](https://en.wikipedia.org/wiki/Dynamic_Host_Configuration_Protocol). For most users, the default settings require no changes.

> [!NOTE]
> If you want to use a specific DNS provider (such as Cloudflare or Quad9), it is generally better to configure it in your router so that all devices on your network benefit, not just your server.

To view the current DNS servers, navigate to `System > DNS`.

To override the defaults, select "Static" and provide up to three DNS servers in order of preference.
