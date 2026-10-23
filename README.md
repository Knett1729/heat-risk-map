# Heat Risk Map

An open-source web map of the **heat index** (the "feels like" heat danger level) for towns across Central Visayas, Philippines. Use the forecast slider to explore conditions up to 48 hours ahead.

**Live site:** [heat-risk-map.vercel.app](https://heat-risk-map.vercel.app/)

## Features

- Town-level heat-index forecasts from Open-Meteo, displayed on a Leaflet map and in a place-by-place conditions panel.
- PAGASA-style heat categories and a forecast-hour slider.
- Optional AI heat-safety assistant, powered by a Cloudflare Worker and Workers AI.
- Compact navigation that hides when idle and reveals on hover, keyboard focus, or tap.

## How it works

1. `js/config.js` defines the map center, timezone, and places.
2. `js/app.js` requests hourly temperature and relative humidity from the [Open-Meteo forecast API](https://open-meteo.com/).
3. `js/heatindex.js` calculates heat index using the NWS Rothfusz regression and maps it to PAGASA-style categories.
4. Leaflet displays the forecast; the slider changes the selected hour.
5. Forecast data refreshes every five minutes, when the page becomes visible, and when the network reconnects. Open-Meteo uses weather models; it is not a live local sensor feed.
6. The AI assistant sends the selected forecast context and conversation to the configured Cloudflare Worker. The Worker calls Workers AI and returns a short reply.

## Why this solution is effective

Heat Risk Map turns hourly temperature and humidity forecasts into heat-index categories people can explore by town and forecast hour. Showing the same conditions on a map and in a town-by-town panel makes regional differences easier to compare than raw weather values alone, while the slider helps users consider how conditions may change over the next 48 hours. This supports practical planning, such as choosing a cooler time for outdoor activities; it does not determine whether an activity is safe.

The implementation fits the problem: Open-Meteo supplies the forecast inputs, a small browser-side calculation derives heat index, and Leaflet presents the results without requiring a project backend or database for the core map. The separate Cloudflare Worker keeps the optional AI feature independent, so map and forecast functionality remain available if the assistant is unavailable. These choices keep deployment simple while making the data source, calculation, and service boundaries visible.

The project has not yet established measured health outcomes or user-impact metrics. Its effectiveness is therefore demonstrated by the working forecast experience and its documented limitations, not by a claim that it reduces heat illness. Forecasts are model-based estimates, and users should continue to follow official PAGASA advisories and local guidance.

## Run locally

Do not open `index.html` or `map.html` directly from `file://`; browsers block the weather API request from local files.

In VS Code, you can install the **Live Server** extension, right-click `index.html`, and select **Open with Live Server**.

Alternatively, if Python is installed, run this from the project folder:

```sh
python -m http.server 8000
```

Open <http://localhost:8000>; the root page redirects to the map. The AI proxy configuration allows common local origins on ports `8000` and `5500`. If you use a different port or host, add its exact origin to `ALLOWED_ORIGINS` in `heat-ai-proxy/wrangler.jsonc`, then redeploy the Worker.

## AI assistant scope

The optional AI assistant provides brief, general heat-safety guidance about the map's Central Visayas forecast. It receives the selected forecast hour, model-based readings for the configured towns, and up to eight recent user/assistant message entries. It can summarize the supplied heat-index values and suggest general precautions such as water, shade, rest breaks, or planning activities for cooler hours.

The map calculates the forecast heat index; the AI does not calculate or update the map's readings. It does not fetch live weather, detect a user's location or exposure, measure conditions at a specific street or school, assess an individual's health, diagnose or treat illness, issue official warnings, or decide that an activity is safe. It may make mistakes or give incomplete answers. For severe symptoms, seek emergency medical help; follow official PAGASA advisories and school or workplace guidance.

Questions, recent conversation entries, and the selected forecast context are sent to the configured Cloudflare Worker and Workers AI to generate a reply. Do not include sensitive personal or medical information. The assistant is optional; map forecasts do not depend on it.

## Deploy

- **Website:** deploy this repository on Vercel as a static site with the project root as its root directory, no build command, and `.` as the output directory. The included `vercel.json` sends the root URL to the map. The `.vercelignore` file keeps documentation and the separate Worker source out of the website deployment.
- **AI assistant:** deploy the separate Cloudflare Worker in `heat-ai-proxy`. See the [deployment guide](docs/DEPLOYMENT.md) for setup, origin configuration, verification, and troubleshooting.

The map works without the AI assistant. After Vercel assigns your project a production domain, add that exact origin (scheme and hostname, no path or trailing slash) to `ALLOWED_ORIGINS` in `heat-ai-proxy/wrangler.jsonc`, then redeploy the Worker. If you fork this project, use your own Vercel domain.

## Project documentation

Browse the [documentation index](docs/README.md) for architecture and platform impact, requirements, forecast data, AI scope, project history, licensing, testing, demo instructions, and deployment. The repository also includes issue and pull-request templates and a code of conduct.

## Heat-index categories (°C)

| Range | Category |
|---|---|
| below 27 | Not hazardous |
| 27–32 | Caution |
| 33–41 | Extreme Caution |
| 42–51 | Danger |
| 52+ | Extreme Danger |

## Limitations and safety

- Open-Meteo data comes from weather models with grid cells several kilometers wide. These are town-level estimates, not block-level measurements.
- Forecasts can differ from actual conditions. Follow official [PAGASA](https://www.pagasa.dost.gov.ph/) advisories and school or workplace guidance.
- The AI assistant is not medical advice, an official warning, or a guarantee that an activity is safe. Do not rely on it for emergency decisions.

## Data and attribution

Weather data by [Open-Meteo.com](https://open-meteo.com/). Its free API is for non-commercial and open-source use; review its terms before changing how the data is used. Map tiles © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright). Maps powered by [Leaflet](https://leafletjs.com/).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Good first contributions include adding places, translating the interface to Cebuano or Filipino, adding a longer forecast view, and improving accessibility. The project code is licensed under [MIT](LICENSE); see the [license and attribution guide](docs/2026-10-22-license-and-attribution/README.md) for third-party data and map terms.
