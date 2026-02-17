# FAQ

Common issues encountered during setup and daily use of StartOS, including network connectivity problems, diagnostic mode, clock sync failures, and service-specific troubleshooting.

## I do not have access to Ethernet

Ethernet is strongly recommended. Servers are always-on, critical devices and should use a wired connection. However, if you do not have access to a router, such as in a work or school environment, there are two options:

- **Server has a WiFi card** (DIY builds only — Start9 servers do not ship with one): Connect a monitor and keyboard to your server (kiosk mode). If no Ethernet interface is detected, you will be prompted to connect to a WiFi network. See [WiFi](../user-manual/wifi.md) for more details.

- **Server does not have a WiFi card**: Use a WiFi extender to bridge the local WiFi network to Ethernet, then connect your server to the extender. The extender below has been tested with StartOS, but others should also work.
  - [TP-Link AC750 WiFi Range Extender](https://www.amazon.com/TP-Link-AC750-WiFi-Range-Extender/dp/B07N1WW638)

## StartOS boots into "Diagnostic Mode"

If you encounter Diagnostic Mode, your best bet is stop clicking and [contact support](https://start9.com/contact).

## During initial setup, I am unable to connect to "start.local".

1. Confirm that the server is plugged into power and Ethernet
1. Confirm that your phone/computer is connected to the same network as the server.
1. Confirm your phone/computer is _not_ connected to a "Guest" network
1. Confirm you are _not_ using the Tor Browser.
1. Confirm your phone/computer is _not_ using a VPN, or that if you are, that it allows LAN connections, such as the examples below:
   - Mullvad - Go to `Settings -> VPN Settings -> Local Network Sharing`
   - ProtonVPN - Go to `Preferences -> Connection -> Allow LAN Connections`

1. Very rarely, your firewall settings may block mDNS. In this case:
   - From your browser, navigate to your router configuration settings. This is usually an IP address such as 192.168.1.1. A simple web search will usually reveal how to access the router configuration settings for a particular brand.
   - Once in the router config settings, find the section that lists the devices on your network. You should see a device labeled `start`. Take note of the associated IP address and enter it into your browser's URL field to enter the setup.

1. Log into your router (the directions for which can be found with a simple web search for your router model and 'how to log in'). Once you are in your router, find the device labeled "start", and visit its associated IP address, which will look something like: `192.168.1.9`

## I am unable to connect to my server's "custom-address.local" URL

1. First, try :ref:`these step <setup-troubleshoot>`. In none resolve the issue, continue below.
1. Hard refresh the browser:
   - Linux/Windows: `ctrl+shift+R`
   - macOS Firefox: `cmd+shift+R`
   - macOS Safari: `cmd+option+E`, then `cmd+R`

1. Make sure you have successfully followed the :ref:`connecting-lan` instructions for your device.
1. If you are using Windows, the problem is almost certainly with Bonjour. Follow the :ref:`directions to reinstall <connecting-lan-windows>`, even if you have already done so.
1. If using Firefox from Mac, Windows or Android, ensure you have set `security.enterprise_roots.enable` to `true` in `about:config` per the :ref:`instructions<ca-ff>`
1. Try connecting using your server's IP address. If this works, it means your issue is specific to `.local`. Try clearing your browser cache and/or restarting your phone/laptop/router. If all fails, try restarting your server.
1. Try connecting using a different browser on the same device. If this works, it means you need to clear cache on your current browser.
1. Try connecting using a different device. If this works, it means you need to clear cache on your current browser and/or restart your current device.
1. Try visiting start.local. Your server may be in diagnostic mode.
1. Try restarting your router.
1. Try restarting your server. Be patient and give it plenty of time to come back online.

## I am unable to connect to my server's "xxxxxxxxxxxxxxxxxx.onion" URL

1. Tor can be slow and unreliable. Often, the solution to poor connectivity is just to wait an hour and try again.
1. Confirm that the Tor service is installed and running on your server.
1. Confirm that you have created an onion service for the interface you are trying to reach. See [Tor](../user-manual/private-access/tor.md).
1. Try connecting using the official Tor Browser. If this works, it means the issue is with your current browser or the Tor daemon running on your phone/laptop. Try clearing cache and restarting things.
1. Try connecting to your server using its `.local` URL or IP address. If this works, the issue is specific to Tor. Try restarting the Tor service on your server.

## Request Error

This means your client device failed to connect to the server. This can happen for a variety of reasons. The best course of action is:

1. Check your local Internet connection.
1. Hard refresh the browser.
1. Clear the browser cache/history.
1. Try using a different address for your server. For example, if you are using your `.local` address, try your IP address instead, or vice versa.
1. Try from another client device. If the second client works, then you know the issue is with your first client. If the seconds client does not work, then you know the issue is either with your clients' network or with your server.
1. If after completing the steps above, you still cannot connect using any address from any client, then you will likely need to manually power cycle the server.
1. If power cycling the server does not resolve the issue, please contact support.

## Clock Sync Failure

This means your server was unable to sync its clock with the Internet using the Network Time Protocol (NTP). This is usually due to a firewall issue with your network/router. Make sure you are not blocking NTP. If the issue persists, please contact support.

## Issue with a particular service

If a service is misbehaving or crashing, check the logs for that service. Look for any errors that might explain the problem. Often, the solution is to restart the service by clicking "Restart". If the issue persist, [contact support](https://start9.com/contact).

## Common Speaker Noises

The Server Pure (2023 and older) and and Server One (2022 and older) have an internal speaker. Below are the meanings of various noises.

- bep: Server is starting up

  <audio controls>
    <source src="./assets/BEP.mp3" type="audio/mpeg">
    Your browser does not support the audio element.
  </audio>

- chime: Server is ready

  <audio controls>
    <source src="./assets/CHIME.mp3" type="audio/mpeg">
    Your browser does not support the audio element.
  </audio>

- double/triple bep: Server is updating

  <audio controls>
    <source src="./assets/UPDATING.mp3" type="audio/mpeg">
  </audio>

- flatline: Server initialization failed / no network connection

  <audio controls>
    <source src="./assets/FLATLINE.mp3" type="audio/mpeg">
    Your browser does not support the audio element.
  </audio>

- Beethoven's 5th: Something has gone wrong. Visit `http://start.local` to view Diagnostic Mode and contact support.

  <audio controls>
    <source src="./assets/BEETHOVEN.mp3" type="audio/mpeg">
    Your browser does not support the audio element.
  </audio>
