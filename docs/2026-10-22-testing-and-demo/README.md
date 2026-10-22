# Testing and one-minute demonstration

## Run the real application

The project is a working browser application, not a mockup. Run it from the repository root so the browser can request forecast data:

1. Open the project folder in VS Code.
2. Start a server using one of these options:
   - Install the VS Code **Live Server** extension, right-click `index.html`, and select **Open with Live Server**; or
   - Run `python -m http.server 8000` in the integrated terminal.
3. Open the server URL. With Python, use <http://localhost:8000>; it redirects to `map.html`.
4. Allow the initial Open-Meteo request to finish. An internet connection is needed for live forecast data and map tiles.
5. If demonstrating the AI assistant, confirm the Worker is deployed and its `ALLOWED_ORIGINS` includes the exact local site origin. The demo still works without AI by showing the map and forecast.

Do not open the HTML with a `file://` URL. That prevents the forecast request from working in the browser.

## Verification checklist

There is currently no automated frontend test runner or root-level test suite. Use checks appropriate to the changed code:

### Browser JavaScript syntax

From the repository root, run:

```sh
node --check js/app.js
node --check js/assistant.js
node --check js/ai-client.js
node --check js/navigation.js
node --check js/heatindex.js
```

For a Worker change, run from `heat-ai-proxy/`:

```sh
npx wrangler deploy --dry-run
```

### Manual smoke test

- [ ] Root URL opens the map page.
- [ ] Forecast loading status changes to a successful update, or a clear error appears if the network is unavailable.
- [ ] Town markers and the place conditions panel show matching forecast categories.
- [ ] The slider changes the forecast time and displayed readings.
- [ ] Missing values display as unavailable.
- [ ] Navigation reveals on hover/focus and can be pinned with its control.
- [ ] The assistant opens, accepts a question, and displays a reply or a visible service error.
- [ ] Attribution, accessibility labels, mobile layout, and safety disclaimers remain visible.

## One-minute live demo plan

Use the running application in a real browser. Keep the map page visible; do not substitute static screenshots for interactions.

| Time | Show and say |
|---|---|
| 0–8 sec | **Show:** the live map after forecast data loads. **Say:** “Heat Risk Map turns regional weather forecasts into a clear heat-risk picture for Central Visayas.” |
| 8–20 sec | **Show:** several town markers and the color legend. Select a town card. **Say:** “Each marker and town card shows a heat-index category alongside temperature and humidity.” |
| 20–32 sec | **Show:** move the forecast slider forward and point out the updated time and values. **Say:** “We can look ahead through the available forecast—up to 48 hours—and compare the expected conditions.” |
| 32–45 sec | **Show:** open the AI panel and submit a short question about one displayed town, if the Worker is available. **Say:** “The optional assistant explains the selected forecast and suggests general precautions. It is not a medical or official warning system.” |
| 45–55 sec | **Show:** the visible attribution and safety note. **Say:** “Forecasts are town-level model estimates, so follow PAGASA and local guidance.” |
| 55–60 sec | **Say:** “Heat Risk Map: see the heat ahead, and plan smarter.” |

If the AI service is unavailable, do not hide or fake the error. Show the map and slider successfully, and state that the assistant is an optional separately hosted service.

## Recording guidance

- Record the actual app running in the browser, with the browser URL and real UI visible.
- Before recording, confirm the forecast has loaded; avoid displaying account settings, credentials, or private browser information.
- Use a readable screen size, move the pointer deliberately, and keep the map, legend, town panel, and slider visible when demonstrating them.
- If the video must show both code and the app, briefly show the project in VS Code, then switch to the running browser for the interaction. Do not spend the one-minute demo scrolling through source code.
- Do not imply that the AI validates health conditions or that weather-model data is measured at the viewer's exact location.
