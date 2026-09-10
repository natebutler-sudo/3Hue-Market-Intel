# 3HUE Experience — document-led implementation

Current phase: **1 — stopped on the clean image's residual header band**. The supplied plate now passes the native-size check at **2880×1621**, but the independent guardian rejected the remaining header-shaped navy band and sharp lower edge. No application code or deployed artwork has changed in this phase.

The eight user-supplied Markdown files are preserved byte-for-byte in [source](source/), with SHA-256 hashes in [source-manifest.json](source-manifest.json). Source audit findings remain claims until independently measured. The [override ledger](overrides.md) contains the three confirmed changes to the documents' defaults.

## Governing sequence

| Order | Original document | Required work and review |
| --- | --- | --- |
| Governing | [LEVELUP.md](source/LEVELUP.md) | Preserve architecture, consultative copy, color meaning, four stages and data boundaries; enforce phase order; defer P2/parallax/amber breathing. |
| 1 | [1-clean-plate.md](source/1-clean-plate.md) | Retouch original only; preserve geometry and illumination; remove all baked text/UI; exact-size check; guardian review; original/edit and close-ups; explicit user OK; only then responsive files and asset-only publish with old scene active. |
| 2a | [2a-baseline-stage-labels.md](source/2a-baseline-stage-labels.md) | Typed shared content, measured native-stage geometry, pins/chips, exact live labels, logo and decode-aware responsive image loading. |
| 2b | [2b-baseline-dialog-panel.md](source/2b-baseline-dialog-panel.md) | Modal/focus behavior, docked panels, typography, own service-family list, working Talk links and independent maturity panel. |
| 3 | [3-phones-tablets.md](source/3-phones-tablets.md) | Composed phones/portrait/short screens, correct scene framing/sheets, navigation rows, safe areas, touch targets and supplied logo. |
| 4 | [4-motion-routes.md](source/4-motion-routes.md) | Clamped camera, manual maturity climb, measured arc highlights, door plates, state/history routes and prepaint cover. Re-run every earlier acceptance check. |
| 5 | [5-kiosk-share.md](source/5-kiosk-share.md) | Independently measured perspective kiosk with shared aggregates only; published-page screenshots, metadata, icons, test-then-static share pages and preview-bot verification. |
| 6 | [6-walk-dashboard.md](source/6-walk-dashboard.md) | Manual caption walk, dashboard accessibility, carousel pause/focus and lobby links; preserve existing functions/countdown. Re-run every earlier check. Optional 40-second idle tour only after required checks pass and then guardian review again. |

This table is an index, not a substitute for the full instructions. [requirements.json](requirements.json) retains every nonblank source line in traceable blocks, including formulas, measurements, restrictions and viewports. [acceptance.md](acceptance.md) retains all **43 original Done-when bullets** verbatim. Every requirement has a source, target, expected result, measured-result field, evidence field and Pass / Fail / Not run state. Each complete bullet, including all clauses, must pass; a viewport list is not a shortened replacement.

Instruction blocks that reference acceptance bullets link to their canonical `acceptanceId`, mirror its observations and review states, and are explicitly excluded from separate acceptance counts.

## Implementation and guardian loop

1. Implement only the current document's work and run its checks.
2. Independent guardian inspects original requirements, candidate artwork/code/behavior and evidence.
3. Rejections record source requirement, observed result, expected result and correction. Correctable defects return for correction and another independent review without a fixed retry limit.
4. Mandatory unavailable checks stay **Not run**. External limitations are reported; ineffective retries do not substitute for verification.
5. Publish the accepted candidate; guardian independently verifies the live result. A live failure returns to correction and republish.
6. Advance only after that phase passes. Phase 1 additionally requires the user's explicit artwork OK; guardian acceptance cannot replace it.

The implementation agent is the primary agent. `/root/experience_guardian` independently reviews and does not change the implementation or publish it. Plan approval is not artwork, candidate or live acceptance.

## Current evidence and outstanding work

- [Phase 1 candidate 01 rejection](reviews/phase-1-candidate-01.md): built-in edit was undersized at 1672×941; artwork not accepted.
- [Phase 1 candidate 02 rejection](reviews/phase-1-candidate-02.md): supplied 2880×1621 plate passes size, but retains the prohibited header band; artwork not accepted.
- [Documentation guardian review and correction](reviews/documentation-checkpoint.md): archive/register accepted for GitHub; this is not artwork or live-site acceptance.
- **1 acceptance item Fail; 2 Pass; 40 Not run.** No phase marked complete.
- Header-band removal, full geometry acceptance, comparisons after correction and user image approval remain outstanding. No responsive derivatives or asset publication occurred.
- Phases 2a–6 are **Not run**, blocked by the sequential phase-1 gate.
- To resume under the current requirements, supply a corrected retouched 16:9 plate with the header band removed, at least 1920×1080. It must still pass guardian checks and the user artwork gate. An explicit user change to the removal or geometry rule would be a new override, not something the agents can assume.

Both rejected candidates stay outside application assets. The undersized built-in result was not adopted, upscaled, cropped or padded; the supplied candidate was not adopted because of the residual band. The currently published Experience remains as before this execution phase.

## Register verification

`build-register.py` produced the initial archive/register from the user originals. It asserts all eight copies are byte-identical, retains every nonblank source line, and checks phase bullet counts 5/5/6/7/8/6/6 = 43. It is an initialization tool: preserve/migrate subsequent review observations before rerunning it.

The supplied originals contain trailing spaces on two empty Booking link lines and an ending blank line. The folder's Git attributes preserve those exact source bytes and exempt only the original files from blank-line/trailing-space checks; derived documents remain checked normally.

No application build is needed for this documentation-only checkpoint; application build and browser acceptance remain **Not run** for this implementation.
