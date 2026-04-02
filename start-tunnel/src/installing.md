# Installing

Install StartTunnel on a Debian VPS by renting a server, running the one-line installer script, and initializing the web interface. The entire process takes just a few minutes.

## Get a VPS

Rent a cheap Debian 12+ VPS with a dedicated public IP. Minimum CPU/RAM/disk is fine. For bandwidth, no need to exceed your home Internet's upload speed.

### Requirements

- Debian 13
- Root access
- Public IP (required for clearnet port forwarding; not required for private VPN use)

> [!IMPORTANT]
> StartTunnel is designed to be the sole application on your VPS. The installer disables UFW and manages its own firewall rules via iptables. Do not run other Internet-facing services on the same VPS.

## Run the installer

SSH into your VPS and run:

```bash
curl -sSL https://start9labs.github.io/start-tunnel/install.sh | sh
```

> [!NOTE]
> If DNS resolution is not working on your VPS, the installer will configure public DNS resolvers (Google, Cloudflare, Quad9) and back up your existing `/etc/resolv.conf`.

## Initialize the web interface

StartTunnel can be fully managed from the command line, but it also offers a web UI for convenience. To set it up, run:

```bash
start-tunnel web init
```

This initializes a web server, creates a random password, and configures an SSL certificate. You will be prompted to either generate a new Root CA or provide your own certificate.

Save the URL and password to your password manager.

> [!NOTE]
> The URL, password, and certificate are only for accessing your StartTunnel's web user interface. None are needed to use StartTunnel from the command line.

### Certificate options

When prompted for a certificate, you have two choices:

{{#tabs global="tunnel-cert" }}
{{#tab name="Use your StartOS Root CA (recommended)" }}

If you already have a StartOS server and have [trusted its Root CA](/start-os/trust-ca.html), you can sign the StartTunnel certificate with that same CA. This means your browser will trust the StartTunnel web UI automatically — no additional certificate to manage.

1. On your StartOS server, generate a certificate for your StartTunnel's hostname or IP:

   ```bash
   start-cli net ssl generate-certificate <HOSTNAME_OR_IP>
   ```

   This outputs a private key and certificate chain in PEM format.

1. During `start-tunnel web init`, when prompted for a certificate, select **Provide**.

1. Paste the **private key** first and press Enter. You may need to press Enter an extra time for it to be accepted.

1. Paste the **certificate chain** next and press Enter. Again, you may need to press Enter an extra time.

{{#endtab }}
{{#tab name="Generate a new Root CA" }}

Select **Generate** when prompted. StartTunnel will create its own Root CA and use it to sign a certificate. The Root CA will be printed to the console.

Save the URL and password to your password manager, then trust the Root CA on each device that will access the web UI. Select your operating system:

{{#tabs global="platform" }}
{{#tab name="Mac" }}

1. Open the Terminal app.

1. Type or paste the following command (**do not** press Return yet):

   ```
   pbpaste > ~/Desktop/tunnel-ca.crt
   ```

   Again, **do not** press Return yet.

1. Copy your Root CA to clipboard from the console output (including `-----BEGIN CERTIFICATE-----` and `-----END CERTIFICATE-----`). **do not** paste it anywhere.

1. Back in Terminal, just press Return. The file `tunnel-ca.crt` is saved to your Desktop.

1. [Trust the certificate](/start-os/trust-ca.html?platform=Mac).

{{#endtab }}
{{#tab name="Windows" }}

1. Open the Notepad app.

1. Copy and paste your Root CA from the console output.

1. Save the file as `tunnel-ca.crt` (plaintext).

1. [Trust the certificate](/start-os/trust-ca.html?platform=Windows).

{{#endtab }}
{{#tab name="Linux" }}

1. Open a text editor (gedit, nano, etc.).

1. Copy and paste your Root CA from the console output.

1. Save the file as `tunnel-ca.crt` (plaintext).

1. [Trust the certificate](/start-os/trust-ca.html?platform=Debian+%2F+Ubuntu).

{{#endtab }}
{{#tab name="Android / Graphene" }}

1. Save the Root CA to a `tunnel-ca.crt` file on your computer (see Mac, Windows, or Linux tabs).

1. Send the `tunnel-ca.crt` file to your phone (email, messaging app, etc.).

1. [Trust the certificate](/start-os/trust-ca.html?platform=Android+%2F+Graphene).

{{#endtab }}
{{#tab name="iOS" }}

1. Save the Root CA to a `tunnel-ca.crt` file on your computer (see Mac, Windows, or Linux tabs).

1. Send the `tunnel-ca.crt` file to your phone (email, messaging app, etc.).

1. [Trust the certificate](/start-os/trust-ca.html?platform=iOS).

{{#endtab }}
{{#endtabs }}

{{#endtab }}
{{#endtabs }}

## Next steps

- [Subnets](subnets.md) — Create isolated VLANs
- [Devices](devices.md) — Add servers, phones, and laptops
- [Port Forwarding](port-forwarding.md) — Expose ports on your VPS's public IP
