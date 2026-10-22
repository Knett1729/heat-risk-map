// Edit this file to change the map center, timezone, or the list of places.
const CONFIG = {
  MAP_CENTER: [10.3157, 123.8854],
  ZOOM: 9,
  TIMEZONE: "Asia/Manila",
  FORECAST_DAYS: 2,
  REFRESH_MINUTES: 5,
  AI: {
    API_URL: "http://localhost:1234/v1/chat/completions",
    API_KEY: "YOUR_API_KEY",
    MODEL: "qwen/qwen3-1.7b",
  },

  // [name, latitude, longitude]  (coordinates are approximate)
  PLACES: [
    ["Cebu City",   10.2956, 123.9020],
    ["Mandaue",     10.3236, 123.9223],
    ["Lapu-Lapu",   10.3103, 123.9494],
    ["Talisay",     10.2447, 123.8494],
    ["Minglanilla", 10.2447, 123.7960],
    ["Consolacion", 10.3760, 123.9570],
    ["Danao",       10.5200, 124.0270],
    ["Toledo",      10.3773, 123.6380],
    ["Carcar",      10.1060, 123.6400],
    ["Argao",        9.8800, 123.6050],
    ["Moalboal",     9.9400, 123.3960],
    ["Bogo",        11.0470, 124.0050]
  ]
};
