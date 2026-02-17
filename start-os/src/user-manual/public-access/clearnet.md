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

1. On the service interface page in the "Public Domains" section, click "Add".

1. Enter the fully qualified domain name. For example, if you control `domain.com`, you could enter `domain.com` or `public.domain.com` or `nextcloud.public.domain.com`, etc.

1. Select a gateway to use for this domain. For help selecting a gateway, see [Gateways](../gateways.md)

   > [!WARNING]
   > CGNAT gateways, such as Starlink, cannot be used for clearnet hosting. You must create a new gateway with StartTunnel. Refer to the [StartTunnel guide](/start-tunnel/).

1. Select a Certificate Authority to use for this domain.
   - **Local Root Ca**: Good for personal access. Only devices that have downloaded and trusted your server's Root CA will be able to access the domain without issue.
   - **Let's Encrypt**: Good for public access. All devices trust Let's Encrypt certificates by default.

1. Click "Save".

1. If StartOS does not detect a satisfactory DNS record, you will be asked to create one. Continue to the section below.

1. A new `https://<your-public-domain>` address will appear in the "Addresses" table.

## Configuring DNS

1. Access your domain's DNS settings, usually in the registrar where you originally leased the domain.

1. In StartOS, find your domain, click "View DNS" from the menu, and create _one_ of the displayed records. Depending on the number of subdomains in your domain, you may see multiple options. For example, if your domain is `nextcloud.public.domain.com`, you will see options for `nextcloud.public.domain.com`, `*.public.domain.com`, and `*.domain.com`. In most cases, we recommend choosing the record with the least number of segments. In this case, `*.domain.com`. Then, next time you use _any_ subdomain of `domain.com`, you will _not_ need to create another DNS record.

1. Click "Test" to ensure the record was successfully detected by StartOS.

   > [!WARNING]
   > It might take a few minutes for your domain changes to take effect. You can test it using [https://dnschecker.org](https://dnschecker.org).

## Port Forwarding

To expose your `PUBLIC_IP:port` or `domain` address to the Internet, you must create a port forwarding rule in its corresponding gateway.

> [!TIP]
> Most websites and APIs on the Internet are hosted on port `443`. Port `443` is so common, in fact, that apps and browsers _infer_ its presence. The _absence_ of a port _means_ the port is `443`. With rare exceptions, domains on StartOS also use port `443`, and that is why your domains usually do not display a port. The port forwarding rule needed for these standard domains is always the same, which means you only have to do it once!

How you create a port forwarding rule depends on the type of gateway.

- **Routers**: port forwarding is supported by all routers and easy to do. Refer to your router's manual for instructions.

- **StartTunnel**: refer to the [StartTunnel Port Forwarding guide](/start-tunnel/user-manual/port-forwarding.html)
