# Contributing

Thanks for helping improve Heat Risk Map. The website uses plain HTML, CSS, and JavaScript without a frontend build step. The optional AI proxy in `heat-ai-proxy/` uses Node.js, npm, and Wrangler.

## Run the project

1. Fork and clone the repository.
2. Start a local static web server from the repository root:

   ```sh
   python -m http.server 8000
   ```

   Or use VS Code Live Server to serve `index.html`.
3. Open <http://localhost:8000> or the Live Server URL. Do not open the HTML through `file://`; the browser blocks the forecast request from local files.
4. To use the hosted AI assistant locally, ensure the exact local origin is included in the Worker's `ALLOWED_ORIGINS` configuration. See the [deployment guide](docs/DEPLOYMENT.md).

## Verify a change

There is no automated frontend test suite or configured `npm test` suite at the repository root. For JavaScript changes, run syntax checks for the affected files:

```sh
node --check js/app.js
node --check js/assistant.js
```

For changes to the heat-index code, also check representative formula examples and all five displayed categories in the map. For UI changes, manually verify the affected interaction at desktop and mobile viewport sizes, keyboard access where relevant, forecast loading, and visible attribution.

For the AI Worker, from `heat-ai-proxy/` run:

```sh
npm install
npx wrangler deploy --dry-run
```

For a user-facing change, follow the [testing and demo guide](docs/2026-10-22-testing-and-demo/README.md). Record what was checked and any limitations in the pull request.

## Issues and proposed changes

- Search existing issues before opening a new one. Use the [bug report](.github/ISSUE_TEMPLATE/bug_report.yml) for a reproducible defect and the [feature request](.github/ISSUE_TEMPLATE/feature_request.yml) for a proposed capability.
- For a substantial change, open an issue first to agree on scope. Include the affected users, expected behavior, and safety or data implications.
- Keep each pull request focused. Use a descriptive branch and commit message.
- Open a pull request against `main`, complete the [pull request checklist](.github/pull_request_template.md), link the related issue, and include screenshots for visual changes.
- Never include credentials, private data, or unreviewed generated dependencies in an issue or pull request.

## Project guidelines

- Keep runtime dependencies minimal. Leaflet is loaded from its CDN; Wrangler is needed only for AI proxy development and deployment.
- Keep Open-Meteo and OpenStreetMap attribution visible and follow their terms.
- Do not present model estimates or AI responses as official warnings or individualized medical advice.
- Preserve accessible labels, keyboard operation, and responsive layouts.
- Follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Good first contributions

Add configured towns, translate the UI to Cebuano or Filipino, improve mobile or keyboard accessibility, clarify forecast limitations, or improve the documentation.
