# 3HUE Market Intel

A focused marketing intelligence workspace for the markets that 3HUE serves.

## Project status

The first dashboard experience is now implemented and builds through Sites. It is a functional UI slice with representative findings and connection states so the team can review the workflow before live integrations are connected. HubSpot, analytics, scheduled collection, email, and Bring Your AI wiring are not connected yet.

## Agreed direction

- Serve 3HUE's marketing team with intelligence about the markets 3HUE supports.
- Collect foundational information first: ideal customer profiles, positioning, service priorities, competitors, and related strategy materials.
- Use that context to keep intelligence relevant and the everyday interface focused, with minimal controls.
- Support real-time or targeted information gathering for the team's marketing work. Specific sources, refresh timing, and first-release capabilities remain to be defined.
- Use Sites for the website, with this GitHub repository for source and project materials.

## Visual reference

See the [discovery notes](docs/discovery/solution-builder-reference.md) and [screenshot gallery](assets/brand/solution-builder/2026-09-09/README.md) for the second exploration and adoption guidance.

The existing [3HUE Solution Builder](https://builder.3hue.net/) is the requested look-and-feel reference. Its main service tabs, package and service detail panels, framework filters, guide, saved-quotes panel, and scheduling panel have been reviewed, with screenshots captured during exploration.

Reference patterns include the 3HUE branding, navy header, cyan navigation accents, orange highlights, rounded cards, pill-shaped filters, and right-side detail drawers.

Potential adaptations discussed include intelligence cards, source-linked detail panels, and a workspace for collecting findings into a brief. These are design ideas, not finalized feature commitments.

## Materials and organization

Independent public-source research is available in the [September 9, 2026 research dossier](docs/research/2026-09-09/README.md). Four reports cover company/services, markets/buyers/demand, competitors/public proof, and marketing content. Findings distinguish verified evidence, company claims, and analyst hypotheses. No website was built as part of this research.

The authenticated Builder catalog is preserved in the [Solution Builder catalog evidence bundle](docs/discovery/solution-builder-catalog-2026-09-09/README.md), including normalized service records, packages, pricing-status labels, trigger rules, and working buyer-persona mappings.

All 40 supplied September 8–9 source files are preserved in the [organized source library](assets/strategy/2026-09-08-09-source-library/README.md), with original filenames and a checksum manifest. The [document review and build-readiness assessment](docs/discovery/source-review-2026-09-09/README.md) covers every file, version conflicts, and the remaining product decisions.

Materials are organized by purpose:

- `assets/strategy/`: supplied ICPs, positioning, service priorities, and other foundational documents.
- `assets/brand/`: supplied logos, brand guidelines, and visual references.
- `docs/`: planning notes, requirements, decisions, and summaries derived from the supplied materials.

Original documents are preserved separately from derived planning notes.

## Current dashboard slice

The application includes three switchable views (Analyst, Director, and C-suite), focused search and segment filtering, evidence detail drawers, dashboard customization, source-coverage health, a read-only HubSpot funnel preview, and Bring Your AI connection settings. The current data is explicitly representative; it is not presented as live CRM or market data.

Source code lives in `app/`, with Sites configuration in `.openai/hosting.json`. API keys, credentials, and live CRM data must stay in runtime secrets or connected services rather than GitHub.

## Next implementation steps

1. Validate the first dashboard slice with the marketing team and refine the default widgets.
2. Add authenticated persistence for layouts, findings, briefs, and admin strategy in D1/R2.
3. Connect HubSpot, GA4, Search Console, YouTube/vidIQ, and coverage-gap reporting through supported interfaces.
4. Add the four-hour collector, 6:00 a.m. Central digest, Bring Your AI provider adapters, and seven-day pilot checks.
