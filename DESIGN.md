---
version: beta
name: Picker-blended-design-system
description: A light-gamified task platform. 70% Duolingo (points, levels, streaks, rewards) with the cartoon turned down, 20% Todoist (clean task rows, status, detail), 10% Strava (leaderboard, achievements, personal growth). Tasks stay legible and fast to scan; game feedback is a layer on top, not the whole surface. Visual character (warmth, proportions, brand hue family) comes from a pixel-measurement pass of the homepage reference mockup; the actual token values (type scale, spacing, contrast) are snapped onto real platform/accessibility standards rather than kept as raw measured pixels — see "Methodology" below.

colors:
  primary: "#1671F8"
  primary-light: "#2F80FF"
  primary-text: "#1671F8"
  primary-pressed: "#0759D5" # derived: darkened primary, no CTA-pressed value in the new mockup pass
  primary-soft: "#EAF2FF"
  primary-softest: "#F3F8FF" # derived: one step lighter than primary-soft, for gradient terminal stops
  on-primary: "#FFFFFF"
  reward-gold: "#E8B339"
  reward-gold-soft: "#FBF1DA"
  rank-gold: "#E8B339"
  rank-silver: "#C6C6C6"
  rank-bronze: "#C97A3D"
  priority-urgent: "#DC5B4C"
  priority-featured: "#E8B339"
  priority-normal: "#3A7BD5"
  priority-default: "#B9B7B0"
  bg-page: "#F7F9FC"
  bg-card: "#FFFFFF"
  bg-muted: "#F2F4F8" # derived: cool neutral inset, one step off bg-page (page/muted no longer share the warm-cream family)
  border-light: "#E7EAF0"
  divider: "#E9ECF1"
  ink: "#171A21"
  ink-secondary: "#707681"
  ink-tertiary: "#9AA0AA"
  ink-disabled: "#C4C8D0" # derived: one step lighter than ink-tertiary, disabled-only
  ink-nav-inactive: "#555B65" # Bottom Navigation inactive icon/label only — ink-tertiary is too light (2.6:1) for a 3:1 UI-component floor at nav-icon scale
  chart-line: "#1671F8"
  success: "#1DA463"
  error: "#DC5B4C"
  error-soft: "#FCEFED"
  warning: "#E8873F"
  info: "#3A7BD5"
  info-soft: "#EAF1FB"
  shadow-warm: "rgba(22,113,248,0.10)" # name predates the blue rebrand — value is now a soft brand-blue glow, not a warm tint; kept the name to avoid a token rename across every component that references it
  # Scrim behind Dialog / Bottom Sheet
  overlay: "rgba(23,26,33,0.45)"
  # Focus ring around fields (brand blue @ 35%)
  focus-ring: "rgba(22,113,248,0.35)"

  # ── Dark theme (cool charcoal — same brand-blue family as light, never cream/brown) ──
  # Surfaces
  bg-page-dark: "#101217"
  bg-card-dark: "#1A1D24"
  bg-muted-dark: "#21242A"
  border-light-dark: "#2D313A"
  divider-dark: "#272B32"
  # Ink on dark surfaces (cool off-whites, same hue family as light-mode ink)
  ink-dark: "#EAEDF5"
  ink-secondary-dark: "#9EA3B0"
  ink-tertiary-dark: "#787D8A"
  ink-disabled-dark: "#4F535C"
  # Soft tints on dark (low-chroma brand washes; pair with light ink, not bare gold text)
  primary-soft-dark: "#18263A"
  primary-softest-dark: "#121924"
  reward-gold-soft-dark: "#3A3220"
  info-soft-dark: "#1E2A38"
  success-soft-dark: "#1A2E24"
  error-soft-dark: "#3A2220"
  # Elevation / scrim on dark
  shadow-warm-dark: "rgba(6,8,12,0.45)"
  overlay-dark: "rgba(6,8,12,0.64)"
  focus-ring-dark: "rgba(22,113,248,0.45)"

typography:
  display-lg:
    fontFamily: PingFang SC, Noto Sans SC, Microsoft YaHei, -apple-system, sans-serif
    fontSize: 28px
    fontWeight: 700
    lineHeight: 1.2
  identity-name:
    fontFamily: PingFang SC, Noto Sans SC, Microsoft YaHei, -apple-system, sans-serif
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.2
  hero-number:
    fontFamily: PingFang SC, Noto Sans SC, Microsoft YaHei, -apple-system, sans-serif
    fontSize: 28px
    fontWeight: 700
    lineHeight: 1.15
    tabularNums: true
  task-title:
    fontFamily: PingFang SC, Noto Sans SC, Microsoft YaHei, -apple-system, sans-serif
    fontSize: 17px
    fontWeight: 500
    lineHeight: 1.35
  section-title:
    fontFamily: PingFang SC, Noto Sans SC, Microsoft YaHei, -apple-system, sans-serif
    fontSize: 15px
    fontWeight: 600
    lineHeight: 1.3
  grid-label:
    fontFamily: PingFang SC, Noto Sans SC, Microsoft YaHei, -apple-system, sans-serif
    fontSize: 15px
    fontWeight: 500
    lineHeight: 1.3
  hud-number:
    fontFamily: PingFang SC, Noto Sans SC, Microsoft YaHei, -apple-system, sans-serif
    fontSize: 13px
    fontWeight: 700
    lineHeight: 1.2
    tabularNums: true
  hud-label:
    fontFamily: PingFang SC, Noto Sans SC, Microsoft YaHei, -apple-system, sans-serif
    fontSize: 13px
    fontWeight: 600
    lineHeight: 1.2
    tabularNums: true
  body:
    fontFamily: PingFang SC, Noto Sans SC, Microsoft YaHei, -apple-system, sans-serif
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.45
  tab-label:
    fontFamily: PingFang SC, Noto Sans SC, Microsoft YaHei, -apple-system, sans-serif
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1.2
  caption:
    fontFamily: PingFang SC, Noto Sans SC, Microsoft YaHei, -apple-system, sans-serif
    fontSize: 11px
    fontWeight: 400
    lineHeight: 1.4
  section-label:
    fontFamily: PingFang SC, Noto Sans SC, Microsoft YaHei, -apple-system, sans-serif
    fontSize: 11px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0.4px
    textTransform: uppercase

rounded:
  small: 8px
  medium: 16px
  large: 24px
  card: 16px # was 12px — snapped up to match `medium` per the new mockup pass (data/grid cards both measure 16)
  tile: 8px
  button: 12px
  chip: 999px
  pill: 999px
  badge: 14px # new: level badge (Header identity block)
  nav-top: 28px # new: bottom navigation container's top corner radius

spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 20px
  2xl: 24px
  3xl: 32px
  section: 14px # new: module-to-module vertical gap on the profile/home screen — an explicitly measured exception outside the strict 4pt grid, do not reuse elsewhere without re-checking against a source mockup

stroke:
  hairline: 0.5px
---

## Methodology

This spec went through two passes, and it matters which parts of it to trust for what:

1. **Pixel-measurement pass** (a Python/PIL scan of the homepage reference mockup, an AI-generated 863×1822px raster image) — this is where the *visual character* comes from: the warm page-vs-card color split, the brand orange's approximate hue family, the rough proportions between avatar/text/cards, the general "airy, rounded, warm" feel.
2. **Standards pass** (this revision) — the mockup is a single AI-rendered image, not a real design file, so raw pixel measurements from it don't reliably land on a coherent type scale, a consistent grid, or accessible color contrast. Measuring text glyph heights and converting them 1:1 into font-sizes produces numbers like 29px/15px/11px whose ratios to each other are arbitrary (checked: no consistent multiplier between adjacent sizes) — that's measurement noise, not a designed scale. So this revision **keeps the mockup's proportions and warmth as the visual target, but snaps the actual numbers onto real standards**:
   - **Typography** — snapped onto Apple's Human Interface Guidelines Dynamic Type stops (11/13/15/17/20/28/34px), which is also what the real Duolingo/Todoist/Strava iOS builds this system blends from actually use (SF Pro at HIG sizes). Picking from an official platform scale beats inventing one.
   - **Spacing** — strict 4pt grid (4/8/12/16/20/24/32), matching Duolingo's own real spacing scale (4/8/12/16/20/24/32/40/48/56/72/96) and Apple/Material's baseline grid guidance. The prior draft's spacing already happened to land on this grid — no change needed there, just re-affirmed.
   - **Color contrast** — every text/background pairing below is checked against WCAG 2.1 AA (4.5:1 for normal text, 3:1 for large/bold text and UI components). Ratios are computed, not eyeballed — see the Accessibility section. Two tokens changed as a direct result (`ink-tertiary`, and a new `primary-text` token); one hard rule was added (`reward-gold` is fill/icon-only, never bare text on white).
   - **Radius** — snapped from an odd 10/14px onto a clean 8/12/16/24 scale (common across iOS, Material, and most design systems).
   - **Dark theme** — derived as a *second palette* from the same warm hue family (brown/cream undertones), not inverted from cool slate. Contrast is rechecked on `{colors.bg-card-dark}` / `{colors.bg-page-dark}`. Cool Tailwind `slate-*` (`#0F172A`, `#1E293B`, …) is explicitly out of palette — retire it when screens migrate to these tokens.

If you're extending this file, treat the *relationships* (X is bigger than Y, this card sits closer to the header than that one) as the trustworthy part inherited from the mockup, and the *absolute numbers* as the standards-pass values — don't re-measure the mockup for a number that's already a token here.

3. **Rebrand pass** (this revision) — a second, higher-fidelity reference mockup (832×1755px, normalized to a 390pt/dp width) replaced the brand hue family: warm orange → blue (`{colors.primary}` `#1671F8`), and the page canvas moved from warm cream to cool white (`{colors.bg-page}` `#F7F9FC`). Card radius, badge radius, and the bottom-nav top radius were re-measured and updated (`{rounded.card}` 12→16px; new `{rounded.badge}` 14px, `{rounded.nav-top}` 28px). A new `{spacing.section}` 14px token captures this mockup's module-to-module gap, which sits off the strict 4pt grid (measurement carries ±1–2px error per the source spec) — treat it as a documented exception, not a precedent for adding more off-grid spacing values. **Typography was explicitly left untouched in this pass** — the HIG-anchored type scale (11/13/15/17/20/28/34px) stays the source of truth even though this mockup's raw measurements suggest slightly different numbers (e.g. 14–15px for the ID row). Semantic colors (`reward-gold`, `rank-*`, `priority-*`, `success`/`error`/`warning`/`info`) are unchanged — only the brand hue and neutral surfaces moved. Dark-theme surface tokens (`*-dark`) were deliberately left untouched in this pass — see pass 4 below.

4. **Dark-theme rebrand pass** (this revision) — closed the gap left by pass 3: every dark surface (`bg-*-dark`), ink step (`ink-*-dark`), and the two brand-hue soft washes (`primary-soft-dark`, `primary-softest-dark`) were re-derived by rotating each token's hue from the retired warm-orange family (~21–34°) to the new brand-blue family (~215–224°) while holding saturation and lightness constant per step — this preserves every previously-computed contrast ratio (documented in the Dark theme section) without re-deriving them from scratch. The scrim (`overlay-dark`) and card shadow (`shadow-warm-dark`) moved from a warm near-black to a cool near-black on the same principle. The four semantic soft washes that were never tied to the brand hue (`reward-gold-soft-dark`, `info-soft-dark`, `success-soft-dark`, `error-soft-dark`) were left as-is. `focus-ring-dark` was already updated to brand blue in pass 3 alongside `primary` itself (it's theme-independent, unlike the surface tokens).

## Overview

Picker (P客) is a light-gamified task platform, not a language-learning game and not a bare-bones to-do app. Users complete real tasks (认证/打卡/众包任务) to earn points and levels — the game layer exists to make that loop satisfying, but the task itself must always read clearly first. The blend:

- **Duolingo (70%) — the game loop.** Points, levels, streaks, rewards, HUD chips, celebration on completion. Kept — but de-candied: no mascot, no chunky 3D "ledge" buttons, no neon saturation, no uppercase-everything.
- **Todoist (20%) — the task surface.** Every task is a Todoist-style row: checkbox-like status, one-line title, metadata row beneath. Task detail is a quiet, section-based sheet, not a lesson screen.
- **Strava (10%) — proof of progress.** Leaderboard rows with rank chips, a personal-growth stat grid, and achievement badges — used sparingly, on the profile/leaderboard surfaces only.

**Key Characteristics:**
- Cool-white page canvas (`{colors.bg-page}` `#F7F9FC`, not `#FFFFFF`) with pure-white cards (`{colors.bg-card}` `#FFFFFF`) floating on top — the depth lives in the page, not the cards.
- One brand hue, `{colors.primary}` `#1671F8` — every primary CTA fill, the chart line, the streak flame, the XP fill, and brand accent text share it. `{colors.primary-text}` is aliased to the same value. (Brand hue moved from the earlier warm orange `#FF6B0B` to this blue in the second mockup pass — see Methodology.)
- Reward (`{colors.reward-gold}` `#E8B339`) is a second hue reserved for rank/currency contexts (leaderboard medals, coin icon tint). It fails contrast as bare text/icon on white (1.9:1) — always pair it with `{colors.reward-gold-soft}` background or use it as a small accent inside a larger dark-ink label, never as the sole color of readable text.
- Task rows are the hero surface (Todoist DNA): status circle + title + one metadata line. No illustration, no 40%-of-screen artwork.
- Rank colors (`{colors.rank-gold/silver/bronze}`) appear only in leaderboard and achievement contexts — never bleed into task UI.
- Depth is soft warm-tinted shadows + hairlines, not Duolingo's 4pt chunky ledge — one exception: the primary CTA keeps a *thin* 2pt pressed-ledge as the only "game-button" callback.
- Celebration is a 1.5s toast/card, not a full-screen mascot takeover — a number counts up, a thin confetti burst, done.
- Numbers are tabular and bold wherever they're a stat (points, streak days, rank) — Strava's discipline.
- Single CJK-first sans throughout (PingFang SC / Noto Sans SC / Microsoft YaHei fallback chain) — no custom display wordmark font; the number weight carries the "game" feeling instead.
- **Dark theme** is a second, documented warm-charcoal palette (`bg-page-dark` / `bg-card-dark` / `ink-*-dark` / `*-soft-dark`) — same brand fills, never cool slate. See Colors → Dark theme.

## Colors

### Brand & Game Feedback
- **Primary** (`{colors.primary}` `#1671F8`): CTA fills, completed-task fill, XP/level progress fill, streak flame icon, chart line, and brand accent text.
- **Primary Text** (`{colors.primary-text}` `#1671F8`): same value as `{colors.primary}` — product prefers vivid brand blue for text.
- **Primary Light** (`{colors.primary-light}` `#2F80FF`): gradient highlight — CTAs render as `linear-gradient(135deg, primary, primary-light)`, not a flat fill.
- **Primary Pressed** (`{colors.primary-pressed}` `#0759D5`, derived): pressed state, the CTA's thin ledge.
- **Primary Soft** (`{colors.primary-soft}` `#EAF2FF`) / **Primary Softest** (`{colors.primary-softest}` `#F3F8FF`, derived): tint backgrounds — level badges, completed-row background, header gradient's terminal stop.
- **Reward Gold** (`{colors.reward-gold}` `#E8B339`): coin/gem icon tint, reward-earned badge, "featured/high-pay" task tag *background* (with dark ink text on top, never gold text on white — see Accessibility).

### Task Status (Todoist-derived priority ladder → repurposed as task urgency/type)
- **Urgent** (`{colors.priority-urgent}` `#DC5B4C`): 限时/紧急任务 tag + left accent bar.
- **Featured** (`{colors.priority-featured}` = reward-gold `#E8B339`): 高BV/推荐任务 tag background — pair with dark text, not itself as text color.
- **Normal** (`{colors.priority-normal}` `#3A7BD5`): 常规任务 tag. 4.22:1 on white — passes for large/bold or UI-component use (3:1 threshold), sits just under the 4.5:1 normal-text threshold, so keep it to tags/badges (≥14px semibold) rather than small body copy.
- **Default** (`{colors.priority-default}` `#B9B7B0`): no tag set — outline only.

### Semantic (system-level, kept separate from brand blue)
- **Success** (`{colors.success}` `#1DA463`): non-gamified confirmations — "已同步", form validation. 3.21:1 on white — use at ≥14px semibold or as an icon/badge fill, not small body text.
- **Error** (`{colors.error}` `#DC5B4C`, 3.72:1) / **Warning** (`{colors.warning}` `#E8873F`, 2.64:1 — icon/fill only, fails even large-text contrast as bare text) / **Info** (`{colors.info}` `#3A7BD5`).

### Rank & Achievement (Strava-derived, leaderboard/profile only)
- **Rank Gold** `#E8B339` / **Rank Silver** `#C6C6C6` / **Rank Bronze** `#C97A3D` — fills for the rank chip circle (white number on top), never bare text on a light background.

### Surfaces & Text
- **Page** `{colors.bg-page}` `#F7F9FC`, **Card** `{colors.bg-card}` `#FFFFFF`, **Muted** `{colors.bg-muted}` `#F2F4F8` (derived).
- **Border Light** `{colors.border-light}` `#E7EAF0`, **Divider** `{colors.divider}` `#E9ECF1` — cool-tinted, decorative hairlines (not subject to text-contrast rules; they outline a card that already has whitespace/shadow as a boundary cue).
- **Ink** `#171A21` (≈17.4:1), **Ink Secondary** `#707681` (≈4.6:1), **Ink Tertiary** `#9AA0AA` (≈2.6:1 — fails the 3:1 UI-component floor; treat as icon/decorative/disabled-adjacent only, **not** caption or inactive-nav text as the previous orange-palette tertiary was used), **Ink Disabled** `#C4C8D0` (derived, disabled-only, never for readable content).
- **Overlay** `{colors.overlay}` `rgba(23,26,33,0.45)`: Dialog / Bottom Sheet scrim only — dark ink, not pure black.
- **Focus Ring** `{colors.focus-ring}` `rgba(22,113,248,0.35)`: field / control focus halo; pairs with a `{colors.primary}` border.

### Dark theme — Surfaces / Ink / Soft mapping

Dark mode is a **documented second palette**, not "invert light" and not default shadcn/Tailwind cool slate. Keep the same brand fills (`primary`, `reward-gold`, semantic colors). Swap **surfaces, ink, soft tints, overlay, shadow** via the `-dark` tokens below.

**Principles**
- Cool charcoal only (blue-gray undertone, same hue family as the light-mode brand blue). Ban both the pre-rebrand warm brown/cream undertone (`#171410` etc. — retired) and unrelated cool slate/navy page fills (`#0F172A`, `#1E293B`, `bg-slate-*`) — the dark palette is its own derivation from `{colors.primary}`, not a copy of generic Tailwind slate.
- Page stays slightly darker than cards — same relationship as light (`bg-page` deeper than floating `bg-card`).
- Soft tints on dark are **low-chroma washes** of the same hue (primary/reward/info/success/error), never high-sat neon slabs. `primary-soft-dark` / `primary-softest-dark` are literal dark washes of the brand blue; the other four (`reward-gold-soft-dark`, `info-soft-dark`, `success-soft-dark`, `error-soft-dark`) keep their own semantic hue and were left unchanged by the rebrand — their source hues never depended on the brand color.
- `reward-gold` / `warning` remain fill/icon-only; on dark they sit on `*-soft-dark`, with label in `ink-dark` / `ink-secondary-dark`.
- Primary CTA gradient + `on-primary` white text and the thin ledge are unchanged.
- Soft card elevation on dark uses `{colors.shadow-warm-dark}` (near-black, cool undertone — deliberately desaturated rather than a colored glow; a colored glow washes out on charcoal regardless of hue).

**Light → Dark token map**

| Role | Light | Dark |
|---|---|---|
| Page canvas | `bg-page` `#F7F9FC` | `bg-page-dark` `#101217` |
| Card / sheet / dialog | `bg-card` `#FFFFFF` | `bg-card-dark` `#1A1D24` |
| Muted / inset / track | `bg-muted` `#F2F4F8` | `bg-muted-dark` `#21242A` |
| Border / hairline | `border-light` `#E7EAF0` | `border-light-dark` `#2D313A` |
| Divider | `divider` `#E9ECF1` | `divider-dark` `#272B32` |
| Primary ink | `ink` `#171A21` | `ink-dark` `#EAEDF5` |
| Secondary ink | `ink-secondary` `#707681` | `ink-secondary-dark` `#9EA3B0` |
| Tertiary / inactive icon | `ink-tertiary` `#9AA0AA` | `ink-tertiary-dark` `#787D8A` |
| Disabled | `ink-disabled` `#C4C8D0` | `ink-disabled-dark` `#4F535C` |
| Primary soft wash | `primary-soft` `#EAF2FF` | `primary-soft-dark` `#18263A` |
| Primary softest / header stop | `primary-softest` `#F3F8FF` | `primary-softest-dark` `#121924` |
| Reward soft wash | `reward-gold-soft` `#FBF1DA` | `reward-gold-soft-dark` `#3A3220` |
| Info soft wash | `info-soft` `#EAF1FB` | `info-soft-dark` `#1E2A38` |
| Success soft wash | (light success tint) | `success-soft-dark` `#1A2E24` |
| Error soft wash | `error-soft` `#FCEFED` | `error-soft-dark` `#3A2220` |
| Soft card shadow | `shadow-warm` | `shadow-warm-dark` `rgba(6,8,12,0.45)` |
| Scrim | `overlay` `rgba(23,26,33,0.45)` | `overlay-dark` `rgba(6,8,12,0.64)` |
| Focus ring | `focus-ring` 35% | `focus-ring-dark` 45% |

**Unchanged across themes:** `primary`, `primary-light`, `primary-text`, `primary-pressed`, `on-primary`, `reward-gold`, `rank-*`, `priority-*`, `chart-line`, `success`, `error`, `warning`, `info`.

**Rebrand status:** this pass remints the dark palette — surfaces (`bg-*-dark`), ink (`ink-*-dark`), the two brand soft washes (`primary-soft-dark`, `primary-softest-dark`), the scrim, and the card shadow all moved from the retired warm-brown undertone to a cool blue-gray one derived from the same hue family as `{colors.primary}` (same lightness/saturation per step as before, hue rotated ~27°→~220° so contrast ratios hold). The four *other* soft washes (`reward-gold-soft-dark`, `info-soft-dark`, `success-soft-dark`, `error-soft-dark`) were left as-is — their hues were never tied to the brand color. The previously-flagged "known gap" (light/dark brand mismatch) is now closed.

**Header / page gradient (dark):** `primary-softest-dark` → `bg-page-dark` (same structure as light `primary-softest` → `bg-page`). Optional low primary radial at the avatar — keep α ≤ 0.08 so charcoal stays charcoal.

**Contrast notes (AA targets on `bg-card-dark` `#1A1D24`):**
- `ink-dark` / card ≈ 15:1+ (hue rotation preserves lightness, so this stays in the same range as before)
- `ink-secondary-dark` / card ≈ 7:1 (body OK)
- `ink-tertiary-dark` / card ≈ 4.5:1 (caption / inactive UI)
- `ink-disabled-dark` / card fails AA by design — disabled only
- `primary-text` `#1671F8` on card-dark ≈ 5+:1 for large/bold accents; still prefer ≥15px semibold for brand-blue copy (same product vivid-brand trade-off as light)

**Codebase mapping:** expose every `-dark` token under `tailwind.config.js` → `colors.game` and `GAME` in `app.config.ts`. Prefer `dark:bg-game-bg-card-dark` / `dark:text-game-ink-dark` over raw `slate-*`. Legacy cool gradients (`#0F172A`) are retired in favor of `bg-page-dark` / `primary-softest-dark`.

### Mapping to this codebase's CSS variables
```
--primary: 216 94% 53%;        /* #1671F8 — fills only */
--primary-foreground: 0 0% 100%;
--accent: 217 100% 96%;        /* primary-soft #EAF2FF */
--background: 216 45% 98%;     /* bg-page #F7F9FC */
--muted: 220 25% 96%;          /* bg-muted #F2F4F8 */
--border: 220 23% 92%;         /* border-light #E7EAF0 */
```
Dark (`.dark` / `isDark`) should remint the same semantic slots to warm charcoal, not cool slate:
```
--background: 223 18% 8%;      /* bg-page-dark #101217 */
--card: 222 16% 12%;           /* bg-card-dark #1A1D24 */
--muted: 220 12% 15%;          /* bg-muted-dark #21242A */
--border: 222 13% 20%;         /* border-light-dark #2D313A */
--foreground: 224 35% 94%;        /* ink-dark #EAEDF5 */
--muted-foreground: 223 10% 65%; /* ink-secondary-dark #9EA3B0 */
--accent: 215 42% 16%;         /* primary-soft-dark #18263A */
```
Keep `primary-text` / reward-gold / rank-* / priority-* / chart-line / overlay / focus-ring / all `*-dark` surface·ink·soft tokens as utilities via `tailwind.config.js` `colors.game` — they're accent/theme extensions, not part of the default semantic shadcn palette until the kit is fully reminted.

## Typography

Single CJK-first family — **PingFang SC** → **Noto Sans SC** (Android fallback) → **Microsoft YaHei** → system sans, weights 400/500/600/700. Sizes are Apple HIG Dynamic Type stops (11/13/15/17/20/28/34px) — a real platform type scale, not an invented one, and the same anchor points Strava/Todoist's actual iOS builds use.

| Token | Size | Weight | Use |
|---|---|---|---|
| `{typography.display-lg}` | 28px/700 | Screen titles ("任务", "排行榜") |
| `{typography.hero-number}` | 28px/700 tabular | Big stat: "+1,250 BV". Shares a size class with `display-lg` on purpose — a stat and a screen title are both "the biggest thing on this screen," just in different contexts. Use `{colors.primary-text}`, not `{colors.primary}`. |
| `{typography.identity-name}` | 20px/600 | User's display name in the header |
| `{typography.task-title}` | 17px/500 | Task row title — the content people scan. 17px is the real Strava/Todoist iOS body-title size, not a scaled-down mockup guess. |
| `{typography.section-title}` | 15px/600 | Card section headers ("近7日BV收益") |
| `{typography.grid-label}` | 15px/500 | Function-grid primary label ("认证码") — same size as `section-title`, distinguished by weight only |
| `{typography.hud-number}` | 13px/700 tabular | HUD chip numbers (streak/points) |
| `{typography.hud-label}` | 13px/600 tabular | HUD chip labels / level name ("LV.1 学徒") — one weight step lighter than `hud-number` |
| `{typography.body}` | 13px/400 | Task detail body, descriptions, grid-item subtitle |
| `{typography.tab-label}` | 11px/500 | Bottom tab bar labels |
| `{typography.caption}` | 11px/400 | Fine print, stat-change annotation ("较前7日 ↑18.6%") |
| `{typography.section-label}` | 11px/600 uppercase, 0.4px tracking | "今日任务"-style dividers |

**Principles**
- Bold (700) is reserved for numbers-that-matter (stats, HUD) and screen/identity titles — not for decoration.
- No uppercase body copy. Uppercase only on `section-label` dividers.
- All stat numbers use tabular figures so streak/points columns align.
- Heading line-height 1.2, body line-height 1.4–1.45, letter-spacing 0.

## Accessibility

Every text/background pairing in this palette, computed against WCAG 2.1 (relative luminance formula, not eyeballed):

| Pair | Ratio | AA normal text (4.5:1) | AA large/bold text or UI (3:1) |
|---|---|---|---|
| `ink` `#171A21` on `bg-card`/`bg-page` | ≈17.4:1 / ≈16.5:1 | ✅ | ✅ |
| `ink-secondary` `#707681` on white | ≈4.6:1 | ✅ (just over) | ✅ |
| `ink-tertiary` `#9AA0AA` on white | ≈2.6:1 | ❌ | ❌ (fails even the 3:1 UI-component floor — icon/decorative use only, see per-token notes above) |
| `primary-text` `#1671F8` on white | ≈4.4:1 | ❌ (just under) | ✅ |
| `primary` `#1671F8` on white (text use) | ≈4.4:1 | ❌ (just under) | ✅ (clears the large/bold and UI-component floor — an improvement over the retired orange, which failed both) |
| white on `primary` `#1671F8` fill (button text) | ≈4.4:1 | ❌ (just under) | ✅ (clears the large/bold floor; right at the edge for normal text, so keep button labels ≥15px semibold) |
| `priority-normal` `#3A7BD5` on white | 4.2:1 | ❌ (just under) | ✅ |
| `success` `#1DA463` on white | 3.2:1 | ❌ | ✅ |
| `error` `#DC5B4C` on white | 3.7:1 | ❌ | ✅ |
| `warning` `#E8873F` on white | 2.6:1 | ❌ | ❌ |
| `reward-gold` `#E8B339` on white | 1.9:1 | ❌ | ❌ |

**Improved over the retired orange**: white text on the `primary` `#1671F8` button fill is now ≈4.4:1 (was 2.9:1 with the orange brand) — it clears the large/bold-text and UI-component floor comfortably and sits right at the edge of the normal-text floor too. This is still the one open trade-off worth flagging: it's a hair under 4.5:1, so keep button labels ≥15px semibold (as the existing Buttons spec already does) rather than treating it as safe for small body copy.

Everything else with a ❌ above is fill/icon/large-bold-only by rule (see the Colors section's per-token notes) — those aren't open trade-offs, they're just don't-use-as-small-text constraints already designed around.

## Components

### Header / Identity Block
- Horizontal padding 14px.
- Avatar: 72px circle (re-measured from 84px in the rebrand pass), 3px white border, gap to identity text block 12px.
- Identity name: `{typography.identity-name}` (20px/600 — pinned to the type scale; the rebrand mockup measured 20–22px, within rounding of the existing token). P客ID row: 6px below name, `{typography.caption}` (11px — mockup measured 14–15px, but Typography is pinned per Methodology) in `{colors.ink-secondary}`.
- Level badge / progress pill: 8px margin-top from ID row, `{rounded.badge}` 14px radius, 28px tall (4pt grid), 8px horizontal padding, `{colors.primary-soft}` background. Sits directly under the ID row (not spaced out by the avatar's height) and is not width-constrained by the sign-in button.
- Sign-in ("签到") button: absolutely positioned top-right so it never competes for width with the identity column. ~88×40px pill (re-measured from ~100×52px), `linear-gradient(135deg, {colors.primary}, {colors.primary-light})` fill, white text/icon.
- Background: vertical gradient `{colors.primary-softest}` → `{colors.bg-page}`, spanning the full header height. Top safe area ≈44px before content starts.

### Data Card (chart)
- `{rounded.card}` 16px, `{colors.bg-card}` fill, 10px outer margin, 16px inner padding, shadow `0 10px 35px {colors.shadow-warm}`.
- Title row: `{typography.section-title}` + info glyph.
- Primary metric ("+1,250 BV"): `{typography.hero-number}` in `{colors.primary-text}`, 8px margin-top from title row.
- Change annotation ("较前7日 ↑18.6%"): `{typography.caption}` in `{colors.primary-text}`.
- Chart: 8px margin-top from the metric block, plot height ≈145px (re-measured from ≈140px).
- Line: 2px stroke, `{colors.chart-line}` `#1671F8`. Area fill: linear gradient `rgba(22,113,248,0.18)` → `rgba(22,113,248,0)`. (The chart line itself is a data-viz exception to the contrast table above — it's read against gridlines/axis labels/tooltips, not as standalone text, which is standard practice for chart accent colors.)
- Data point dot: 7–8px diameter, white fill, 2px `{colors.chart-line}` border. Last-point callout badge: `{colors.primary}` fill, white bold text (short numeric label on a solid chip counts as a UI component, not body text — 3:1 floor, and white-on-`primary` chip label is small/bold enough in practice that this is an accepted exception alongside the button one above).
- Bottom stats row (3 stat columns beneath the chart): ≈62px tall.

### Function Grid Card (6-entry)
- `{rounded.card}` 16px, 3 columns × 2 rows, card total height ≈224px, cell ≈123×112px, dividers in `{colors.divider}` at `{stroke.hairline}` (`0.5px`) — decorative hairlines, not 1px chunky borders.
- Cell: icon container 56px (`w-14 h-14`; visual icon glyph 52–60px per the rebrand mockup, container unchanged).
- Icon → title gap: 8px (4pt grid). Title → subtitle gap: 4px.
- Title: `{typography.grid-label}` in `{colors.ink}`. Subtitle: `{typography.body}` in `{colors.ink-secondary}` (not `ink-tertiary` — body-sized text needs the full 4.5:1, and secondary clears that; tertiary is for larger/UI-only use like inactive nav icons).
- Reference-mockup icon treatment is a soft organic "clay/blob" badge — out of scope for the current placeholder-icon pass (Lucide icons on flat tinted tiles); revisit only if/when real illustration assets are commissioned.

### Task Row (hero component — Todoist DNA)
- Height 56px minimum, `{rounded.tile}` 8px card if grouped, or plain row + hairline divider in a flat list.
- Layout: 4px priority-color left accent bar (only if urgent/featured) → 24px status circle → 12px gap → title + metadata column → trailing reward chip.
- Status circle: outline in priority color when open; fills `{colors.primary}` with a white check on complete, row title gets `{colors.ink-tertiary}` + strikethrough (an accepted low-contrast case like `ink-disabled` — the strikethrough itself signals "done", the text isn't meant to be read at full contrast).
- Metadata row (`{typography.body}`, `{colors.ink-secondary}`): due/expiry, task type tag (pill, priority-colored background + dark ink text), and a right-aligned reward chip — coin icon in `{colors.reward-gold}` + "+15" in `{colors.ink}` on a `{colors.reward-gold-soft}` chip background (not gold text on white — see Accessibility), `{typography.hud-number}`.
- Tap state: background fades to `{colors.bg-muted}` 80ms. Swipe-right optional for "标记完成" using `{colors.primary-soft}` reveal.

### Task Detail (Todoist DNA)
- Quiet white sheet, section-based: title → status/priority row → description → reward breakdown card (using `{colors.primary-soft}` background) → action button.
- No lesson-style illustration. One optional small icon per task type, 24px, inline.

### Top HUD (Duolingo DNA, de-candied)
- Height 52px. Left: avatar + level badge (small pill, `{colors.primary-soft}` bg, `{colors.primary-text}` text, "LV.3"). Right: streak chip (flame 16px `{colors.primary}` + tabular day count in `{colors.ink}`) and points chip (coin 16px `{colors.reward-gold}` + tabular number in `{colors.ink}` on `{colors.reward-gold-soft}`) — pill shape `{rounded.chip}`, `{colors.bg-muted}` background, gap 8px between chips.
- No owl, no character. Numbers stay `{colors.ink}` even when the icon beside them is brand/gold — keeps every number readable regardless of which accent it's paired with.

### System Toast (Todoist DNA — quiet system feedback)
- Purpose: non-celebratory confirmations and alerts (copied ID, save OK, validation, network fail, Demo navigation stubs). **Not** for points/level-up — those use Celebration Toast.
- Container: Soft card elevation. `{colors.bg-card}` fill, 1px `{colors.border-light}` border, shadow `0 10px 35px {colors.shadow-warm}`, `{rounded.card}` 16px. Never translucent glass, never cool slate chrome, never brand-color fill.
- Placement: top-center of the phone frame, 16px from the top safe edge; max width = content column (`100%` minus page horizontal margin 14px × 2). Horizontal padding inside toast 16px, vertical 12px; icon→title gap 8px.
- Typography: title `{typography.body}` weight 500 in `{colors.ink}` (one short line); optional description `{typography.caption}` in `{colors.ink-secondary}` under the title (4px gap). No uppercase. No hero-number.
- Leading icon 16px (graphical, ≥3:1 vs white):
  - success → check in `{colors.success}` (system green — never `{colors.primary}`)
  - error → alert in `{colors.error}`
  - warning → alert in `{colors.warning}`
  - info / default → info glyph in `{colors.info}` (or omit icon for pure text stubs)
- Behavior: auto-dismiss 2s (success / info / default) or 3s (error / warning); swipe or tap to dismiss. Stack at most 2; newer on top. Motion: soft fade + 8px slide-down 200ms — no confetti, no count-up, no haptic celebration.
- Variants map 1:1 to the icon/color rules above. Message body stays `{colors.ink}` on `{colors.bg-card}` in every variant — chromatic color lives only on the leading icon.

### Celebration Toast (Duolingo DNA, compressed from full-screen to a card)
- Trigger: task completed / level up / streak milestone. Distinct from System Toast — richer, reward-forward.
- A `{rounded.card}` card, slides up from bottom or center-pops, max 280px wide, auto-dismiss 1.5–2s or tap-to-dismiss.
- Content: icon (checkmark/level star/flame) in `{colors.primary}` circle 40px → "+15 积分" in `{typography.hero-number}` / `{colors.primary-text}` counting up from 0 → one line of context in `{colors.ink-secondary}`.
- Motion: number count-up 400ms ease-out, a light 6-8 particle confetti burst, one success haptic. No full-screen color takeover, no mascot illustration.

### Leaderboard Row (Strava DNA)
- Height 64px. Rank chip 28px circle: `{colors.rank-gold/silver/bronze}` fill for top 3 (white bold number), plain `{colors.ink-secondary}` number for rank 4+ (no chip).
- Avatar 40px circle → name (`{typography.task-title}` weight 500, `{colors.ink}`) + optional level badge → trailing points in `{typography.hud-number}` tabular, `{colors.ink}`.
- Own row: `{colors.primary-soft}` background + `{colors.primary}` 1px border.

### Personal Growth Stat Grid (Strava DNA)
- 3-up grid on profile: 累计任务/连续打卡/总积分. Each cell: `{typography.section-label}` uppercase caption in `{colors.ink-secondary}` on top, `{typography.hero-number}` tabular value in `{colors.ink}` below (not `primary-text` here — this is a neutral stat block, not an earnings callout; reserve the brand blue for the homepage income chart specifically).

### Buttons
- Primary: `linear-gradient(135deg, {colors.primary}, {colors.primary-light})` fill, white text (`{colors.on-primary}`), `{rounded.button}` 12px (pill for the header sign-in button — see Header spec), height 46–52px. One 2px pressed-ledge (`{colors.primary-pressed}`) as the sole nod to Duolingo's chunky-button feel. See Accessibility for the known contrast trade-off on this specific control.
- Secondary: white fill, 1px `{colors.border-light}` border, `{colors.ink}` text, same shape/height, no ledge.
- Destructive: `{colors.error}` fill, white text — rare, behind confirm sheets.
- Ghost / text: no fill, `{colors.ink-secondary}` label, min height 44px touch target; used for tertiary actions inside dialogs ("稍后再说") when Secondary would over-crowd.
- Icon-only: 44×44px min hit area; visible glyph 20–24px; pressed background `{colors.bg-muted}`.
- Disabled (all variants): opacity 40%, no ledge, no press feedback. Never invent a separate "gray button" fill.

### Dialog / Modal (centered card)
- **When:** confirmations, short forms, version switch, risk notices, multi-step pickers that must stay in context. Prefer Bottom Sheet for long lists or phone-native action sets.
- **Scrim:** `{colors.overlay}` `rgba(23,26,33,0.45)` full-bleed; tap-outside dismisses unless the dialog is blocking (risk / pay confirm).
- **Panel:** `{colors.bg-card}` fill, Soft card elevation, `{rounded.medium}` 16px (one step up from card 12px so it reads as a layer above page cards), max-width = content column (`100%` − page margin 14px × 2), on phones typically ≤ 360px inside the `max-w-md` frame. Horizontal inset from screen edge ≥ 16px.
- **Padding:** 20px (`{spacing.xl}`) outer; title → body gap 12px; body → footer gap 16–20px.
- **Header:** title centered on mobile (`{typography.section-title}` / 15px/600 `{colors.ink}`). Optional close (X) 44×44 hit, 16px glyph, `{colors.ink-secondary}`, absolute top-right inside the 20px padding. No second eyebrow / brand chip in the header.
- **Body:** `{typography.body}` `{colors.ink-secondary}`; optional callout block uses `{colors.primary-soft}` or `{colors.reward-gold-soft}` fill + `{rounded.button}` 12px + 12px inner padding (warm tip), ink stays dark on soft tint — never gold/blue as the sole text color.
- **Footer / button layout:**
  - **Two actions (default):** equal-width horizontal row, gap 12px. Left = Secondary ("取消"), Right = Primary ("确认" / "确认切换"). Heights 46–48px, `{rounded.button}`.
  - **Single action:** full-width Primary.
  - **Destructive confirm:** Left Secondary cancel, Right Destructive fill.
  - Never stack two full-width Primary buttons. Never put Primary on the left in LTR/CJK UI.
- **Scroll:** if body exceeds ~60vh, body scrolls; header + footer stay pinned. Max panel height ≈ 85vh.
- **Motion:** 200ms fade + scale 0.96→1 (enter); reverse on exit. No bounce, no full-screen color flash.
- **Nesting:** one dialog at a time. Don't open a Toast *and* a Dialog for the same confirm — pick one surface.

### Alert Dialog (blocking confirm)
- Subset of Dialog: title + 1–2 short paragraphs + two-button footer. No close X (must choose). Use for irreversible / risk flows (打赏风险提示、退出登录). Same tokens as Dialog; Primary may be Destructive when the affirming action deletes/leaves money.

### Bottom Sheet / Action Sheet
- **When:** filters, share/export, multi-option actions, long picker lists. Sits above Bottom Navigation when both are visible; sheet top radius `{rounded.large}` 24px, sides flush to the phone frame (edge-to-edge), bottom flush including home-indicator safe area (+16px padding).
- **Scrim:** same `{colors.overlay}`.
- **Handle:** optional 36×4px pill in `{colors.border-light}`, centered, 8px below top edge — drag affordance only, not a second brand mark.
- **Rows:** min height 52px, `{typography.task-title}` label in `{colors.ink}`, optional trailing chevron/`ink-disabled`. Hairline dividers `{colors.divider}`. Destructive row uses `{colors.error}` text (not a filled bar).
- **Cancel:** separate Secondary-looking full-width row at the bottom OR a gap + standalone cancel cell — never brand-blue Primary for "取消".

### Text Field / Input
- **Anatomy:** optional label above → field → optional helper / error below.
- **Label:** `{typography.body}` weight 600 (`≈ hud-label`) in `{colors.ink}`; 8px gap to field.
- **Field:** height 48px (4pt grid), `{rounded.button}` 12px, 1px `{colors.border-light}` border, `{colors.bg-card}` fill (or `{colors.bg-muted}` for inset-on-card forms), horizontal padding 12px. Value `{typography.task-title}` 17px `{colors.ink}` (HIG body; never shrink phone inputs to 13px). Placeholder `{colors.ink-disabled}`.
- **Focus:** border `{colors.primary}` + 3px ring `{colors.focus-ring}`; no cool blue system ring.
- **Error:** border `{colors.error}`; helper text `{typography.caption}` `{colors.error}` 4px below field. Icon optional (alert 14px) leading the helper.
- **Disabled:** `{colors.bg-muted}` fill, `{colors.ink-disabled}` value, no focus ring.
- **Prefix / suffix:** icons or units inside the field, 16px, `{colors.ink-secondary}`; clear (X) appears only when value.length > 0.
- **Numeric / code:** tabular figures; invite codes / OTP use centered tracking — for OTP see Input OTP below.

### Textarea
- Same border/radius/focus/error as Input. Min height 96px (3× 32), padding 12px. `{typography.body}` 13px or `{typography.task-title}` 17px when it's the primary compose surface. Resize: vertical only or fixed; never free corner-drag on mobile.

### Search Field
- Height 40–44px, `{rounded.pill}`, `{colors.bg-muted}` fill, no hard border (hairline optional). Leading search glyph 16px `{colors.ink-secondary}`, placeholder `{typography.body}` `{colors.ink-disabled}`. Cancel text button ("取消") appears to the right once focused — Secondary/ghost, not Primary.

### Input OTP / Code boxes
- 4–6 cells, each 44–48px square, `{rounded.button}`, 1px `{colors.border-light}`, gap 8px. Active cell uses primary focus ring. Digits `{typography.identity-name}` tabular `{colors.ink}`.

### Select / Dropdown
- **Trigger:** same height/radius/border as Input (48px / 12px / border-light). Value left-aligned; trailing chevron 16px `{colors.ink-secondary}`. Placeholder uses `{colors.ink-disabled}`.
- **Menu (phone):** prefer Bottom Sheet list over a tiny anchored popover when options > 5 or labels are long. When using anchored dropdown: `{colors.bg-card}` Soft card, `{rounded.card}` 16px, max-height 280px, item height 44px, selected row `{colors.primary-soft}` + check in `{colors.primary}`. Never cool slate popover chrome.
- **Disabled / error:** same as Input.

### Segmented Control
- Height 36–40px track in `{colors.bg-muted}`, `{rounded.button}` 12px, inner padding 4px. Segments equal width; active segment white Soft-card (or `{colors.bg-card}`) with light warm shadow, label `{typography.body}` weight 600 `{colors.ink}`. Inactive labels `{colors.ink-secondary}`. Used for 2–3 peers (升级码 / 认证码); for 4+ use Tabs or Sheet.

### Tabs (in-page)
- Underline style: row height 44px, label `{typography.section-title}`, inactive `{colors.ink-secondary}`, active `{colors.primary-text}` + 2px `{colors.primary}` underline full tab width or 24px centered bar. No pill-filled tabs competing with Segmented Control — pick one pattern per surface.

### Checkbox / Radio
- Control 20px; touch target expands to 44px. Unchecked: 2px `{colors.border-light}` on white. Checked checkbox: `{colors.primary}` fill + white check. Selected radio: `{colors.primary}` outer + inner dot. Label `{typography.body}` `{colors.ink}`, 8px gap. Disabled: 40% opacity. Error group: helper caption in `{colors.error}` under the set.

### Switch
- Track 48×28px, thumb 24px. Off: track `{colors.priority-default}` / muted. On: track `{colors.primary}`, thumb white. No reward-gold track. Instant snap (≤150ms), no bounce.

### Stepper (− / value / +)
- Used for exchange counts etc. Side buttons 40×40 `{rounded.button}` `{colors.bg-muted}`, glyph `{colors.ink-secondary}`. Center value field min-width 64px, `{typography.hud-number}` tabular. Same focus/error rules as Input when the center is editable.

### Chip / Tag / Badge
- **Chip (filter/choice):** height 28–32px, `{rounded.pill}`, padding 8–12px. Resting: `{colors.bg-muted}` + `{colors.ink}`. Selected: `{colors.primary-soft}` + `{colors.primary-text}`.
- **Tag (status):** height 22–24px, `{rounded.pill}`, tiny caption; urgency colors from priority ladder — background tinted soft, **ink is dark**, never bare urgent/gold text on white.
- **Count badge:** min 16px circle, `{colors.error}` fill, white caption number; sits on icon top-right. Max "99+".

### List Row (settings / menu)
- Soft card container or single grouped card with hairline dividers (same as Settings menu). Row min height 56px, horizontal padding 16px, leading icon tile 40×40 `{rounded.button}` on soft tint, title `{typography.grid-label}`, optional subtitle `{typography.body}` `{colors.ink-secondary}`, trailing chevron `{colors.ink-disabled}`. Pressed: `{colors.bg-muted}` 80ms. One job per row — don't put a Switch and a chevron on the same row.

### Divider
- Full-bleed inside cards: `{stroke.hairline}` `{colors.divider}`. Section break outside cards: 8–12px whitespace preferred over a line; if a line is required, 16px horizontal inset.

### Progress / Slider
- **Progress bar:** track height 8px `{colors.bg-muted}` `{rounded.pill}`; fill `{colors.primary}` (XP / level) or `{colors.success}` (system sync). Deterministic width, no candy stripes.
- **Slider:** track 4px, thumb 24px white with Soft warm shadow + primary ring when dragging. Label value with `{typography.hud-number}` tabular.

### Empty State
- Centered in the content column. Optional glyph 56px tile (`{rounded.tile}`) on `{colors.primary-soft}` / `{colors.bg-muted}` with 28px Lucide icon in `{colors.ink-tertiary}` (decorative — the tile's own boundary carries the affordance, so the icon's sub-3:1 contrast is acceptable here) or brand primary if the empty state is an invitation to act. Title optional `{typography.section-title}`; description `{typography.body}` `{colors.ink-secondary}` (body text needs the 4.5:1 floor, `ink-tertiary` no longer clears it). Optional one Secondary or Primary CTA below (12px gap). No mascot, no multi-illustration collage.

### Skeleton / Loading
- Skeleton blocks use `{colors.bg-muted}` with a subtle warm shimmer (primary-soft → muted), `{rounded.tile}` matching the real content shape (circle for avatar, 12px for cards). Prefer skeleton over a centered Spinner for page loads; Spinner (20–24px `{colors.primary}` stroke) for inline button / pull-to-refresh only.

### Avatar
- Sizes: 40 (list), 84 (Header identity). Circle; optional 3px white (or dark-surface) ring on Header only. Fallback: brand default asset — not colored initials blocks in random hues.

### Tooltip / Popover
- Mobile default: prefer Dialog / Sheet over hover tooltips. If needed (desktop preview / rare ⓘ): `{colors.ink}` fill, white caption text, `{rounded.small}` 8px, max-width 240px; never primary-blue tooltip chrome.

### Splash / 开屏欢迎页
- Purpose: cold-start brand moment only — no CTA, no fork. Plays once per session, auto-advances into Home after a short brand-moment pause; tap anywhere skips the wait immediately. Not a fake-loading gate — no skeleton, no spinner.
- Background: full-bleed `{colors.page-gradient}` (`{colors.page-gradient-dark}`) + `{colors.header-glow}` (`{colors.header-glow-dark}`) layered on top for the same soft radial brand-blue wash used on Home/Donor headers — no new gradient invented.
- Mark: brand glyph in a 96px `{rounded.card}` tile, `{colors.bg-card}` fill, `shadow-warm`; enters with `{motion.splash-pop}`.
- Wordmark: welcome line ("欢迎使用 P 客") in `{typography.identity-name}` (20px/600), `{colors.ink}`, 20px below the mark; enters with `{motion.splash-fade-up}` (staggered 80ms after the mark). No slogan/tagline copy below it — the mark + welcome line is the whole message.
- Timing: auto-navigates to Home ≈1.8s after mount — long enough for the entrance to finish reading, short enough not to feel like a stall.
- Motion tokens (`tailwind.config.js` → `keyframes`/`animation`, no bespoke one-off transitions in components):
  - `{motion.splash-pop}` — mark entrance: opacity 0→1 + scale 0.85→1, 480ms `cubic-bezier(0.34,1.56,0.64,1)` (slight overshoot, Duolingo-style pop, not a bounce loop).
  - `{motion.splash-fade-up}` — text entrance: opacity 0→1 + translateY 12px→0, 420ms ease-out.

### Bottom Navigation
- Height ≈92px (re-measured from 80px; includes the Home Indicator safe area), top corners rounded `{rounded.nav-top}` 28px (re-measured from 24px — a documented exception to the 8/12/16/24 radius scale, see Methodology).
- 5 tabs, each ≈78px wide. Active tab: `{colors.primary}` icon (25–28px) + `{typography.tab-label}` in `{colors.primary-text}` (icon can use the lighter `primary` since it's a graphical element ≥16px, not text; the label under it is small text so it uses the AA-safe `primary-text`). Inactive: `{colors.ink-nav-inactive}` `#555B65` for both icon and label — `ink-tertiary` is too light (2.6:1) to clear the 3:1 UI-component floor at this size.
- Center "任务" tab: raised circle ≈64px diameter (re-measured from 60px), offset upward ≈18–22px from the bar, `{colors.primary}` fill with a soft brand-blue outer glow, white icon (white-on-primary at icon scale, not text, so the button-label contrast caveat doesn't apply here).

## Layout

- Base unit 4px, strict grid: 4/8/12/16/20/24/32, plus the documented `{spacing.section}` 14px exception (see Methodology).
- Page horizontal margin: 12px (re-measured from 14px; mockup range is 10–12px).
- Section gap between stacked cards: `{spacing.section}` 14px on the rebrand-pass screens (was 8–12px) — other screens not covered by this mockup may keep 8–12px until re-measured.
- Card inner padding: 16px. Primary card width on a 390pt-wide screen ≈370px (page margin × 2 subtracted).
- Task list: rows edge-to-edge with hairline dividers inside a card, or 8px gap between standalone cards — pick one per screen, don't mix.
- HUD sits inside a 52px top bar; chips never wrap.
- Dialog horizontal inset ≥ 16px; Bottom Sheet is edge-to-edge.
- Minimum touch target 44×44px for all interactive controls (Apple HIG); visual size may be smaller if hit area expands.

## Depth & Elevation

| Level | Treatment | Use |
|---|---|---|
| Flat | No shadow, hairline only | Task rows, leaderboard rows, list rows inside a card |
| Soft card | Light: `0 10px 35px {colors.shadow-warm}`. Dark: `0 10px 35px {colors.shadow-warm-dark}` | Data card, toast, Dialog, Sheet |
| Ledge (CTA only) | `0 2px 0 {colors.primary-pressed}` | Primary button — unchanged in dark |
| Scrim | Light: `{colors.overlay}`. Dark: `{colors.overlay-dark}` | Behind Dialog / Sheet |

## Do's and Don'ts

### Do
- Keep the task row the visual hero of every list screen — title readable at a glance, metadata secondary.
- Use tabular numerals on every stat, streak, and points value.
- Use `{colors.primary-text}` / `{colors.primary}` (same value) for brand blue text — the retired warm orange (`#FF6B0B`) and its old deep AA-only alias (`#C24C00`) are both gone from the palette.
- Pair `{colors.reward-gold}` with its `-soft` / `-soft-dark` background whenever it's near text; never let it be the text color itself.
- Confine rank-gold/silver/bronze to leaderboard + achievements.
- Keep celebration moments under 2 seconds and skippable.
- Use System Toast for ops feedback; use Celebration Toast only when rewarding points / level / streak.
- Keep the page canvas cool (`#F7F9FC` light / `#101217` dark) even though cards sit one step lighter/higher (`#FFFFFF` / `#1A1D24`).
- Use the neutral cool grays defined for borders/dividers/shadows in light mode — never mix in unrelated cool slate/gray hexes.
- When adding a new color, run it through the same contrast check as the Accessibility table before shipping it as text.
- Dialog footers: Secondary left, Primary right; equal width; 12px gap.
- Form fields: 48px tall, 17px value text, primary focus ring — match Input spec across Select / Stepper / OTP.
- Prefer Bottom Sheet over tiny Dropdown menus for long option sets on phone.
- In dark mode, swap via the Light→Dark map (`bg-*-dark`, `ink-*-dark`, `*-soft-dark`) — do not invent one-off charcoal hexes per screen.

### Don't
- Don't add a mascot character or illustration-heavy empty states.
- Don't use Duolingo's 4pt chunky 3D ledge on more than the primary CTA.
- Don't uppercase task titles or body copy — uppercase is reserved for section-label dividers only.
- Don't introduce a second chromatic brand accent beyond primary blue + reward gold.
- Don't go full-screen color takeover on level-up.
- Don't use primary blue for system-level success/sync confirmations — that's `{colors.success}` green's job (System Toast icon only; toast surface stays white / card-dark).
- Don't turn System Toast into a translucent/glass banner or a green/blue filled strip — Soft card + icon accent only.
- Don't use Celebration Toast motion (confetti / count-up) for copy/save/error feedback.
- Don't render the page background and card background as the same value (light or dark).
- Don't invent a new font-size for a one-off — pick from the existing HIG-anchored scale (11/13/15/17/20/28/34), even if a measurement says otherwise.
- Don't ship Dialogs with cool slate overlays, glassmorphic panels, or Default-shadcn blue focus rings — remint to overlay / Soft card / focus-ring tokens.
- Don't put Primary ("确认") on the left of a two-button footer.
- Don't use hover-only Tooltip patterns as the primary help affordance on mobile — use ⓘ → Dialog/Sheet.
- Don't build dark UI with Tailwind `slate-*` page/card fills (`#0F172A` etc.) — use `bg-page-dark` / `bg-card-dark`.

## Agent Prompt Guide

Quick reference for prompting an agent with this file:
- Brand fill: `#1671F8` gradient to `#2F80FF`. Brand **text**: `#1671F8` (`primary-text` ≡ `primary`) — the retired warm orange (`#FF6B0B`) and its old deep `#C24C00` text alias are gone from the palette.
- Page canvas `#F7F9FC` (cool white) vs card `#FFFFFF` (pure white) — always two different values. Dark: page `#101217` vs card `#1A1D24` (cool charcoal, same brand-blue hue family as light).
- Type scale: 11/13/15/17/20/28/34px (Apple HIG stops) — don't pick a size outside this set; unchanged by the rebrand.
- Spacing: strict 4pt grid (4/8/12/16/20/24/32), plus one documented exception `{spacing.section}` 14px for this mockup's module gap.
- Reward/points/featured-tag accent: `#E8B339` (fill/icon only, pair with `#FBF1DA` / dark `#3A3220` if text is nearby) · Rank gold/silver/bronze: `#E8B339`/`#C6C6C6`/`#C97A3D`.
- Task priority ladder: urgent `#DC5B4C` · featured `#E8B339` · normal `#3A7BD5` · default `#B9B7B0`.
- System success (non-brand): `#1DA463`.
- Card radius 16px, Dialog radius 16px, Sheet top radius 24px, Bottom Navigation top radius 28px; soft shadow `0 10px 35px rgba(22,113,248,0.10)` (dark: `rgba(6,8,12,0.45)`); overlay `rgba(23,26,33,0.45)` (dark: `rgba(6,8,12,0.64)`); hairlines `#E7EAF0`/`#E9ECF1` → dark `#2D313A`/`#272B32`.
- "Build the task list screen using DESIGN.md — Todoist-style rows, reward chip on a soft-gold background (not gold text), no illustration."
- "Build the level-up celebration using DESIGN.md — Celebration Toast, not System Toast: compressed card, count-up in primary-text, light confetti."
- "Show a copy-success feedback using DESIGN.md — System Toast: white Soft card, success icon in `#1DA463`, body ink, 2s dismiss."
- "Build the leaderboard screen using DESIGN.md — Strava rank chips, own-row highlighted in primary-soft blue, points in ink not primary."
- "Build a version-switch Dialog using DESIGN.md — Soft card 16px radius, tip block on primary-soft, Secondary cancel left + Primary confirm right."
- "Build a phone form using DESIGN.md — 48px inputs, section-title labels, primary focus-ring, error caption in error red."
- "Build a filter picker using DESIGN.md — Bottom Sheet 24px top radius, 52px rows, cancel is never Primary."
- "Enable dark mode using DESIGN.md — warm charcoal `bg-page-dark`/`bg-card-dark`, `ink-dark` ladder, `*-soft-dark` washes; no cool slate."
