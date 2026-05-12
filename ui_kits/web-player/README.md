# Web Player — UI Kit

A pixel-faithful recreation of Spotify's web player chrome:
- Two-panel left sidebar (nav + library)
- Main content area with sticky header
- Persistent bottom Now Playing bar

Open `index.html` to see a click-through demo: pick a playlist, hover cards, hit play, toggle shuffle/repeat.

## Files
- `index.html` — assembled demo (login → browse → playlist → now playing)
- `Sidebar.jsx` — left nav + library panels
- `TopBar.jsx` — sticky header with back/forward + user avatar
- `BrowseHome.jsx` — Good morning grid + sections of cards
- `PlaylistView.jsx` — playlist hero + track list
- `NowPlaying.jsx` — persistent bottom transport bar
- `Card.jsx` — album / playlist card with hover play FAB
- `TrackRow.jsx` — track list row with hover state
- `Icons.jsx` — inline SVG icons (matches `/assets/icons/`)

## Notes
- Uses `colors_and_type.css` tokens (loaded via the parent design system path)
- Substitution caveats: Manrope for Circular, Lucide for Encore
- "Audio" is fake — clicking play toggles the bar state but no real playback
