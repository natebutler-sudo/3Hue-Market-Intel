# 3HUE marketing enablement — status (updated 2026-09-04)

## The document set (read in this order)
1. **claude/3hue-maturity-gap-report.html** — *The Maturity Gap*. The research: why orgs don't mature on NIST/ISO/SOC 2/ITIL/COBIT, 60+ verified 2024–2026 statistics, and social-listening exhibits with working links across LinkedIn, X, Reddit, YouTube, TikTok and Hacker News.
2. **claude/3hue-icp-forcing-function.html** — *The Forcing Function*. The ICP: three ranked segments, an interactive 100-point fit scorer with tier thresholds and plays, buying-committee personas, trigger detection signals, disqualifiers.
3. **claude/3hue-message-stack.html** — *The Message Stack*. The words: core narrative, positioning, three pillars, per-segment messaging, **claims library with substantiation status**, objection handling, four battlecards, approved vocabulary, boilerplate.
4. **claude/3hue-brand-sheet.html** — *3HUE Brand Sheet* (v2). The identity: **the name, founder-sourced (section 01)**, logo system + ISG/OPS/ITG marks, color with WCAG contrast analysis, typography, UI tokens, usage rules, verbal identity and naming conventions, asset inventory, AiVRIC, observations.
5. **claude/3hue-ship-list.html** — *The Ship List*. Execution: 90-day sequence, questionnaire-teardown lead magnet, ready-to-paste landing page copy, six-post founder series, four-touch outreach sequence, eleven-question discovery script, offer one-pagers, case study rebuild spec, six measures.

Research notes (raw material): `claude/research-notes/01-company-profile.md`, `02-market-data.md`, `03-social-listening.md`, `04-youtube-channel-plan.md`, `05-youtube-keyword-competitor-data.md`, `06-inherited-docs-reconciliation.md`, **`07-founder-call-2026-09-03-name-origin.md`** (what 3HUE means, in the founder's words, with timestamps).

## Core thesis
3HUE's best customer has just been told to prove its security by someone with leverage — a customer, insurer, investor or regulator — and has nobody inside to do it. Orgs don't buy maturity on principle (68% have ≤1 security FTE; 61% only certify when a contract requires it; 72% still run periodic rather than continuous assessment). Segments: **Segment 01 Provable Vendor** ~60%, **Segment 02 Portfolio** (PE under $25B AUM, 29% vs 81% diligence gap) ~25%, **Segment 03 Regulated Operator** ~15%. (Renamed from Hue 01–03 on 2026-09-04; see correction log.)

## Correction log
- **2026-09-04 — What the name means.** v1 of the Brand Sheet inferred that the "three" in 3HUE referred to the three practices (ISG/OPS/ITG) and recommended color-coding them to make the name literal. Wrong. On the 2026-09-03 call Andrew gave the real account: the name came from the three founders being of different hues (an inclusive name), the "three hues of security" marketing line was tried and dropped, and the meaning he holds now is a standard — the highest possible level of execution, used as an adjective ("get a 3HUE on it"). Not an acronym. Changes made: Brand Sheet section 01 (new) and observation rewritten; ICP/Ship List/Message Stack/Capability Map segment labels renamed Hue 01–03 → Segment 01–03; Message Stack vocabulary updated; research note 07 added. The founding story is personal and is public only in Andrew's own telling.

## Claims marked DO NOT USE (from the claims library)
- "40% of cyber insurance claims denied" — unsourced
- Any dollar size for the vCISO market — no credible source
- Current TOGAF/COBIT adoption rates — no data exists
- "ISO 27001 certifications doubled" — methodology artifact
- Any "we reduce audit cost/time by X%" — no baseline measured
- Any client count or unnamed-client logo — no verifiable number, no consent
- "3HUE stands for…" / "the three hues of security" / "three hues = three practices" — the name is not an acronym; founder rejected the reading (note 07)
- CMMC as live/enforced — Phase II suspended 13 Jul 2026; 800-171 + DFARS 7012 still apply. Re-verify before any DIB campaign.

## Decisions only Andrew can make (blocking)
1. **Publish pricing or not.** Buyers explicitly reward transparency; nobody in the category does it. Blocks the one-pagers and website.
2. **3HUE ↔ AiVRIC naming.** Endorsement, powered-by, or separate. Boilerplate currently drafts powered-by. Once decided it becomes a Brand Sheet rule, and the three differing self-descriptions (website / LinkedIn / BBB) should be reconciled.
3. **Who owns distribution.** Company page 577 followers, no visible posts; Andrew's profile 2,003 followers and all the reach.
4. **Whether the founding story goes public.** Three founders, different hues, the Vegas test, the cafe — it is a strong About-page and on-camera story, and it is his to tell or keep. Until he decides, company copy uses only the "standard of execution" meaning.

## Settled since v1
- **What 3HUE means** — founder-sourced 2026-09-03; Brand Sheet section 01 is now the rule. The "3HUE standard" / "get a 3HUE on it" language is approved vocabulary.

## Access used (what works)
- LinkedIn, X, TikTok: logged-in sessions in the Claude browser pane on Nate's Mac.
- Reddit: blocked in WebFetch and the browser pane; works through Claude in Chrome.
- Live site CSS/assets: extracted via Claude in Chrome `javascript_tool` (long base64 output is blocked; screenshot with `save_to_disk` works and lands in the container).
- Cloud container has no external web egress — Playwright renders local files only.

## Still missing (would convert judgment into fact)
- **Won-lost history** tagged by segment/trigger/size — highest value; would confirm or overturn the 60/25/15 split. Validation method: re-score 20 closed deals against the fit model; if tiers don't separate wins from losses, move the weights, not the definitions.
- **Search Console + Analytics** for 3hue.net — access was granted on the 2026-09-03 call (GA4 already existed; Search Console added as editor). Pull the baseline: users by source, top pages, dwell/bounce, peaks vs LinkedIn post dates. Andrew's own read: Singapore and China lead the geo split, which is noise to filter, not a market.
- LinkedIn page analytics; Sales Navigator for territory sizing.
- Asset gaps: no vector logo master, no compact/knockout/stacked lockups, no trust page, no published slide or proposal template.
