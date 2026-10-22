# Project specification

## Problem and intended users

Residents, families, students, outdoor workers, and community members need an understandable view of forecast heat conditions for towns in Central Visayas. The project presents regional model forecasts in a map and place list so visitors can compare places and upcoming hours.

## Goals

- Show heat-index forecasts for the configured towns.
- Make risk levels and their numeric ranges easy to compare.
- Allow visitors to inspect forecast hours up to the available 48-hour window.
- Explain where the values come from and what they cannot establish.
- Offer optional, general-language AI guidance grounded in the selected forecast.
- Keep the map and forecast available independently of the optional AI service.

## Functional requirements

| ID | Requirement | Acceptance check |
|---|---|---|
| FR-1 | Load forecast temperature and relative humidity for places listed in `js/config.js`. | Place readings load when the site is served over HTTP and the forecast service is reachable. |
| FR-2 | Calculate heat index and assign the configured display category. | Values below 27, 27–32, 33–41, 42–51, and 52°C or higher map to the documented labels. |
| FR-3 | Show locations on an interactive map with a color legend. | Each configured town has a marker; a selected forecast updates marker color and legend remains visible. |
| FR-4 | Let visitors change the forecast hour. | Moving the slider updates the displayed time and town readings. |
| FR-5 | Show a readable per-town forecast summary. | Each town displays temperature, humidity, heat index/category, and a following-24-hour peak when available. |
| FR-6 | Refresh forecast data and handle unavailable data. | The app refreshes on its configured interval and shows an error/unavailable state rather than implying missing data is safe. |
| FR-7 | Provide an optional AI assistant. | When configured and reachable, it returns a reply using selected forecast context; failure does not disable the map. |
| FR-8 | Support the primary UI at desktop and mobile sizes. | Map panels remain usable, with keyboard-accessible native controls and visible status information. |
| FR-9 | Attribute third-party weather and map content. | Open-Meteo and OpenStreetMap attribution is visible in the UI and documented. |

## Non-functional and safety requirements

- Do not require a frontend build tool to run the static site.
- Do not commit service credentials or expose private tokens in browser code.
- Treat upstream weather as an estimate; it is not a live sensor reading.
- Do not represent AI output as a medical diagnosis, official warning, or guaranteed safety decision.
- Keep forecast and AI errors visible to visitors.
- Preserve keyboard labels and responsive presentation for the interactive controls.

## Out of scope

- Street-, property-, or school-level measurement.
- User geolocation or individualized medical risk assessment.
- Official PAGASA alerts or emergency dispatch.
- AI-generated or AI-modified numeric map forecasts.
- A manual sun-exposure timer (not present in the current application).
- Guaranteed availability of third-party APIs or hosted AI.

## Dependencies and assumptions

- The visitor has an internet connection and a modern browser.
- Open-Meteo and OpenStreetMap services are reachable and their current terms permit the intended use.
- The optional assistant requires a deployed Cloudflare Worker with Workers AI enabled and the visitor's exact browser origin allowed.
- Forecast places and coordinates are maintained in `js/config.js`.

## Change process

For a change that affects these requirements, explain the user need and acceptance conditions in an issue or pull request. Update this specification, the relevant guide, and the changelog when documented scope or visible behavior changes.
