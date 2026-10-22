// Calls the hosted open-weight model through your Cloudflare Worker.

// EDIT THIS after you deploy the Worker (Step 5). No trailing slash.
const AI_ENDPOINT = "https://heat-ai-proxy.johnkennithmadera.workers.dev";

function buildSystemPrompt(forecastContext) {
  const now = new Date().toLocaleString("en-PH", {
    timeZone: "Asia/Manila", weekday: "long", month: "long", day: "numeric", hour: "numeric", minute: "2-digit"
  });
  return `You are the Heat Advisor for a heat index map of Central Visayas, Philippines.
Current local time: ${now}.
Use ONLY the forecast data below. Never invent numbers. If the answer is not in the data, say you do not have it.
Hourly values are heat index in C, written hour(24-hour clock)h=value+levelcode. Example: 14h=45D means 2 PM, 45C, Danger.
Level codes: N=Not hazardous (below 27), C=Caution (27-32), E=Extreme Caution (33-41), D=Danger (42-51), X=Extreme Danger (52+). Only hours 5h to 20h are listed.
Always give the heat index, the hour and the level name together. Give short, practical, general advice: drink water, use shade and rest breaks, move activity to a cooler hour, check on children and the elderly.
You are not a doctor. If someone describes confusion, fainting, hot dry skin or vomiting, tell them to get emergency medical help right away.
Forecasts are town-level estimates. Tell people to follow PAGASA advisories and school or work orders.
Reply in the language the user writes in, in under 120 words.

FORECAST DATA
${forecastContext}`;
}

async function askHostedModel(forecastContext, history, signal) {
  const messages = [{ role: "system", content: buildSystemPrompt(forecastContext) }, ...history.slice(-8)];
  const res = await fetch(AI_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
    signal
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `AI service error (${res.status})`);
  if (typeof data.reply !== "string" || !data.reply.trim()) {
    throw new Error("The AI service returned no answer.");
  }
  return data.reply;
}