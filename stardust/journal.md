# Journal — Komatsu redesign

Chronological log of every prompt execution. Most recent at the bottom.
See `skills/stardust/reference/journal-format.md` for entry format.

---

## 2026-10-17T15:50:00Z — Extract (brand-surface-extraction, seed, brand-review, state-and-report) — homepage brand surface, current-state docs, review and state

**Prompt:** Finish the stardust extract (Phases 3 to 6) for a single-page capture of https://www.komatsu.com/en-us, as the first step of "modernize the homepage". The crawl, computed-style census and vision check were already done.

**Decisions:**
- Scope stays homepage-only (user choice). Every "cross-page" aggregate is the home page's own. System-component and repeated-heading detection were skipped because both need 3 or more pages, and the outputs say so.
- Logo: took the header `<img>` logo.svg (white wordmark), even though its 5:1 aspect is outside the locator chain's 0.5 to 3.0 guard. The steps after it would have picked a social card or a favicon. The blue footer wordmark was seen but not captured.
- Palette roles: background #ffffff (its cluster includes the #fafafa page ground), primary #140a9a, text-primary #1b232a, accent #253fc8 (outlines and hover only), text-secondary #4d545a, accent-1 #3366cc (tags), border #ededed, accent-2 #000000. Dropped by the 8-color cap: #d9d9d9, rgba(20,10,154,.3), #ffc82f.
- heroImage = the Scene7 hero `<img>` (1440 x 700). heroMedium = null: the hero has an empty video slot and no motion asset.
- Register `brand`. Tone guessed as `aspirational` (a heuristic).
- In the brand review, `--accent` falls back to `--primary` because no saturated palette color sits 60 degrees or more away in hue. `--primary-dark` is #140a9a darkened by 30%.
- state.json: `flow: redesign`, `flowSource: user-phrase` ("modernize the homepage"), pageCap 1, totalDiscovered 1.

**Artifacts touched:**
- stardust/current/_brand-extraction.json — created
- stardust/current/PRODUCT.md — created
- stardust/current/DESIGN.md — created
- stardust/current/DESIGN.json — created; cap-probe merged `extensions.breakpoints`
- stardust/current/brand-review.html — created
- stardust/current/assets/logo.svg — created
- stardust/current/assets/fonts/ (Noto Sans normal and italic, Roboto 400, Font Awesome 6 solid) — created
- stardust/state.json — created
- stardust/status.jsonl — updated (crawl end; brand-surface, seed, brand-review, state-and-report start and end)
- stardust/current/pages/en-us.json, en-us.html, _computed-styles.json, _crawl-log.json — read

**Findings worth flagging:**
- Every captured color maps onto the site's own CSS utility ramps (`.bg-primary-10/30/60`, `.bg-neutral-0/60/90`). The site also declares a yellow secondary ramp (secondary-30 #ffc82f), but the homepage paints it on only one element.
- The hero H1 is 32px at 1440 and 20px at 390, which is smaller than the 24px section H2s on phones. The type scale is ad-hoc (32, 24, 22, 20, 18, 16).
- The census sees no gradients because the hero overlay is a `::before` gradient. It was recorded from the CSS rule instead.
- Cap probe: the white module panels are capped at 1920px, the carousel at 1856px, and the shell is fluid. So the page runs edge to edge at every common desktop width.
- The page record's `_provenance.waitMode` is `"slow"`, which is a valid `crawl.mjs --wait` value. But the regex in state-machine.md § Provenance validation, `^(fast|medium|spec|networkidle|domcontentloaded)…$`, has no `slow`. A strict downstream validator would reject this page even though it was rendered live. The page record was not edited.

**Open questions:**
- Should the blue footer logo variant be captured before prototyping?
- Is the `waitMode: slow` mismatch with the provenance-validator regex a plugin spec gap? It affects every page crawled with `--wait slow`.

**Next:** Open stardust/current/brand-review.html to check the extraction, then run `$stardust direct` to set the homepage modernization direction.

---
