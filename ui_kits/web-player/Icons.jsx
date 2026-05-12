/* global React */
const { createElement: h } = React;

// Inline icon set — mirrors /assets/icons/*.svg
const make = (paths, fill = 'currentColor', stroke = false) => ({ size = 24, color = 'currentColor', style = {} } = {}) =>
  h('svg', {
    width: size, height: size, viewBox: '0 0 24 24',
    fill: stroke ? 'none' : fill, stroke: stroke ? color : 'none',
    strokeWidth: stroke ? 2 : 0, strokeLinecap: 'round', strokeLinejoin: 'round',
    style: { color, ...style }
  }, paths);

const Path = (d, key) => h('path', { d, key });
const Circle = (cx, cy, r, key) => h('circle', { cx, cy, r, key });

const Icons = {
  Play: ({ size = 24, color = 'currentColor', style }) =>
    h('svg', { width: size, height: size, viewBox: '0 0 24 24', fill: color, style },
      h('path', { d: 'M7.05 3.606 19.93 11.07a1.071 1.071 0 0 1 0 1.86L7.05 20.394A1.071 1.071 0 0 1 5.5 19.464V4.536A1.071 1.071 0 0 1 7.05 3.606z' })),
  Pause: ({ size = 24, color = 'currentColor', style }) =>
    h('svg', { width: size, height: size, viewBox: '0 0 24 24', fill: color, style },
      h('rect', { x: 6, y: 4, width: 4, height: 16, rx: 1 }),
      h('rect', { x: 14, y: 4, width: 4, height: 16, rx: 1 })),
  Next: ({ size = 24, color = 'currentColor', style }) =>
    h('svg', { width: size, height: size, viewBox: '0 0 24 24', fill: color, style },
      h('path', { d: 'M5 4.5a1 1 0 0 1 1.55-.83l12 7.5a1 1 0 0 1 0 1.66l-12 7.5A1 1 0 0 1 5 19.5v-15z' }),
      h('rect', { x: 18.5, y: 4.5, width: 2, height: 15, rx: 1 })),
  Prev: ({ size = 24, color = 'currentColor', style }) =>
    h('svg', { width: size, height: size, viewBox: '0 0 24 24', fill: color, style },
      h('path', { d: 'M19 4.5a1 1 0 0 0-1.55-.83l-12 7.5a1 1 0 0 0 0 1.66l12 7.5A1 1 0 0 0 19 19.5v-15z' }),
      h('rect', { x: 3.5, y: 4.5, width: 2, height: 15, rx: 1 })),
  Shuffle: ({ size = 20, color = 'currentColor', style }) =>
    h('svg', { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', style },
      h('path', { d: 'M16 3h5v5' }), h('path', { d: 'M21 3 14 10' }),
      h('path', { d: 'M8 21H3v-5' }), h('path', { d: 'm3 21 7-7' }),
      h('path', { d: 'M3 8V3h5' }), h('path', { d: 'm21 16 .01 5H16' }),
      h('path', { d: 'M17 14l4 7' })),
  Repeat: ({ size = 20, color = 'currentColor', style }) =>
    h('svg', { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', style },
      h('path', { d: 'm17 2 4 4-4 4' }),
      h('path', { d: 'M3 11v-1a4 4 0 0 1 4-4h14' }),
      h('path', { d: 'm7 22-4-4 4-4' }),
      h('path', { d: 'M21 13v1a4 4 0 0 1-4 4H3' })),
  HeartFilled: ({ size = 20, color = '#1ed760', style }) =>
    h('svg', { width: size, height: size, viewBox: '0 0 24 24', fill: color, style },
      h('path', { d: 'M12 21s-7-4.5-9.5-9.1C.6 8.1 2.7 4 6.5 4c2 0 3.6 1 5.5 3 1.9-2 3.5-3 5.5-3 3.8 0 5.9 4.1 4 7.9C19 16.5 12 21 12 21z' })),
  Heart: ({ size = 20, color = 'currentColor', style }) =>
    h('svg', { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', style },
      h('path', { d: 'M12 21s-7-4.5-9.5-9.1C.6 8.1 2.7 4 6.5 4c2 0 3.6 1 5.5 3 1.9-2 3.5-3 5.5-3 3.8 0 5.9 4.1 4 7.9C19 16.5 12 21 12 21z' })),
  Search: ({ size = 20, color = 'currentColor', style }) =>
    h('svg', { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', style },
      h('circle', { cx: 11, cy: 11, r: 8 }), h('path', { d: 'm21 21-4.3-4.3' })),
  Home: ({ size = 24, color = 'currentColor', style }) =>
    h('svg', { width: size, height: size, viewBox: '0 0 24 24', fill: color, style },
      h('path', { d: 'M3 21V7l9-4 9 4v14h-7v-7h-4v7H3z' })),
  Library: ({ size = 24, color = 'currentColor', style }) =>
    h('svg', { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', style },
      h('path', { d: 'M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20' })),
  Plus: ({ size = 20, color = 'currentColor', style }) =>
    h('svg', { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 2, strokeLinecap: 'round', style },
      h('path', { d: 'M12 5v14M5 12h14' })),
  Ellipsis: ({ size = 20, color = 'currentColor', style }) =>
    h('svg', { width: size, height: size, viewBox: '0 0 24 24', fill: color, style },
      h('circle', { cx: 5, cy: 12, r: 2 }), h('circle', { cx: 12, cy: 12, r: 2 }), h('circle', { cx: 19, cy: 12, r: 2 })),
  Volume: ({ size = 20, color = 'currentColor', style }) =>
    h('svg', { width: size, height: size, viewBox: '0 0 24 24', fill: color, style },
      h('path', { d: 'M3 10v4h4l5 5V5L7 10H3zm13.5 2A4.5 4.5 0 0 0 14 7.97v8.06A4.5 4.5 0 0 0 16.5 12zM14 3.23v2.06A7.5 7.5 0 0 1 14 18.7v2.06a9.5 9.5 0 0 0 0-17.53z' })),
  ChevronLeft: ({ size = 18, color = 'currentColor', style }) =>
    h('svg', { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round', style },
      h('polyline', { points: '15 18 9 12 15 6' })),
  ChevronRight: ({ size = 18, color = 'currentColor', style }) =>
    h('svg', { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round', style },
      h('polyline', { points: '9 18 15 12 9 6' })),
  Queue: ({ size = 20, color = 'currentColor', style }) =>
    h('svg', { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', style },
      h('rect', { x: 3, y: 6, width: 18, height: 14, rx: 2 }),
      h('path', { d: 'M3 10h18' }), h('path', { d: 'M8 14h2' })),
  Mic: ({ size = 20, color = 'currentColor', style }) =>
    h('svg', { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', style },
      h('rect', { x: 9, y: 2, width: 6, height: 12, rx: 3 }),
      h('path', { d: 'M5 11a7 7 0 0 0 14 0' }),
      h('path', { d: 'M12 18v4' })),
  SpotifyGlyph: ({ size = 32, style }) =>
    h('svg', { width: size, height: size, viewBox: '0 0 168 168', style },
      h('circle', { cx: 84, cy: 84, r: 84, fill: '#1ed760' }),
      h('path', { fill: '#000', d: 'M119.2 122.6c-1.5 2.5-4.7 3.3-7.2 1.7-19.7-12-44.5-14.7-73.7-8-2.8.6-5.7-1.1-6.4-3.9-.6-2.8 1.1-5.7 3.9-6.4 31.9-7.3 59.4-4.2 81.6 9.3 2.4 1.5 3.2 4.7 1.8 7.3zm9.3-20.7c-1.9 3-5.8 4-8.9 2.1-22.6-13.9-57-17.9-83.8-9.8-3.4 1-7-1-8-4.4-1-3.4 1-7 4.4-8 30.5-9.2 68.4-4.8 94.4 11.2 3.1 1.8 4 5.8 1.9 8.9zm.8-21.6C102 64.2 56.4 62.4 30.6 70.3c-4 1.2-8.3-1.1-9.5-5.1-1.2-4 1.1-8.3 5.1-9.5 29.7-9 80-7 110.2 11 3.6 2.2 4.8 6.9 2.7 10.5-2.1 3.6-6.9 4.8-10.4 2.7z' })),
};

window.Icons = Icons;
