# Project progress, versions, and releases

## Current release status

The project does not currently declare a released application version or Git tag. The `1.0.0` version in `heat-ai-proxy/package.json` identifies that npm package; it is not a release number for the website.

Until the maintainers publish the first application release, changes are recorded under **Unreleased** in the root [CHANGELOG.md](../../CHANGELOG.md). When application releases begin, use Semantic Versioning:

- **MAJOR** for incompatible changes to documented behavior or configuration.
- **MINOR** for backward-compatible user-facing features.
- **PATCH** for backward-compatible fixes and documentation corrections.

Tag application releases as `vMAJOR.MINOR.PATCH`. Keep the Worker package version separate unless it is intentionally released and versioned independently.

## How the project evolved

The repository history shows this progression:

| Date | Milestone |
|---|---|
| 2026-10-22 | Initial project files established the static heat-risk map, forecast calculations, and interface. |
| 2026-10-22 | Initial documentation and the AI assistant's scope were added and clarified. |
| 2026-10-22 | The Cloudflare AI proxy and browser client were added; navigation and deployment documentation were organized; stale exposure-timer claims and references were removed. |
| 2026-10-22 | Topic-based project, forecast, assistant, and UI documentation was added. |
| 2026-10-22 | Architecture, specification, release, testing/demo, and license documentation plus contribution templates were added. |

Commit history remains the source of truth for exact code changes. The table is a high-level milestone summary, not a substitute for reviewing commits.

## Changelog maintenance

Add user-visible changes to `CHANGELOG.md` under **Unreleased**, grouped as Added, Changed, Fixed, or Removed. At release time, move those entries under a dated version heading and create a corresponding Git tag. Include documentation and configuration changes when they affect users or contributors. Avoid documenting internal edits that do not change observable behavior.

## Related project records

- [Changelog](../../CHANGELOG.md)
- [Specification](../2026-10-22-specification/README.md)
- [Architecture and impact](../2026-10-22-architecture-and-impact/README.md)
- [Contribution guide](../../CONTRIBUTING.md)
