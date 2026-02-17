---
title: "Tor"
description: "Use Tor onion addresses for censorship-resistant and optionally anonymous public hosting."
section: "startos/user-manual"
type: "guide"
keywords: ["tor", "onion", "public", "hosting", "censorship", "anonymous"]
---

# Tor

Tor onion addresses (`.onion`) can be used for public hosting. Unlike clearnet domains, onion addresses do not require purchasing a domain, configuring DNS, or opening ports. Anyone with a Tor-enabled browser can reach them.

## Why Use Tor for Public Hosting

- **Censorship resistance**. Onion services cannot be taken down by domain registrars, DNS providers, or ISPs. As long as your server is running, the address is reachable.

- **Anonymity** (if done carefully). If you publish an onion address without associating it with your identity, observers can access your service but cannot determine who operates it. Achieving true anonymity requires careful operational security — for example, never linking the address to your real identity, and not leaking metadata that could be correlated.

- **No infrastructure dependencies**. You do not need a static IP, a domain name, or port forwarding. Tor handles routing entirely through its overlay network.

## Setup

Tor public hosting uses the same Tor service as [private access](../private-access/tor.md). Follow that guide to install Tor from the marketplace, create onion services, and view your onion addresses.

The difference is simply in how you use the addresses: keeping them secret (private access) vs. sharing them publicly (public access).

> [!NOTE]
> Each onion domain produces two addresses: `HTTP` and `HTTPS`. Because Tor is a secure protocol, it is perfectly safe to use the `HTTP` address. It is also preferable, because it does not require visitors to trust your server's Root CA.
