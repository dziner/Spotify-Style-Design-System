# Spotify-Style Design System

A design system inspired by Spotify's web player and marketing surfaces — a "content-first darkness" aesthetic where the UI recedes so music, art, and content can glow.

> **Source note:** This system was built from a written specification (not from access to Spotify's codebase or Figma). All values — colors, type scale, geometry, shadows — are reconstructed from that spec. Logos use Spotify's publicly available wordmark/glyph for visual fidelity only; do not ship without rights.

## Index / Manifest

- `README.md` — this file (brand context, content rules, visual foundations, iconography)
- `SKILL.md` — Agent Skills entry point
- `colors_and_type.css` — CSS custom properties for color tokens and typography
- `fonts/` — webfont files (Pretendard as Circular substitute — **flagged**, see Type section)
- `assets/` — logos, icons, illustrations
- `preview/` — design-system tab cards (type, color, spacing, components, brand)
- `ui_kits/web-player/` — dark in-app web player UI kit (sidebar, now-playing, browse)
- `ui_kits/marketing/` — light/dark marketing surfaces (hero, pricing)

## Brand Context

Spotify is a global audio platform — music, podcasts, audiobooks. The brand voice across its product is *confident, plainspoken, and warm*; the visual language is *near-black, pill-shaped, and content-first*. The UI is intentionally achromatic so album artwork supplies the color. Spotify Green (`#1ed760`) is the single brand accent and is treated as **functional, not decorative** — play, active state, primary CTA only.

Two product surfaces are covered here:
1. **Web Player** — the dark immersive app (`#121212` background, sidebar + content + now-playing bar)
2. **Marketing / Account surfaces** — lighter, narrative pages (Premium, signup, careers)

---

## CONTENT FUNDAMENTALS

### Tone
- **Plainspoken and confident.** Spotify writes like a person who knows music well — never breathless, never corporate.
- **Direct second-person ("you" / "your").** Spotify rarely uses "we"; the focus is on the listener. Headlines address you: "Your top songs of 2024," "Made for you."
- **Imperative for calls to action.** "Play," "Get Premium," "Try free for 1 month," "Discover new music."
- **Warm but never saccharine.** No exclamation overload. No emoji in product UI. The voice is closer to a record-shop clerk than a brand mascot.

### Casing
- **Sentence case for titles, headings, and most UI strings.** "Your top mixes," "Recently played," not "Your Top Mixes."
- **UPPERCASE with wide letter-spacing (1.4px–2px) for button labels and small system labels.** "PLAY," "FOLLOW," "GET PREMIUM." This is the systematic "label voice" — it visually separates UI affordances from content.
- **Proper-cased product names.** "Spotify Premium," "Spotify Wrapped," "Discover Weekly," "Release Radar."

### Examples (in-system tone)
- Section header: **Made For You**
- Empty state: "Press play to start listening."
- CTA on Premium: **GET PREMIUM**
- Microcopy / metadata: "Song · 3:42 · 4.2M plays"
- Onboarding: "Pick a few artists you like. We'll do the rest."
- Error: "Couldn't load this playlist. Try again."
- Confirm: "Removed from your Liked Songs."

### Don'ts
- ❌ No emoji in product chrome (occasional use in marketing/Wrapped only).
- ❌ No exclamation points in regular UI strings — reserved for celebratory moments (Wrapped, milestones).
- ❌ No "Hey there!" / "Oops!" / "Whoops!" — Spotify doesn't perform friendliness, it just is friendly.
- ❌ No Title Case headings in product UI.

---

## VISUAL FOUNDATIONS

### Color
- **Near-black palette as base.** Three steps of dark — `#121212` (page), `#181818` (surface), `#1f1f1f` (interactive surface) — provide depth through shade variation, not borders.
- **Spotify Green (`#1ed760`)** is the only accent. Used on play buttons, active nav state, primary CTAs. **Never decorative.** Never a background for large surfaces. Never paired with another accent.
- **Achromatic UI by design.** Album art is the color. The system's job is to frame it.
- **Semantic colors are muted, not saturated:** `#f3727f` red, `#ffa42b` orange, `#539df5` blue. They feel like they belong to the dark theme, not flag-bright.

### Type
- **Two-font family:** `SpotifyMixUITitle` for display, `SpotifyMixUI` for UI/body. Both are based on Circular (Lineto). **Substitute:** Pretendard (variable, local `fonts/PretendardVariable.ttf`) — clean geometric proportions, full weight range. **Flag for user: replace with real Spotify webfonts if licensed.**
- **Bold/regular binary.** Hierarchy is built almost entirely through weight contrast (700 vs 400), not size. 600 is used sparingly. This is what makes Spotify's UI feel sharp and definite.
- **Compact size range — 10px to 24px.** This is an app, not a magazine. Type is for scanning, not reading.
- **Uppercase + tracking on buttons.** 14px / 700 / `letter-spacing: 1.4–2px` / `text-transform: uppercase`. The systematic label voice.
- **Tight line-heights.** 1.0 on buttons, 1.3 on headings, 1.5 on captions. Density over breathing room.

### Spacing & Layout
- **8px base unit.** Scale includes fine values (1–6px) for tight UI work plus the 8/12/16/20px rhythm for layout.
- **Fixed sidebar + scrollable content + persistent now-playing bar at bottom.** The web player's canonical three-zone layout.
- **Dark compression:** elements pack densely. The dark background provides visual rest — no need for huge gaps.
- **Card grids:** 5 columns → 3 → 2 → 1 across breakpoints.

### Geometry / Radii
- **Pill is the dominant button shape.** `500px` for large CTAs, `9999px` for small pills, `50%` for circular play controls.
- **Cards: 6–8px radius.** Soft but not friendly-rounded.
- **Album covers: 6px radius** (subtle softening of the otherwise-square art).
- **No sharp corners in interactive elements.** Square buttons feel foreign to the brand.

### Shadows / Elevation
- **Heavy shadows, even on dark.** `rgba(0,0,0,0.5) 0 8px 24px` for dialogs and menus, `rgba(0,0,0,0.3) 0 8px 8px` for cards. On near-black surfaces, subtle shadows are invisible — they need weight to read.
- **Inset border-shadow combo for inputs:** `rgb(18,18,18) 0 1px 0, rgb(124,124,124) 0 0 0 1px inset` — creates a recessed, tactile quality. The system avoids raw `border` declarations on most surfaces; depth is shadow-driven.
- **No glow effects.** No neon. No colored shadows.

### Backgrounds
- **Solid near-black surfaces.** No gradients on UI chrome.
- **Hero gradients on artist/album pages** are *sampled from album art* — the page tints to match the cover (a vertical fade from the dominant cover color into `#121212`). This is the one place gradients appear.
- **No textures, patterns, or illustrations** on standard UI. Marketing pages may use full-bleed photography.

### Imagery
- **Album art and editorial photos dominate.** Color, mood, and warmth come from images, not from the chrome.
- **Photography style:** saturated, contrast-y, candid — feels like a record sleeve or concert photo, not a stock shoot.
- **Wrapped/yearly campaigns** introduce playful color palettes and type treatments, but those are campaign-scoped, not system-scoped.

### Motion / Animation
- **Subtle and quick.** Transitions are 150–250ms. Easing is `ease-out` or `cubic-bezier(0.3, 0, 0, 1)`.
- **Hover:** background lightens (about 4–6% lighter on cards), the green play button on a card *scales up* (`translateY(-2px)`) and appears via opacity fade.
- **Press:** slight scale-down on buttons (`scale(0.97)`), brief opacity dim.
- **No bounce, no spring, no playful overshoot.** Motion is functional.

### Borders & Dividers
- **Borders are mostly absent.** Surfaces are separated by background-color steps, not strokes.
- **Where a border is needed** (outlined buttons, inputs), it's `#7c7c7c` or `#4d4d4d` — gray, never colored.
- **Dividers in lists:** `1px solid rgba(255,255,255,0.1)` — translucent so they read on any dark surface.

### Transparency & Blur
- **Used sparingly.** The top-of-page header on artist/album pages uses `backdrop-filter: blur(20px)` over a semi-transparent surface as you scroll.
- **Modal overlays** use `rgba(0,0,0,0.7)` scrim — no blur needed; the heavy shadow on the modal does the work.

### Cards
- **Background `#181818`**, radius `8px`, no border, no shadow at rest.
- **Hover:** background → `#282828`, the green play button appears bottom-right via opacity + translate.
- **Padding:** 16px. Image (square, 6px radius) on top; title below in 16px/700; subtitle in 14px/400/`#b3b3b3`.

### Layout Rules
- **Sidebar is always fixed-position.**
- **Now-playing bar is always pinned to viewport bottom.**
- **Content area scrolls independently** with its own scroll container.
- **Header on content area is sticky** and fades from transparent to opaque as you scroll.

---

## ICONOGRAPHY

Spotify uses a proprietary icon set called **Encore Icons** — geometric, mostly filled glyphs with consistent stroke weights and rounded joins. They're optical-sized: 16, 24, and 32px variants exist with slight stroke adjustments.

**This system substitutes [Lucide](https://lucide.dev) for the Encore set.** Lucide is line-based (not filled like Encore), so it reads slightly more delicate, but the geometry and sizing rhythm are very close. Lucide is loaded from CDN — see `assets/icons.md` for usage. **Flag: real Encore icons should replace these for production fidelity.**

For solid play/pause/skip glyphs (where Encore is definitely filled, not stroked), this system uses **Lucide's filled variants** (`PlayIcon` with `fill="currentColor"`) or inline SVGs in `assets/icons/`. Play, pause, next, previous, shuffle, repeat, heart, plus, ellipsis are all included as raw SVG.

### Rules
- **Icon color** matches text: `#b3b3b3` muted, `#ffffff` active/hover.
- **Spotify Green** on icons is reserved for: the play button glyph, the green "active" dot indicator, and the "currently playing" speaker animation.
- **No emoji in product chrome.** No unicode symbol substitution (no ▶, ⏸, ✓). Always SVG.
- **Icon sizes:** 16px (inline / table), 20px (most UI), 24px (nav, primary actions), 32px+ (hero / now-playing).
- **Play button** is a special case: solid black triangle inside a green circle, always.

### Logo
The Spotify wordmark and circular glyph live in `assets/logo/` — see those files. Two color variants: green-on-dark (default) and white-on-dark (for over-photography).
