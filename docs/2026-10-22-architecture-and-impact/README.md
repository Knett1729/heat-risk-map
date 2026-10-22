# System architecture and technology impact

## High-level architecture

```text
Browser
├── Static site: index.html, map.html, about.html, css/
├── Forecast client: js/config.js, js/heatindex.js, js/app.js
├── Optional assistant: js/assistant.js, js/ai-client.js
└── Navigation behavior: js/navigation.js
        │
        ├── HTTPS forecast requests ──> Open-Meteo
        ├── Map tiles ────────────────> OpenStreetMap tile service
        └── AI request ───────────────> Cloudflare Worker
                                         └── Workers AI model
```

The frontend is a static browser application. It does not need a database or application server for map and forecast functionality. The optional assistant is a separate serverless Worker because the browser needs a controlled endpoint for calling Workers AI.

## Components and responsibilities

| Component | Responsibility |
|---|---|
| `index.html` | Redirects the site root to the map. |
| `map.html` | Defines the map controls and loads Leaflet and app scripts in dependency order. |
| `about.html` | Explains project purpose, limitations, and attribution. |
| `css/style.css` | Styles the shared pages, responsive map panels, and assistant. |
| `js/config.js` | Defines map defaults, timezone, refresh period, and town coordinates. |
| `js/heatindex.js` | Calculates heat index and maps values to display categories. |
| `js/app.js` | Requests weather data, updates map markers, synchronizes the slider and place panel, and exposes selected forecast context to the assistant. |
| `js/assistant.js` | Manages assistant input, conversation display, loading state, and errors. |
| `js/ai-client.js` | Builds the assistant prompt and sends the selected forecast and conversation to the Worker. |
| `js/navigation.js` | Provides hide, reveal, and pin behavior for the navigation bar. |
| `heat-ai-proxy/src/index.js` | Checks allowed browser origins, validates messages, calls Workers AI, and returns the reply. |
| `wrangler.jsonc` | Configures the root Cloudflare static-asset Worker. |
| `heat-ai-proxy/wrangler.jsonc` | Configures the AI binding and the AI Worker origin allowlist. |

The repository also contains `js/data.js`, `js/places.js`, and `js/home.js`, but the current HTML pages do not load them; they are not part of the active application flow.

## Technology choices and impact

### Plain HTML, CSS, and JavaScript

The static frontend avoids a bundler, framework runtime, database, and frontend build pipeline. This keeps local setup and hosting straightforward and lets the project run on a basic static host. The trade-off is that script ordering, browser compatibility, and manual testing must be maintained directly.

### Leaflet and OpenStreetMap

Leaflet provides interactive pan, zoom, markers, popups, and map controls. OpenStreetMap tiles provide the geographic background. These choices avoid a proprietary map SDK and credentials in the browser. The app must retain visible attribution and respect tile-service usage policies; public tile services are not an unlimited hosting guarantee.

### Open-Meteo

Open-Meteo provides hourly temperature and relative humidity for all configured places without requiring an API key for this project's current use. The browser can request the forecast directly, so weather data does not require a project backend. This also means the app depends on network access and the provider's availability and terms. Forecast grid values are town-level estimates, not street measurements or live sensors.

### Cloudflare Workers and Workers AI

The optional assistant uses a Worker to keep the model selection and upstream AI binding on the server side and to centralize request validation and origin handling. The static map remains usable when the Worker is unavailable. A public browser client can still be called outside a browser, so CORS is not authentication or a complete abuse-prevention mechanism. Worker requests may consume account resources; owners should review usage limits and provider policies.

### GitHub Pages

GitHub Pages can publish the static site directly from the repository without a build step. The Worker is deployed separately from `heat-ai-proxy/`. This separation means website changes and AI service changes have distinct deployment steps.

## Data flow

1. `js/app.js` requests temperature and relative humidity for the configured coordinates from Open-Meteo.
2. `js/heatindex.js` derives hourly heat-index values and categories.
3. `js/app.js` renders values in the map, legend, place panel, and forecast slider.
4. If a visitor submits an assistant question, `js/app.js` supplies the selected hour's town context.
5. `js/ai-client.js` sends that context and recent conversation to the configured Worker.
6. The Worker validates the request and calls the fixed Workers AI model, then returns a short reply.

## Trust and safety boundaries

- Weather data is externally supplied and may be stale or unavailable.
- The assistant is optional and is not the source of the map's numeric forecast.
- The assistant receives the forecast context and conversation; users should not enter sensitive personal information.
- The AI Worker allowlist checks browser origins but does not authenticate individual users.
- Forecast categories and AI guidance are informational, not official warnings or medical advice.

See the [forecast guide](../2026-10-22-forecast-and-data/README.md), [AI scope](../2026-10-22-ai-assistant/README.md), and [deployment guide](../DEPLOYMENT.md).
