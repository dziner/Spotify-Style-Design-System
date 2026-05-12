# Fonts

**Current font:** [Pretendard](https://github.com/orioncactus/pretendard) — variable, weights 100–900 — loaded locally from `fonts/PretendardVariable.ttf`.

Pretendard is a hybrid Korean/Latin sans by orioncactus designed to harmonize with Apple system fonts; it has clean geometric proportions that read well as a substitute for the Circular/SpotifyMixUI family.

**Original target fonts (proprietary, not included):**
- `SpotifyMixUITitle` — display
- `SpotifyMixUI` — UI / body
- `CircularSp-*` — global script fallbacks (Arab, Hebr, Cyrl, Grek, Deva)

To swap to the real Spotify fonts later, drop `.woff2` files into this folder and add `@font-face` rules above the Pretendard rule in `colors_and_type.css`, then move `Pretendard` after them in the `--font-title` / `--font-ui` stacks.
