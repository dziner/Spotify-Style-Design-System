/* global window */
// Static seed data for the demo. Cover gradients stand in for album art.
const PLAYLISTS = {
  liked: {
    id: 'liked', name: 'Liked Songs', kind: 'Playlist', owner: 'Joel',
    description: 'The songs you love, all in one place.',
    cover: 'linear-gradient(135deg, #4a3eff 0%, #b3a7ff 100%)',
    accent: '#4a3eff',
    runtime: '14 hr 22 min',
    tracks: [
      { id: 't1', title: 'Punisher', artist: 'Phoebe Bridgers', album: 'Punisher', added: '3 days ago', duration: '3:59', cover: 'linear-gradient(135deg, #f3727f, #ffa42b)' },
      { id: 't2', title: 'Not', artist: 'Big Thief', album: 'Two Hands', added: '1 week ago', duration: '4:35', cover: 'linear-gradient(135deg, #539df5, #2a4a8a)' },
      { id: 't3', title: 'circle the drain', artist: 'Soccer Mommy', album: 'color theory', added: '2 weeks ago', duration: '4:53', cover: 'linear-gradient(135deg, #1ed760, #0a5c2a)' },
      { id: 't4', title: 'Black Madonna', artist: 'Cate Le Bon', album: 'Pompeii', added: '1 month ago', duration: '3:21', cover: 'linear-gradient(135deg, #ffa42b, #b34b00)' },
      { id: 't5', title: 'Heaven Is a Place', artist: 'Lana Del Rey', album: 'Did You Know That There\'s a Tunnel Under Ocean Blvd', added: '2 months ago', duration: '5:08', cover: 'linear-gradient(135deg, #b34a8a, #4a1a4e)' },
      { id: 't6', title: 'On The Floor', artist: 'Perfume Genius', album: 'Set My Heart on Fire Immediately', added: '3 months ago', duration: '3:42', cover: 'linear-gradient(135deg, #7c5fff, #312166)' },
      { id: 't7', title: 'Body Paint', artist: 'Arctic Monkeys', album: 'The Car', added: '4 months ago', duration: '4:55', cover: 'linear-gradient(135deg, #aa3a3a, #2a0e0e)' },
      { id: 't8', title: 'Bags', artist: 'Clairo', album: 'Immunity', added: '5 months ago', duration: '4:24', cover: 'linear-gradient(135deg, #ffd166, #b87800)' },
    ]
  },
  focus: {
    id: 'focus', name: 'Focus Flow', kind: 'Playlist', owner: 'Spotify',
    description: 'Up-tempo instrumentals for deep work.',
    cover: 'linear-gradient(135deg, #539df5 0%, #1a3266 100%)',
    accent: '#1a4d7a',
    runtime: '6 hr 41 min',
    tracks: [
      { id: 't1', title: 'Strobe', artist: 'deadmau5', album: 'For Lack of a Better Name', added: '2 days ago', duration: '10:33', cover: 'linear-gradient(135deg, #539df5, #2a4a8a)' },
      { id: 't2', title: 'Resonance', artist: 'HOME', album: 'Odyssey', added: '5 days ago', duration: '3:32', cover: 'linear-gradient(135deg, #ff5fa8, #6b1a4e)' },
      { id: 't3', title: 'Avril 14th', artist: 'Aphex Twin', album: 'Drukqs', added: '1 week ago', duration: '2:05', cover: 'linear-gradient(135deg, #d6c14a, #5e560a)' },
      { id: 't4', title: 'Nightcall', artist: 'Kavinsky', album: 'Outrun', added: '2 weeks ago', duration: '4:18', cover: 'linear-gradient(135deg, #ff4fb3, #211a44)' },
      { id: 't5', title: 'Outro', artist: 'M83', album: 'Hurry Up, We\'re Dreaming', added: '1 month ago', duration: '4:30', cover: 'linear-gradient(135deg, #ff9a4d, #5e1a0e)' },
    ]
  },
  daily1: {
    id: 'daily1', name: 'Daily Mix 1', kind: 'Playlist', owner: 'Spotify',
    description: 'Phoebe Bridgers, Big Thief, Soccer Mommy and more.',
    cover: 'linear-gradient(135deg, #f3727f 0%, #b34b00 100%)',
    accent: '#9a3322',
    runtime: '4 hr 12 min',
    tracks: [
      { id: 't1', title: 'Kyoto', artist: 'Phoebe Bridgers', album: 'Punisher', added: '1 day ago', duration: '3:11', cover: 'linear-gradient(135deg, #f3727f, #ffa42b)' },
      { id: 't2', title: 'Shoulderblades', artist: 'Soccer Mommy', album: 'color theory', added: '2 days ago', duration: '3:48', cover: 'linear-gradient(135deg, #1ed760, #0a5c2a)' },
      { id: 't3', title: 'Forgotten Eyes', artist: 'Big Thief', album: 'Two Hands', added: '4 days ago', duration: '3:54', cover: 'linear-gradient(135deg, #539df5, #2a4a8a)' },
      { id: 't4', title: 'Motion Sickness', artist: 'Phoebe Bridgers', album: 'Stranger in the Alps', added: '1 week ago', duration: '4:02', cover: 'linear-gradient(135deg, #f3727f, #ffa42b)' },
    ]
  }
};

const LIB = [
  { id: 'liked', name: 'Liked Songs', kind: 'Playlist', owner: '247 songs', cover: 'linear-gradient(135deg, #4a3eff 0%, #b3a7ff 100%)' },
  { id: 'daily1', name: 'Daily Mix 1', kind: 'Playlist', owner: 'Spotify', cover: 'linear-gradient(135deg, #f3727f 0%, #b34b00 100%)' },
  { id: 'focus', name: 'Focus Flow', kind: 'Playlist', owner: 'Spotify', cover: 'linear-gradient(135deg, #539df5 0%, #1a3266 100%)' },
  { id: 'release', name: 'Release Radar', kind: 'Playlist', owner: 'Spotify', cover: 'linear-gradient(135deg, #1ed760 0%, #0a5c2a 100%)' },
  { id: 'discover', name: 'Discover Weekly', kind: 'Playlist', owner: 'Spotify', cover: 'linear-gradient(135deg, #b34a8a 0%, #4a1a4e 100%)' },
  { id: 'chill', name: 'Chill Hits', kind: 'Playlist', owner: 'Spotify', cover: 'linear-gradient(135deg, #7c5fff 0%, #312166 100%)' },
];

const GREETING = [
  { id: 'liked', name: 'Liked Songs', cover: 'linear-gradient(135deg, #4a3eff 0%, #b3a7ff 100%)' },
  { id: 'daily1', name: 'Daily Mix 1', cover: 'linear-gradient(135deg, #f3727f 0%, #b34b00 100%)' },
  { id: 'focus', name: 'Focus Flow', cover: 'linear-gradient(135deg, #539df5 0%, #1a3266 100%)' },
  { id: 'discover', name: 'Discover Weekly', cover: 'linear-gradient(135deg, #b34a8a 0%, #4a1a4e 100%)' },
  { id: 'release', name: 'Release Radar', cover: 'linear-gradient(135deg, #1ed760 0%, #0a5c2a 100%)' },
  { id: 'chill', name: 'Chill Hits', cover: 'linear-gradient(135deg, #7c5fff 0%, #312166 100%)' },
];

const SECTIONS = [
  {
    title: 'Made for Joel',
    items: [
      { id: 'daily1', kind: 'Playlist', name: 'Daily Mix 1', description: 'Phoebe Bridgers, Big Thief, Soccer Mommy and more', cover: 'linear-gradient(135deg, #f3727f, #b34b00)' },
      { id: 'daily2', kind: 'Playlist', name: 'Daily Mix 2', description: 'Khruangbin, Mac DeMarco, Connan Mockasin and more', cover: 'linear-gradient(135deg, #ffd166, #b87800)' },
      { id: 'discover', kind: 'Playlist', name: 'Discover Weekly', description: 'Your weekly mixtape of fresh music. Updated Monday.', cover: 'linear-gradient(135deg, #b34a8a, #4a1a4e)' },
      { id: 'release', kind: 'Playlist', name: 'Release Radar', description: 'Catch all the latest music from artists you follow', cover: 'linear-gradient(135deg, #1ed760, #0a5c2a)' },
      { id: 'time', kind: 'Playlist', name: 'Time Capsule', description: 'Made for you. Songs to take you back in time.', cover: 'linear-gradient(135deg, #ff5fa8, #6b1a4e)' },
    ]
  },
  {
    title: 'Your top mixes',
    items: [
      { id: 'indie', kind: 'Playlist', name: 'Indie Mix', description: 'Phoebe Bridgers, Big Thief, Cate Le Bon and more', cover: 'linear-gradient(135deg, #aa3a3a, #2a0e0e)' },
      { id: 'electronic', kind: 'Playlist', name: 'Electronic Mix', description: 'Aphex Twin, Burial, Boards of Canada and more', cover: 'linear-gradient(135deg, #4a3eff, #1a1066)' },
      { id: 'ambient', kind: 'Playlist', name: 'Ambient Mix', description: 'Brian Eno, Stars of the Lid, Tim Hecker and more', cover: 'linear-gradient(135deg, #7c5fff, #312166)' },
      { id: 'jazz', kind: 'Playlist', name: 'Jazz Mix', description: 'Bill Evans, Alice Coltrane, Pharaoh Sanders and more', cover: 'linear-gradient(135deg, #ffa42b, #5e3a00)' },
      { id: 'classical', kind: 'Playlist', name: 'Classical Mix', description: 'Max Richter, Jóhann Jóhannsson, Ólafur Arnalds and more', cover: 'linear-gradient(135deg, #cbcbcb, #4d4d4d)' },
    ]
  }
];

window.DEMO_DATA = { PLAYLISTS, LIB, GREETING, SECTIONS };
