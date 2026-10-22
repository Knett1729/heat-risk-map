# Heat Risk Map

An open-source web map that shows the **heat index** (the "feels like" heat danger level) for towns across Central Visayas, with a slider to look up to 48 hours ahead. Built for the El Niño heat season. Weather forecasts need no API key or backend; the optional AI assistant connects directly to a local model.

## How it works

1. `js/config.js` lists the places to show.
2. `js/app.js` asks the [Open-Meteo](https://open-meteo.com/) forecast API for hourly temperature and relative humidity for every place in one request.
3. `js/heatindex.js` converts those two values into a heat index with the NWS Rothfusz regression and maps it to PAGASA-style categories.
4. Leaflet draws a colored marker per place; the slider changes the hour.
5. The map refreshes weather data every five minutes, and again when the page becomes visible or the network reconnects. It uses Open-Meteo's current temperature and humidity for the current reading; its model data is not a live local sensor feed.
6. The map includes an optional manual direct-sun timer with configurable break reminders. Start and pause it as your exposure changes. The timer does not detect sunlight or personal conditions; reminders are not medical safety thresholds.
7. The map's heat safety assistant can send a question and the selected-hour heat forecast to an OpenAI-compatible local chat API.

## Local AI assistant

The assistant is configured in `js/config.js` under `CONFIG.AI`. The default `API_URL` uses the local OpenAI-compatible endpoint at `http://localhost:1234/v1/chat/completions`. Set `MODEL` to the model name your local server expects, and optionally replace `API_KEY` if it requires one. The model name and API key are placeholders.

The API key is used by the browser and is not secret. Use this only with a local model endpoint you control. Your questions and forecast context are sent to that endpoint. The assistant offers general forecast guidance, not official warnings or a guarantee of safety; always follow PAGASA advisories and school guidance.

If the assistant cannot connect, check that the local model server allows browser CORS requests from the map's origin (for example, `http://127.0.0.1:8000`) and responds to `OPTIONS` preflight requests. `localhost` and `127.0.0.1` are different browser origins. The server must also support `POST /v1/chat/completions`.

## Run locally

Do not open `index.html` or `map.html` directly from your file system (`file://`).
Browsers block the weather API request from local files. In VS Code, install the
**Live Server** extension, then right-click `index.html` and select **Open with
Live Server**. The root page redirects to `map.html`; the map will be served from
a local address such as `http://127.0.0.1:5500`.

Alternatively, if Python is installed, run this from the project folder:

```
python -m http.server 8000
```

Then open http://localhost:8000 in your browser; it redirects to the map.

## Deploy

Push to GitHub, then Settings → Pages → deploy from the `main` branch (root).

## Validate the formula

```
node scripts/compare.js
pip install metpy
python scripts/validate_metpy.py
```
The two tables should match closely. Use inputs at or above about 27°C; below that, this project uses a simpler formula while MetPy does not.

## Categories (heat index, °C)

| Range | Category |
|---|---|
| below 27 | Not hazardous |
| 27–32 | Caution |
| 33–41 | Extreme Caution |
| 42–51 | Danger |
| 52+ | Extreme Danger |

## Limitations

- Open-Meteo data comes from weather models with a grid several kilometers wide, so this is a town-level forecast, not block-level. Real street-level differences need sensors or satellite data (see the roadmap).
- Forecasts are estimates. Always follow official PAGASA advisories.

## Data and attribution

Weather data by [Open-Meteo.com](https://open-meteo.com/). Their free API is for non-commercial / open-source use; read their terms before changing how this is used. Map tiles © OpenStreetMap contributors.

## Roadmap (good first issues)

- Add more municipalities and barangays
- Cebuano / Filipino interface
- 7-day forecast view
- Historical "Danger hours" per town using the Open-Meteo archive API
- Telegram alerts via a scheduled GitHub Action
- Land-cover / tree-cover heat exposure layer (OpenStreetMap or satellite land surface temperature)
- CSV export
- Compare against official PAGASA heat index values

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Licensed under MIT.
