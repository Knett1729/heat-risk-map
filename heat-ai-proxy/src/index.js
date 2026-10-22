// Heat AI proxy: lets your website call an open-weight model hosted on Cloudflare Workers AI.
// The model is fixed here (not chosen by the browser) and requests are size-limited.

const MODEL = "@cf/meta/llama-3.1-8b-instruct-fast"; // open-weight Llama 3.1 8B
const MAX_MESSAGES = 20;
const MAX_CHARS = 12000;  // per message (the forecast data lives in the system message)
const MAX_TOKENS = 400;   // max length of the reply

function corsHeaders(request, env) {
  const origin = request.headers.get("Origin") || "";
  const allowed = (env.ALLOWED_ORIGINS || "").split(",").map(s => s.trim()).filter(Boolean);
  if (!allowed.includes(origin)) return { Vary: "Origin" };
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin"
  };
}

function json(obj, status, headers) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", ...headers }
  });
}

export default {
  async fetch(request, env) {
    const cors = corsHeaders(request, env);

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method !== "POST") return json({ error: "Use POST." }, 405, cors);
    if (!cors["Access-Control-Allow-Origin"]) return json({ error: "Origin not allowed." }, 403, cors);

    let body;
    try { body = await request.json(); }
    catch (e) { return json({ error: "Invalid JSON." }, 400, cors); }

    const input = body && body.messages;
    if (!Array.isArray(input) || input.length === 0 || input.length > MAX_MESSAGES) {
      return json({ error: `messages must be a list of 1 to ${MAX_MESSAGES} items.` }, 400, cors);
    }

    const messages = [];
    for (const m of input) {
      if (!m || !["system", "user", "assistant"].includes(m.role) || typeof m.content !== "string") {
        return json({ error: "Each message needs a role (system, user, assistant) and text content." }, 400, cors);
      }
      messages.push({ role: m.role, content: m.content.slice(0, MAX_CHARS) });
    }

    try {
      const out = await env.AI.run(MODEL, { messages, max_tokens: MAX_TOKENS, temperature: 0.2 });
      // Most models return { response }, some return an OpenAI-style { choices }.
      const reply = typeof out?.response === "string"
        ? out.response
        : (out?.choices?.[0]?.message?.content ?? "");
      if (!reply) return json({ error: "The model returned no answer." }, 502, cors);
      return json({ reply: reply.trim() }, 200, cors);
    } catch (e) {
  console.error("Workers AI error:", e);

  return json({
    error: "AI request failed.",
    details: String(e?.message || e)
  }, 503, cors);
}
}
};