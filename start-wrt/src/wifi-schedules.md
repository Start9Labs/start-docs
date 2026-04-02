# WiFi Schedules

WiFi schedules let you disable the WiFi radio on a recurring timetable. During a blackout window, the radio is powered off entirely — no devices can connect over WiFi.

## Use Cases

- **Limit late-night usage** — Disable WiFi from 10 PM to 7 AM so household members are not online at night.
- **Reduce RF exposure** — Power off the radio during sleeping hours to minimize radiofrequency EMF in the home.
- **Energy savings** — Turn off WiFi when nobody is home during the day.

> [!NOTE]
> WiFi schedules affect the radio hardware itself, not individual devices or profiles. When WiFi is off, all WiFi-connected devices are disconnected regardless of their profile. Ethernet-connected devices are unaffected. For per-profile time restrictions on Internet access (not WiFi connectivity), use [WAN Schedules](security-profiles.md#wan-schedules) in Security Profiles.

## Setting a Schedule

The schedule is displayed as a 7-day visual timeline grid, with one row per day of the week. Blackout windows appear as shaded blocks on the timeline.

1. Navigate to `Points of Entry > Wi-Fi > Schedule`.

1. Click "Add" to create a blackout window.

1. Set the **start** and **end** times for the blackout period. Times use quarter-hour granularity (15-minute increments). End time must be later than start time.

1. Select which **days** of the week the window applies to.

1. Click "Save".

Multiple blackout windows per day are supported. For example, you could disable WiFi from 12 AM to 6 AM and again from 10 PM to 12 AM.

> [!TIP]
> Double-click an existing window to edit or delete it. Drag windows to adjust their position on the timeline.

## Removing a Schedule

To remove a blackout window, double-click it and click "Delete". Removing all blackout windows effectively disables the schedule — WiFi will remain on at all times.
