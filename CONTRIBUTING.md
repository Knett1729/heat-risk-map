# Contributing

Thanks for helping! This project is plain HTML, CSS and JavaScript with no build step.

## Quick start

1. Fork and clone the repo.
2. Run `python -m http.server 8000` and open http://localhost:8000
3. Make your change on a new branch and open a pull request.

## Guidelines

- Keep it dependency-free where possible (Leaflet is the only library).
- If you touch `js/heatindex.js`, run `node scripts/compare.js` and check the output against `scripts/validate_metpy.py`.
- Keep Open-Meteo attribution visible in the UI.
- One feature or fix per pull request, with a short description and a screenshot for UI changes.

## Good first issues

Add places in `js/config.js`, translate the UI to Cebuano or Filipino, add a 7-day view, add CSV export, improve mobile layout, or add accessibility labels.
