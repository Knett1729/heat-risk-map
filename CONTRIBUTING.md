# Contributing

Thanks for helping! The website is plain HTML, CSS and JavaScript with no frontend build step. The optional AI proxy in `heat-ai-proxy/` uses Node.js, npm, and Wrangler.

## Quick start

1. Fork and clone the repo.
2. Run `python -m http.server 8000` and open http://localhost:8000
3. Make your change on a new branch and open a pull request.

## Guidelines

- Keep runtime dependencies minimal. Leaflet is loaded from its CDN; Wrangler is only needed to develop or deploy the AI proxy.
- If you touch `js/heatindex.js`, check it with `node --check js/heatindex.js` and verify representative heat-index calculations in the map.
- Keep Open-Meteo attribution visible in the UI.
- One feature or fix per pull request, with a short description and a screenshot for UI changes.

## Good first issues

Add places in `js/config.js`, translate the UI to Cebuano or Filipino, add a 7-day view, add CSV export, improve mobile layout, or add accessibility labels.
