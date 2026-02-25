# Clearnet

Make your services publicly reachable on the Internet using standard domains (`.com`, `.net`, etc.) or public IP addresses. This requires a gateway, a domain name, and DNS configuration.

## Use Case

This connection method permits hosting a service interface on the public Internet.

## Choosing a Gateway

When hosting services on the clearnet, anyone who connects will know the IP address of the gateway used. Knowing a gateway's IP address reveals its approximate geographic location:

| Geographic Location     | Detection Accuracy    |
| ----------------------- | --------------------- |
| Country                 | 99%                   |
| State / Region          | 95-99%                |
| City (large metro)      | 60–80%                |
| Zip Code / Neighborhood | 30–50%                |
| Exact Street Address    | Requires ISP subpoena |

If your gateway is your home router, you are revealing the approximate location of your home. If your gateway is a VPS running StartTunnel, you are revealing the approximate location of the VPS, not your home.

Which gateway you select will depend on your threat model and budget:

- **Router**: If you have no issue revealing your approximate location, use your router as your clearnet gateway (free). Since home IP addresses can change without warning, we highly recommend setting up [dynamic DNS](https://en.wikipedia.org/wiki/Dynamic_DNS). Many routers offer this as a built-in feature. If not, third-party services are available. Without dynamic DNS, a change to your home IP will make your domains unreachable until you update their DNS records.

  > [!WARNING]
  > If your Internet Service Provider (ISP) uses <a href="https://en.wikipedia.org/wiki/Carrier-grade_NAT" target="_blank" noreferrer>Carrier-grade NAT (CGNAT)</a>, such as Starlink, it means you share an IP address with other customers. It is not possible to use your router as a clearnet gateway. You must use StartTunnel instead.

- **StartTunnel**: If you want to obfuscate your home IP address, or your ISP uses CGNAT, you can use a StartTunnel gateway. Refer to the [StartTunnel guide](/start-tunnel/).

## Adding a Public Domain

With few exceptions, you should add a domain to your service interface so that you and others can access it seamlessly, just like any other website or API.

1. On the service interface page, click "Add Domain" on the desired gateway's table and select "Public Domain".

   > [!WARNING]
   > CGNAT gateways, such as Starlink, cannot be used for clearnet hosting. You must use a StartTunnel gateway. Refer to the [StartTunnel guide](/start-tunnel/).

1. Enter the fully qualified domain name. For example, if you control `domain.com`, you could enter `domain.com` or `public.domain.com` or `nextcloud.public.domain.com`, etc.

1. Select a Certificate Authority to sign the certificate for this domain.
   - **Local Root CA**: Good for personal access. Only devices that have downloaded and trusted your server's Root CA will be able to access the domain without issue.
   - **Let's Encrypt**: Good for public access. All devices trust Let's Encrypt certificates by default.

1. Click "Save".

1. StartOS will automatically test your DNS record and port forwarding. If both pass, the domain is ready to use. If either test fails, a setup modal will appear showing the failing tests with instructions to remedy and the ability to re-test.

## Configuring DNS

StartOS tests DNS automatically when you add or enable a public domain, and will guide you through the setup if the test fails. For reference, here is what is needed:

1. Access your domain's DNS settings, usually in the registrar where you originally leased the domain.

1. Create a DNS record that points your domain to your gateway's public IP address. If you use subdomains, consider creating a wildcard record (e.g., `*.domain.com`) so that future subdomains work without additional records.

   > [!TIP]
   > It might take a few minutes for DNS changes to propagate. You can check propagation using [https://dnschecker.org](https://dnschecker.org).

## Port Forwarding

To expose a public domain or public IP address to the Internet, the appropriate port must be forwarded in the corresponding gateway. StartOS tests port forwarding automatically when you add or enable a public address, and will guide you through the setup if the test fails.

> [!TIP]
> Most websites and APIs on the Internet are hosted on port `443`. Port `443` is so common, in fact, that apps and browsers _infer_ its presence. The _absence_ of a port _means_ the port is `443`. With rare exceptions, domains on StartOS also use port `443`, and that is why your domains usually do not display a port. The port forwarding rule needed for these standard domains is always the same, which means you only have to do it once!

How you create a port forwarding rule depends on the type of gateway.

- **Routers**: Port forwarding is supported by all routers and easy to do. Refer to your router's manual for instructions.

- **StartTunnel**: Refer to the [StartTunnel Port Forwarding guide](/start-tunnel/user-manual/port-forwarding.html).
