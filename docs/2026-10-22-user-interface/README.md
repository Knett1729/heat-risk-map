# User interface

## Map page

The main page is `map.html`. It displays:

- A Leaflet map centered on the configured part of Central Visayas.
- One marker per place listed in `js/config.js`.
- A forecast-time slider and current data status.
- A place conditions panel with temperature, humidity, heat index, category, and next-24-hour peak.
- A color legend and map/data attribution.
- An optional heat-safety assistant panel.

Selecting a place in the panel focuses its map marker. Moving the forecast slider updates the displayed time, place readings, and marker colors.

## Navigation

The shared navigation on the map and about pages is intentionally compact. It slides mostly out of view when idle and reveals on hover or keyboard focus. The small reveal control can be activated with a tap to pin the navigation open; Escape closes a pinned navigation.

The interaction is implemented in `js/navigation.js` and styled in `css/style.css`.

## AI assistant controls

- Select **Ask Heat AI** to open the assistant panel.
- Choose a suggested question or type in the message field.
- Press Enter to send; Shift+Enter inserts a newline.
- Use the close button to dismiss the panel.

Assistant answers are general forecast guidance only. The panel includes a medical-safety disclaimer; see the [AI assistant documentation](../2026-10-22-ai-assistant/README.md) for its full scope.

## Responsive and accessibility details

The layout adapts to smaller screens. On phones, the forecast controls sit below the compact navigation, the place list becomes a scrollable bottom sheet, and map controls move above it so the map remains visible. The assistant opens in a near-full-width panel, and short landscape screens give it most of the viewport. Navigation and assistant controls are native buttons with accessible names; the navigation can be reached by keyboard, and its reveal state is exposed with `aria-expanded`. Forecast loading and assistant status messages use status/live regions.

The map depends on a running web server. Opening the HTML directly with a `file://` URL can prevent the weather request from working. See [Run locally](../../README.md#run-locally).
