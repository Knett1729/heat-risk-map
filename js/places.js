// Table on places.html. Depends on data.js.
const tbody = document.getElementById("tbody");
const statusEl = document.getElementById("status");
const searchEl = document.getElementById("search");
const sortEl = document.getElementById("sort");

let rows = [];
let openName = null;

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

function fmt(n, d) { return n == null ? "–" : n.toFixed(d); }

function sorted(list) {
  const copy = [...list];
  const by = sortEl.value;
  if (by === "name") copy.sort((a, b) => a.name.localeCompare(b.name));
  else if (by === "peak") copy.sort((a, b) => (b.peak ?? -1) - (a.peak ?? -1));
  else copy.sort((a, b) => (b.hi ?? -1) - (a.hi ?? -1));
  return copy;
}

function stripHtml(r) {
  let cells = "";
  const end = Math.min(r.nowIdx + 24, r.hourlyHi.length);
  for (let k = r.nowIdx; k < end; k++) {
    const v = r.hourlyHi[k];
    if (v == null) continue;
    const c = HeatIndex.category(v);
    cells += `<div style="background:${c.color};color:${textOn(c.color)}"
      title="${esc(r.times[k].replace("T", " "))}: ${v.toFixed(1)}°C (${c.label})">
      ${r.times[k].slice(11, 13)}<br>${v.toFixed(0)}</div>`;
  }
  return `<div class="strip">${cells}</div>`;
}

function draw() {
  const q = searchEl.value.trim().toLowerCase();
  const list = sorted(rows.filter(r => r.name.toLowerCase().includes(q)));
  if (!list.length) {
    tbody.innerHTML = '<tr><td colspan="6">No places match your search.</td></tr>';
    return;
  }
  tbody.innerHTML = list.map(r => {
    let html = `<tr class="row" data-name="${esc(r.name)}">
      <td><b>${esc(r.name)}</b></td>
      <td>${fmt(r.temp, 1)}°C</td>
      <td>${fmt(r.rh, 0)}%</td>
      <td>${badgeHtml(r.category, fmt(r.hi, 1) + "°C")}</td>
      <td>${esc(r.category.label)}</td>
      <td>${fmt(r.peak, 1)}°C at ${r.peakTime}</td>
    </tr>`;
    if (openName === r.name) {
      html += `<tr class="detail"><td colspan="6">
        <b>Heat index for the next 24 hours</b> (hour of day, °C)${stripHtml(r)}
      </td></tr>`;
    }
    return html;
  }).join("");
}

tbody.addEventListener("click", e => {
  const tr = e.target.closest("tr.row");
  if (!tr) return;
  openName = (openName === tr.dataset.name) ? null : tr.dataset.name;
  draw();
});
searchEl.addEventListener("input", draw);
sortEl.addEventListener("change", draw);

(async function () {
  try {
    rows = await loadHeatData();
    statusEl.textContent = "Updated " + new Date(rows[0].time).toLocaleString("en-PH", {
      weekday: "short", hour: "numeric", minute: "2-digit"
    }) + ". Click a row to see the next 24 hours.";
    draw();
  } catch (e) {
    statusEl.textContent = "Failed to load data. Check your internet connection.";
    console.error("Load failed:", e);
  }
})();