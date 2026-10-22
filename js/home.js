// Fills the stats and legend on index.html. Depends on data.js.
(async function () {
  const $ = id => document.getElementById(id);
  const DANGER = HeatIndex.DANGER_THRESHOLD_C;

  $("legend").innerHTML = [...HeatIndex.CATEGORIES].reverse()
    .map(c => `<div><i style="background:${c.color}"></i>${c.label} (${c.range}°C)</div>`)
    .join("");

  try {
    const rows = await loadHeatData();
    const valid = rows.filter(r => r.hi != null);
    if (!valid.length) throw new Error("no data");

    const hottest = valid.reduce((a, b) => (b.hi > a.hi ? b : a), valid[0]);
    $("stat-hottest").textContent = hottest.name;
    $("stat-hottest-sub").textContent = `${hottest.hi.toFixed(1)}°C · ${hottest.category.label}`;
    $("stat-danger-now").textContent = valid.filter(r => r.hi >= DANGER).length;
    $("stat-danger-24h").textContent = valid.filter(r => r.peak != null && r.peak >= DANGER).length;
    $("stat-count").textContent = rows.length;
    $("stat-updated").textContent = "Updated " + new Date(rows[0].time).toLocaleString("en-PH", {
      weekday: "short", hour: "numeric", minute: "2-digit"
    });
  } catch (e) {
    $("stat-hottest").textContent = "Unavailable";
    $("stat-hottest-sub").textContent = "Could not load data";
    console.error("Load failed:", e);
  }
})();