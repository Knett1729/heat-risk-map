# Deployment guide

The static map and its AI assistant are deployed separately:

- Vercel serves the static HTML, CSS, and browser JavaScript from the repository root.
- A Cloudflare Worker in `heat-ai-proxy/` checks the request origin and calls Cloudflare Workers AI.

The map can still display forecasts if the AI Worker is unavailable; only assistant replies depend on it.

## Publish the map with Vercel

1. Import the GitHub repository into Vercel and select the project root as the **Root Directory**.
2. Choose the **Other** framework preset. This is a static site and has no build command; set **Output Directory** to `.` if Vercel does not detect it automatically.
3. Deploy the project. `vercel.json` redirects `/` to `/map.html`; the `.vercelignore` file excludes the Worker source, repository documentation, and Git metadata from the website deployment.
4. Open the production domain Vercel assigns and confirm the map, CSS, map tiles, and forecast load.
5. If you add a custom domain, verify its DNS and HTTPS status in Vercel before sharing it.

For the AI assistant, the browser origin is the exact site origin, such as `https://your-project.vercel.app`. It includes the scheme but not a path or trailing slash. If Vercel preview deployments should also use AI, add each needed preview origin explicitly; otherwise keep AI access limited to the production domain.

GitHub Pages is no longer the documented hosting target. The project may still be deployed there separately, but its project-site URLs have a different origin and require their own Worker allowlist entry.

## Deploy the AI Worker

The Worker requires a Cloudflare account with Workers AI available and a configured Workers AI binding.

1. Install Node.js and npm if they are not already installed.
2. From the project root, install the Worker development dependency:

   ```sh
   cd heat-ai-proxy
   npm install
   ```

3. Authenticate Wrangler with your Cloudflare account:

   ```sh
   npx wrangler login
   ```

4. Return to the project root, then edit `heat-ai-proxy/wrangler.jsonc`. Set `ALLOWED_ORIGINS` to a comma-separated list of exact browser origins that should be allowed to call the Worker. Include your Vercel production origin and any local development origins you use. Do not include paths or trailing slashes. For example:

   ```jsonc
   "ALLOWED_ORIGINS": "https://your-project.vercel.app,http://localhost:8000,http://127.0.0.1:8000"
   ```

5. From the project root, deploy the Worker:

   ```sh
   cd heat-ai-proxy
   npx wrangler deploy
   ```

6. Return to the project root and copy the Worker URL printed by Wrangler into `AI_ENDPOINT` in `js/ai-client.js`. Do not add a trailing slash.

   ```sh
   cd ..
   ```

7. Commit and push the frontend change so Vercel deploys the correct Worker URL.

The Worker name, Workers AI binding, and default allowed origins are in `heat-ai-proxy/wrangler.jsonc`. The model and request-size limits are in `heat-ai-proxy/src/index.js`. The browser does not need an AI API key; do not put Cloudflare credentials or secrets in frontend files.

## Update the allowed origins

`ALLOWED_ORIGINS` must match the browser's `Origin` header exactly. Scheme, hostname, and port are significant. For example, these are different origins:

- `http://localhost:5500`
- `http://127.0.0.1:5500`
- `https://your-project.vercel.app`

Changing `ALLOWED_ORIGINS` in the config does not update an already deployed Worker. Deploy it again from `heat-ai-proxy` after editing the value.

## Verify the deployment

Check a preflight request from the site's origin. Replace the URL and origin with your deployed values:

```sh
curl -i -X OPTIONS "https://YOUR-WORKER-URL" -H "Origin: https://your-project.vercel.app" -H "Access-Control-Request-Method: POST" -H "Access-Control-Request-Headers: content-type"
```

The response should be `204` and include `Access-Control-Allow-Origin` with the requested origin, plus `POST, OPTIONS` in `Access-Control-Allow-Methods`.

To test an AI reply:

```sh
curl -i -X POST "https://YOUR-WORKER-URL" -H "Origin: https://your-project.vercel.app" -H "Content-Type: application/json" --data '{"messages":[{"role":"user","content":"Reply with OK."}]}'
```

A successful response is JSON with a `reply` field. This invokes Workers AI and may count toward your Cloudflare usage.

## Troubleshooting

- **The browser says it could not reach the AI service:** confirm `AI_ENDPOINT` is the deployed Worker URL, redeploy the Worker after changing its configuration, and check that `ALLOWED_ORIGINS` includes the exact site origin. After publishing frontend changes, reload the site to ensure it is not using cached JavaScript.
- **The preflight response has no `Access-Control-Allow-Origin`:** the request origin is not in the deployed allowlist. Add it without a trailing slash and redeploy.
- **The Worker returns `403 Origin not allowed`:** the same origin check rejected the request. Check the browser address bar's site origin, including its scheme and port.
- **The Worker returns `503`:** the request reached the Worker, but Workers AI did not return a usable answer. Check Cloudflare Workers AI availability, account limits, and the Worker logs.
- **Local development works on one address but not another:** `localhost` and `127.0.0.1` are different browser origins; add the exact one you use.

Never put a Cloudflare API token in browser JavaScript or commit it to the repository.
