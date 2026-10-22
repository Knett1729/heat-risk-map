// Map + data loading. Depends on: Leaflet, CONFIG (config.js), HeatIndex (heatindex.js).
const { heatIndexC, category, CATEGORIES } = HeatIndex;

const map = L.map("map", { zoomControl: false }).setView(CONFIG.MAP_CENTER, CONFIG.ZOOM);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors | Weather data by Open-Meteo.com"
}).addTo(map);

// Legend
const legend = L.control({ position: "bottomright" });
legend.onAdd = () => {
  const d = L.DomUtil.create("div", "legend");
  d.innerHTML = [...CATEGORIES].reverse()
    .map(c => `<div><i style="background:${c.color}"></i>${c.label} ${c.range}°C</div>`)
    .join("") +
    '<div><i style="background:#94a3b8"></i>Forecast unavailable</div>';
  return d;
};
legend.addTo(map);

const slider = document.getElementById("slider");
const whenEl = document.getElementById("when");
const dataStatusEl = document.getElementById("data-status");
const placeStatusList = document.getElementById("place-status-list");
const placePanelSubtitle = document.getElementById("place-panel-subtitle");
document.getElementById("place-count").textContent = `${CONFIG.PLACES.length} places`;

function setPlaceReading(index, reading) {
  const item = placeStatusList.children[index];
  item.querySelector(".place-status").textContent = reading.status;
  item.querySelector(".place-status").style.setProperty("--status-color", reading.color);
  item.querySelector(".place-temperature").textContent = reading.temperature;
  item.querySelector(".place-humidity").textContent = reading.humidity;
  item.querySelector(".place-heat-index").textContent = reading.heatIndex;
  item.querySelector(".place-peak").textContent = reading.peak;
}

const markers = CONFIG.PLACES.map(([name, lat, lng]) => L.circleMarker([lat, lng], {
  radius: 12, color: "#fff", weight: 2, fillColor: "#94a3b8", fillOpacity: 0.95
}).addTo(map)
  .bindPopup(`<b>${name}</b><br>Forecast data is not available yet.`)
  .bindTooltip(`${name}: forecast loading`));

CONFIG.PLACES.forEach(([name], index) => {
  const item = document.createElement("li");
  const button = document.createElement("button");
  button.type = "button";
  button.className = "place-card";
  button.setAttribute("aria-label", `${name} forecast details`);

  const heading = document.createElement("span");
  heading.className = "place-card-heading";
  const placeName = document.createElement("span");
  placeName.className = "place-name";
  placeName.textContent = name;
  const status = document.createElement("span");
  status.className = "place-status";
  status.textContent = "Loading";
  heading.append(placeName, status);

  const metrics = document.createElement("span");
  metrics.className = "place-metrics";
  for (const [className, label, value] of [
    ["place-temperature", "Temperature", "—"],
    ["place-humidity", "Humidity", "—"],
    ["place-heat-index", "Heat index", "—"],
    ["place-peak", "24h peak", "—"]
  ]) {
    const metric = document.createElement("span");
    metric.className = "place-metric";
    const metricLabel = document.createElement("span");
    metricLabel.className = "place-metric-label";
    metricLabel.textContent = label;
    const metricValue = document.createElement("span");
    metricValue.className = className;
    metricValue.textContent = value;
    metric.append(metricLabel, metricValue);
    metrics.append(metric);
  }
  button.append(heading, metrics);

  const marker = markers[index];
  button.addEventListener("mouseenter", () => {
    marker.setRadius(16).bringToFront().openPopup();
  });
  button.addEventListener("mouseleave", () => {
    marker.setRadius(12).closePopup();
  });
  button.addEventListener("focus", () => {
    marker.setRadius(16).bringToFront().openPopup();
  });
  button.addEventListener("blur", () => {
    marker.setRadius(12).closePopup();
  });
  button.addEventListener("click", () => {
    map.setView(marker.getLatLng(), Math.max(map.getZoom(), CONFIG.ZOOM + 2));
    marker.openPopup();
  });

  item.append(button);
  placeStatusList.append(item);
});

let places = []; // { name, marker, times, temp, rh, hi }
let nowIdx = 0;
let loading = false;
let lastUpdatedAt = null;

function setDataStatus(message, state = "ok") {
  dataStatusEl.textContent = message;
  dataStatusEl.dataset.state = state;
}

function formatUpdateTime(date) {
  return date.toLocaleTimeString("en-PH", { hour: "numeric", minute: "2-digit" });
}

window.getHeatAssistantContext = () => {
  if (!places.length) return "Forecast data is not available yet.";

  const offset = parseInt(slider.value, 10);
  const selectedIndex = nowIdx + offset;
  const selectedTime = places[0].times[selectedIndex];
  const readings = places.map(place => {
    const heatIndex = place.hi[selectedIndex];
    if (heatIndex == null) return `${place.name}: no forecast data for this hour.`;

    const heatCategory = category(heatIndex);
    let peak = null;
    for (let i = selectedIndex; i < Math.min(selectedIndex + 24, place.hi.length); i++) {
      if (place.hi[i] != null && (peak == null || place.hi[i] > peak)) peak = place.hi[i];
    }

    return `${place.name}: heat index ${heatIndex.toFixed(1)}°C (${heatCategory.label}), ` +
      `air temperature ${place.temp[selectedIndex].toFixed(1)}°C, ` +
      `relative humidity ${place.rh[selectedIndex].toFixed(0)}%` +
      (peak == null ? "" : `, next-24-hour peak ${peak.toFixed(1)}°C`);
  });

  return `Forecast hour: ${selectedTime.replace("T", " ")} (${CONFIG.TIMEZONE}). ` +
    `These are town-level model estimates, not street- or school-specific measurements.\n` +
    readings.join("\n");
};

function render() {
  if (!places.length) return;
  const off = parseInt(slider.value, 10);
  let idxShown = 0;

  for (const [placeIndex, p] of places.entries()) {
    const idx = Math.min(nowIdx + off, p.hi.length - 1);
    idxShown = idx;
    const hi = p.hi[idx];
    if (hi == null) {
      setPlaceReading(placeIndex, {
        status: "No data",
        color: "#94a3b8",
        temperature: "—",
        humidity: "—",
        heatIndex: "—",
        peak: "—"
      });
      p.marker.setStyle({ fillColor: "#94a3b8" });
      p.marker.setTooltipContent(`${p.name}: no forecast data`);
      p.marker.setPopupContent(`<b>${p.name}</b><br>Forecast data is unavailable for this hour.`);
      continue;
    }
    const cat = category(hi);

    // Peak heat index in the 24 hours starting at the selected hour
    let peak = -Infinity, peakIdx = idx;
    for (let i = idx; i < Math.min(idx + 24, p.hi.length); i++) {
      if (p.hi[i] != null && p.hi[i] > peak) { peak = p.hi[i]; peakIdx = i; }
    }

    setPlaceReading(placeIndex, {
      status: cat.label,
      color: cat.color,
      temperature: `${p.temp[idx].toFixed(1)}°C`,
      humidity: `${p.rh[idx].toFixed(0)}%`,
      heatIndex: `${hi.toFixed(1)}°C`,
      peak: Number.isFinite(peak) ? `${peak.toFixed(1)}°C · ${p.times[peakIdx].slice(11, 16)}` : "—"
    });

    p.marker.setStyle({ fillColor: cat.color });
    p.marker.setTooltipContent(hi.toFixed(0));
    p.marker.setPopupContent(
      `<b>${p.name}</b><br>
       Heat index: <b>${hi.toFixed(1)}°C</b> (${cat.label})<br>
       Temp ${p.temp[idx].toFixed(1)}°C · Humidity ${p.rh[idx].toFixed(0)}%<br>
       Peak next 24h: <b>${peak.toFixed(1)}°C</b> at ${p.times[peakIdx].slice(11, 16)}`
    );
  }

  const t = places[0].times[idxShown];
  whenEl.textContent = new Date(t).toLocaleString("en-PH", {
    weekday: "short", hour: "numeric", minute: "2-digit"
  }) + (off === 0 ? " (now)" : "");
  placePanelSubtitle.textContent = off === 0
    ? "Current forecast conditions"
    : `Forecast conditions · ${whenEl.textContent}`;
}

async function load() {
  if (loading || document.visibilityState === "hidden") return;

  if (window.location.protocol === "file:") {
    whenEl.textContent = "Start a local server to load heat index data.";
    setDataStatus("Start a local server to load weather data.", "error");
    markers.forEach((marker, i) => marker.setPopupContent(
      `<b>${CONFIG.PLACES[i][0]}</b><br>Open this site from http://localhost:8000 to load the forecast.`
    ));
    CONFIG.PLACES.forEach((_, i) => setPlaceReading(i, {
      status: "Unavailable", color: "#94a3b8",
      temperature: "—", humidity: "—", heatIndex: "—", peak: "—"
    }));
    placePanelSubtitle.textContent = "Start a local server to load forecast conditions";
    return;
  }

  loading = true;
  if (places.length) setDataStatus("Refreshing weather data...");

  const lat = CONFIG.PLACES.map(p => p[1]).join(",");
  const lng = CONFIG.PLACES.map(p => p[2]).join(",");
  const url = "https://api.open-meteo.com/v1/forecast" +
    `?latitude=${lat}&longitude=${lng}` +
    "&hourly=temperature_2m,relative_humidity_2m&current=temperature_2m,relative_humidity_2m" +
    `&timezone=${encodeURIComponent(CONFIG.TIMEZONE)}&forecast_days=${CONFIG.FORECAST_DAYS}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    let res;
    try {
      res = await fetch(url, { signal: controller.signal, cache: "no-store" });
    } finally {
      clearTimeout(timeout);
    }
    if (!res.ok) throw new Error("HTTP " + res.status);
    const json = await res.json();
    const arr = Array.isArray(json) ? json : [json];

    places = arr.map((d, i) => {
      const times = d.hourly.time;
      const temp = d.hourly.temperature_2m;
      const rh = d.hourly.relative_humidity_2m;
      const hi = temp.map((t, k) => (t == null || rh[k] == null) ? null : heatIndexC(t, rh[k]));

      if (i === 0) {
        const nowStr = d.current.time;
        nowIdx = 0;
        d.hourly.time.forEach((t, k) => { if (t <= nowStr) nowIdx = k; });
      }
      if (d.current.temperature_2m != null && d.current.relative_humidity_2m != null) {
        temp[nowIdx] = d.current.temperature_2m;
        rh[nowIdx] = d.current.relative_humidity_2m;
        hi[nowIdx] = heatIndexC(temp[nowIdx], rh[nowIdx]);
      }

      return { name: CONFIG.PLACES[i][0], marker: markers[i], times, temp, rh, hi };
    });

    slider.max = arr[0].hourly.time.length - 1 - nowIdx;
    if (parseInt(slider.value, 10) > slider.max) slider.value = slider.max;

    render();
    lastUpdatedAt = new Date();
    setDataStatus(`Weather data updated ${formatUpdateTime(lastUpdatedAt)}. ` +
      `Auto-refreshes every ${CONFIG.REFRESH_MINUTES} minutes.`);
  } catch (e) {
    if (!places.length) {
      whenEl.textContent = e.name === "AbortError"
        ? "Forecast request timed out. Check your connection and reload."
        : "Weather data unavailable. Check your connection and retry.";
      markers.forEach((marker, i) => marker.setPopupContent(
        `<b>${CONFIG.PLACES[i][0]}</b><br>Weather data is unavailable. Check your internet connection and reload the page.`
      ));
      CONFIG.PLACES.forEach((_, i) => setPlaceReading(i, {
        status: "Unavailable", color: "#94a3b8",
        temperature: "—", humidity: "—", heatIndex: "—", peak: "—"
      }));
      placePanelSubtitle.textContent = "Forecast conditions could not be loaded";
    }
    const errorMessage = !places.length
      ? "Weather data could not be loaded. Check your connection and retry."
      : lastUpdatedAt
        ? `Weather refresh failed. Last successful update: ${formatUpdateTime(lastUpdatedAt)}.`
        : "Weather refresh failed. Last successful update time is unavailable.";
    setDataStatus(errorMessage, "error");
    console.error("Load failed:", e);
  } finally {
    loading = false;
  }
}

slider.addEventListener("input", render);
load();
setInterval(load, CONFIG.REFRESH_MINUTES * 60 * 1000);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") load();
});
window.addEventListener("online", load);
