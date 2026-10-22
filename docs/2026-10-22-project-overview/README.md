# Project overview

## Purpose

Heat Risk Map presents forecast heat-index conditions for selected towns in Central Visayas, Philippines. It turns forecast temperature and humidity into a map, color-coded risk categories, and readable place conditions.

The application is a public information aid. Forecasts are estimates, not local sensor measurements or official warnings.

## Current features

- Interactive Leaflet map with a marker for each configured town.
- Heat-index categories displayed with a color legend.
- Forecast-hour slider for the available forecast period, up to 48 hours.
- Place conditions panel with temperature, humidity, heat index, and the next-24-hour peak.
- Optional AI assistant for general guidance about the selected forecast.
- Compact navigation that hides when idle and can be revealed using hover, keyboard focus, or tap.
- About page with project information and data attribution.

The current interface does **not** include a manual sun-exposure timer.

## Technology

- HTML, CSS, and browser JavaScript; no frontend build step.
- [Leaflet](https://leafletjs.com/) for the map.
- [Open-Meteo](https://open-meteo.com/) for weather forecasts.
- Cloudflare Workers and Workers AI for the optional AI assistant.

## Application flow

1. `index.html` redirects visitors to `map.html`.
2. `map.html` loads the map structure, styles, configuration, heat-index functions, map behavior, and optional assistant scripts.
3. `js/config.js` provides the town coordinates, map defaults, timezone, and refresh interval.
4. `js/app.js` loads and renders forecast conditions.
5. If the visitor uses the assistant, `js/ai-client.js` sends the selected forecast context and recent conversation to the configured Worker.
6. `heat-ai-proxy/src/index.js` checks the request origin, invokes Workers AI, and returns the generated reply.

## Important files

| Path | Responsibility |
|---|---|
| `index.html` | Redirects the site root to the map. |
| `map.html` | Map page markup and browser script loading order. |
| `about.html` | Project purpose, limitations, and credits. |
| `css/style.css` | Shared styling and responsive map interface. |
| `js/config.js` | Map center, timezone, refresh settings, and configured places. |
| `js/heatindex.js` | Heat-index calculation and category definitions. |
| `js/app.js` | Forecast loading, map markers, place panel, slider, and assistant forecast context. |
| `js/ai-client.js` | Browser client and prompt for the hosted AI assistant. |
| `js/assistant.js` | Assistant panel, input, conversation, and status handling. |
| `js/navigation.js` | Hide, reveal, and pin interactions for the navigation bar. |
| `heat-ai-proxy/src/index.js` | Cloudflare Worker endpoint for Workers AI requests. |
| `heat-ai-proxy/wrangler.jsonc` | Worker model binding and allowed browser origins. |
| `wrangler.jsonc` | Root Cloudflare static-assets configuration. |

## Related documentation

- [Forecast and data](../2026-10-22-forecast-and-data/README.md)
- [AI assistant](../2026-10-22-ai-assistant/README.md)
- [User interface](../2026-10-22-user-interface/README.md)
- [Deployment guide](../DEPLOYMENT.md)
- [Contributing](../../CONTRIBUTING.md)
