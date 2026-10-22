# AI assistant

## Purpose and scope

The optional assistant provides short, general heat-safety guidance about the map's selected forecast. It can summarize supplied town readings and suggest general precautions such as water, shade, rest breaks, and planning activities for cooler hours.

The AI does not calculate the map's forecast, retrieve live weather, locate the visitor, measure personal exposure, or assess an individual's health. It is not a clinician, an emergency service, or an official warning source, and it cannot determine that an activity is safe. Its answers may be incomplete or incorrect.

## Request flow

1. A visitor submits a question in the assistant panel.
2. `js/app.js` supplies the currently selected forecast hour and configured-town readings through `window.getHeatAssistantContext()`.
3. `js/ai-client.js` combines this forecast context, the assistant instructions, and recent conversation entries.
4. The browser sends the request to `AI_ENDPOINT`.
5. `heat-ai-proxy/src/index.js` validates the request and allowed origin, then invokes the configured Workers AI model.
6. The Worker returns a short reply to the browser.

## Data sent

Each request includes the selected forecast context and up to eight recent conversation entries. The conversation is held in browser memory and is not saved by this frontend to local storage. The selected context includes the forecast time and town-level weather values.

Requests are processed by the configured Cloudflare Worker and Workers AI service to produce a response. Do not enter sensitive personal, account, or medical information. Refer to Cloudflare's current service terms and privacy information when evaluating how provider-side request data is handled.

## Configuration and limits

- Set the Worker URL in `AI_ENDPOINT` in `js/ai-client.js`.
- Set allowed website origins in `ALLOWED_ORIGINS` in `heat-ai-proxy/wrangler.jsonc`.
- The Worker fixes the model in `heat-ai-proxy/src/index.js`; the browser cannot select a different model.
- The Worker accepts between 1 and 20 messages, limits each message to 12,000 characters, and requests a maximum of 400 generated tokens.
- The browser request times out after 60 seconds.
- The assistant is optional. The map and forecast do not depend on it.

The origin allowlist enables browser CORS; it is not user authentication. Anyone can inspect browser code and call a public endpoint outside the browser, so do not put secrets in the frontend or assume CORS alone limits Worker use. Review Cloudflare usage and consider platform-side abuse controls before operating a public deployment.

See the [deployment guide](../DEPLOYMENT.md) for Worker setup and troubleshooting.

## Safety

Follow official PAGASA advisories and school or workplace guidance. For severe symptoms such as confusion, fainting, hot dry skin, or vomiting, seek emergency medical help.
