// Heat index (NWS Rothfusz regression) and PAGASA-style categories.
// Works in the browser (window.HeatIndex) and in Node (require).
(function (root) {
  // tc = air temperature in °C, rh = relative humidity in %. Returns heat index in °C.
  function heatIndexC(tc, rh) {
    const t = tc * 9 / 5 + 32; // work in °F, as the formula is defined
    let hi = 0.5 * (t + 61 + (t - 68) * 1.2 + rh * 0.094); // simple formula for milder conditions
    if ((hi + t) / 2 >= 80) {
      hi = -42.379 + 2.04901523 * t + 10.14333127 * rh - 0.22475541 * t * rh
         - 0.00683783 * t * t - 0.05481717 * rh * rh + 0.00122874 * t * t * rh
         + 0.00085282 * t * rh * rh - 0.00000199 * t * t * rh * rh;
      if (rh < 13 && t >= 80 && t <= 112) {
        hi -= ((13 - rh) / 4) * Math.sqrt((17 - Math.abs(t - 95)) / 17);
      } else if (rh > 85 && t >= 80 && t <= 87) {
        hi += ((rh - 85) / 10) * ((87 - t) / 5);
      }
    }
    return (hi - 32) * 5 / 9;
  }

  const DANGER_THRESHOLD_C = 42;

  // Ordered from highest to lowest threshold (°C heat index).
  const CATEGORIES = [
    { min: 52, label: "Extreme Danger",  color: "#7f1d1d", range: "52+" },
    { min: DANGER_THRESHOLD_C, label: "Danger", color: "#dc2626", range: "42–51" },
    { min: 33, label: "Extreme Caution", color: "#f97316", range: "33–41" },
    { min: 27, label: "Caution",         color: "#facc15", range: "27–32" },
    { min: -Infinity, label: "Not hazardous", color: "#22c55e", range: "below 27" }
  ];

  function category(hi) {
    return CATEGORIES.find(c => hi >= c.min);
  }

  const api = { heatIndexC, category, CATEGORIES, DANGER_THRESHOLD_C };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.HeatIndex = api;
})(typeof window !== "undefined" ? window : globalThis);
