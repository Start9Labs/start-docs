# Tor

Access your server over the Tor network using `.onion` addresses. This method provides anonymous, censorship-resistant connections and requires installing the Tor service from the StartOS marketplace.

## Use Case

This connection method permits hosting services on the _private_ Internet (aka the "Darknet") as anonymous (`.onion`) domains.

There are three reasons you might want this:

1. Unless you share/leak a Tor address, it is totally private _and_ anonymous. Nobody knows it exists, and nobody knows it belongs to you. It is your secure, secret tunnel to the underlying website/API.

1. If you share/leak a Tor address _without_ associating it to your identity (not easy to do), it is anonymous but not private. People know it exists, but nobody knows it belongs to you. By this method, you can anonymously host a censorship-resistant website/API on the private web.

1. If you share/leak a Tor address and _also_ associate it with your identity, it is neither private nor anonymous. People know it exists, and they know it belongs to you. This is useful for hosting an identified yet still censorship-resistant website/API on the private web, or for sharing access to the websites/API with select friends and family.

> [!WARNING]
> It is normal for Tor connections to be slow or unreliable at times.

> [!TIP]
> Tor can also be used for [public access](../public-access/tor.md) by publishing your `.onion` addresses.

## Setting Up Tor

Tor is not included in StartOS by default. To use Tor, you must install the **Tor** service from the marketplace.

1. Go to the Marketplace and install the **Tor** service.

1. Start the Tor service and wait for it to become healthy.

## Managing Onion Services

Once Tor is installed and running, you can create `.onion` addresses for specific service interfaces on your server.

1. Open the Tor service and go to **Actions > Manage Onion Services**.

1. Select a service interface to create an onion address for.

1. To view your onion addresses, go to **Actions > View Onion Addresses**.

> [!TIP]
> When creating an onion service, you can upload a private key to use a vanity address. For instructions on generating a vanity address, see [here](https://community.torproject.org/onion-services/advanced/vanity-addresses/).

> [!NOTE]
> Each onion domain produces two addresses: `HTTP` and `HTTPS`. Because Tor is a secure protocol, it is perfectly safe to use the `HTTP` address. It is also preferable, because it does not require anyone to trust your server's Root CA. Some applications may require `HTTPS`, in which case the certificate is signed by your server's Root CA.

## Connecting over Tor

### Using a Tor Browser

You can connect to your server and installed services from anywhere in the world, privately and anonymously, by visiting their unique `http://....onion` URLs from any Tor-enabled browser.

> [!TIP]
> Recommended Browsers
>
> - Mac, Linux, Windows, Android/Graphene: [Tor Browser](https://torproject.org/download)
> - iOS: [Onion Browser](https://onionbrowser.com)

### Running Tor in the _Background_ on your Phone/Laptop

By running Tor in the background on your phone or laptop, certain apps can connect over Tor, even if the apps themselves do not natively support Tor.

For instructions specific to your device's operating system, use a search engine or AI. This capability is well documented.
