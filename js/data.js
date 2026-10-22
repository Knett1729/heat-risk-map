// Shared data loader for index.html and places.html.
// Depends on: CONFIG (config.js), HeatIndex (heatindex.js).
const NO_DATA = { label: "No data", color: "#9ca3af", range: "" };

function textOn(color) {
  return (color === "#dc2626" || color === "#7f1d1d") ? "#fff" : "#111";
}

function badgeHtml(cat, text) {
  return `<span class="badge" style="background:${cat.color};color:${textOn(cat.color)}">${text}</span>`;
}

async function loadHeatData() {
  const lat = CONFIG.PLACES.map(p => p[1]).join(",");
  const lng = CONFIG.PLACES.map(p => p[2]).join(",");
  const url = "https://api.open-meteo.com/v1/forecast" +
    `?latitude=${lat}&longitude=${lng}` +
    "&hourly=temperature_2m,relative_humidity_2m&current=temperature_2m" +
    `&timezone=${encodeURIComponent(CONFIG.TIMEZONE)}&forecast_days=${CONFIG.FORECAST_DAYS}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  let res;
  try {
    res = await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
  if (!res.ok) throw new Error("HTTP " + res.status);
  const json = await res.json();
  const arr = Array.isArray(json) ? json : [json];

  // Find the hourly slot that matches "now"
  const nowStr = arr[0].current.time;
  let nowIdx = 0;
  arr[0].hourly.time.forEach((t, i) => { if (t <= nowStr) nowIdx = i; });

  return arr.map((d, i) => {
    const times = d.hourly.time;
    const temp = d.hourly.temperature_2m;
    const rh = d.hourly.relative_humidity_2m;
    const hi = temp.map((t, k) => (t == null || rh[k] == null) ? null : HeatIndex.heatIndexC(t, rh[k]));

    // Peak heat index in the next 24 hours
    let peak = null, peakIdx = nowIdx;
    for (let k = nowIdx; k < Math.min(nowIdx + 24, hi.length); k++) {
      if (hi[k] != null && (peak == null || hi[k] > peak)) { peak = hi[k]; peakIdx = k; }
    }

    const now = hi[nowIdx];
    return {
      name: CONFIG.PLACES[i][0],
      time: times[nowIdx],
      temp: temp[nowIdx],
      rh: rh[nowIdx],
      hi: now,
      category: now == null ? NO_DATA : HeatIndex.category(now),
      peak,
      peakTime: times[peakIdx].slice(11, 16),
      nowIdx,
      times,
      hourlyHi: hi
    };
  });
}