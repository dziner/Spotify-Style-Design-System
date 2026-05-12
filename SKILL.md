---
name: spotify-style-design
description: Use this skill to generate well-branded interfaces and assets in the Spotify-Style aesthetic — a content-first dark theme with pill geometry, Spotify Green (#1ed760) as the single accent, and a compact bold-or-regular type system. Suitable for production work, prototypes, or throwaway mocks.
user-invocable: true
---

Read the `README.md` file within this skill, and explore the other available files. The system covers:

- Color tokens (near-black surface scale, Spotify Green accent, semantic colors, borders) in `colors_and_type.css`
- Typography (Manrope as Circular substitute — see `fonts/README.md`)
- Iconography (Lucide substitution for Encore — see `assets/icons/`)
- Logo (`assets/logo/`)
- UI kits in `ui_kits/web-player/` and `ui_kits/marketing/`
- Preview cards in `preview/` showing every component

If creating visual artifacts (slides, mocks, throwaway prototypes), copy assets out and create static HTML files for the user to view. Always pull in `colors_and_type.css` for tokens and reference real SVGs from `assets/icons/` — do not invent icons.

If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask a few short questions (which surface, what content, dark or marketing voice), then act as an expert designer producing HTML artifacts or production code.

## Critical rules
- **Dark by default.** Background `#121212`, surface `#181818`, elevated `#1f1f1f`.
- **Spotify Green is functional only.** Play buttons, active state, primary CTA. Never decorative.
- **Pill geometry everywhere.** `500px` for primary buttons, `9999px` for small pills, `50%` for circular play controls.
- **Uppercase + 1.4–2px letter-spacing** on button labels — the systematic label voice.
- **Heavy shadows on dark.** `rgba(0,0,0,0.3) 0 8px 8px` for cards, `rgba(0,0,0,0.5) 0 8px 24px` for dialogs.
- **No emoji in product chrome.** No invented colors. No gradients on chrome (only on hero art / sampled album art).
