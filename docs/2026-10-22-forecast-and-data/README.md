# Forecast and data

## Weather source

The map requests hourly temperature and relative humidity from the [Open-Meteo forecast API](https://open-meteo.com/) for the coordinates in `CONFIG.PLACES` in `js/config.js`. The configured timezone is `Asia/Manila`, and the current configuration requests two forecast days.

The app uses the forecast service's current temperature and relative humidity for the current reading when both values are available. It then calculates heat index values for the hourly forecast. Requests have a timeout, refresh on the configured interval, and are retried when the page becomes visible or the browser comes online.

## Calculation and categories

`js/heatindex.js` converts air temperature from Celsius to Fahrenheit, applies the NWS Rothfusz regression when the heat-index method's conditions are met, and converts the result back to Celsius. For milder conditions it uses a simpler approximation.

The calculated heat index maps to these display categories:

| Heat index | Category |
|---|---|
| below 27°C | Not hazardous |
| 27–32°C | Caution |
| 33–41°C | Extreme Caution |
| 42–51°C | Danger |
| 52°C and above | Extreme Danger |

The category labels and colors are defined in `js/heatindex.js`. They are project display categories, not a replacement for official local warnings.

## Map and place panel

For the selected hour, the map updates each town's marker color and the place conditions panel. The panel includes air temperature, relative humidity, heat index, category, and the highest heat index found during the following 24 forecast hours. The slider moves the selected time forward through the available forecast data.

## Limitations

- Weather models use grid cells several kilometers wide; a town reading is not a street-, barangay-, or school-site measurement.
- Forecasts are estimates and may differ from actual local conditions.
- A missing forecast value is shown as unavailable rather than treated as a safe reading.
- The map does not contain a live local weather sensor feed.

Follow official [PAGASA](https://www.pagasa.dost.gov.ph/) advisories and local school or workplace guidance.
