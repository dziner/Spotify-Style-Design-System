/* global React */
function PlaylistView({ playlist, currentTrack, isPlaying, onPlay, onPlayAll }) {
  // Tint the hero gradient using the playlist's accent
  const hero = playlist.accent || '#2a4a8a';
  return (
    <div className="sp-playlist">
      <div className="sp-playlist-hero" style={{ background: `linear-gradient(180deg, ${hero} 0%, rgba(18,18,18,0) 100%)` }}>
        <div className="sp-playlist-hero-cover" style={{ background: playlist.cover }}>
          {playlist.id === 'liked' && <Icons.HeartFilled size={64} color="#fff" />}
        </div>
        <div className="sp-playlist-hero-meta">
          <div className="sp-playlist-kind">{playlist.kind}</div>
          <h1 className="sp-playlist-title">{playlist.name}</h1>
          <div className="sp-playlist-desc">{playlist.description}</div>
          <div className="sp-playlist-foot">
            <span className="sp-playlist-owner">{playlist.owner}</span>
            <span className="sp-bullet">•</span>
            <span>{playlist.tracks.length} songs,</span>
            <span className="sp-playlist-runtime">{playlist.runtime}</span>
          </div>
        </div>
      </div>

      <div className="sp-playlist-toolbar" style={{ background: `linear-gradient(180deg, ${hero}55 0%, rgba(18,18,18,0.6) 100%)` }}>
        <button className="sp-play-big" onClick={() => onPlayAll && onPlayAll()} aria-label="Play playlist">
          {isPlaying ? <Icons.Pause size={26} color="#000" /> : <Icons.Play size={26} color="#000" />}
        </button>
        <button className="sp-icon-btn sp-icon-btn--lg" aria-label="Like"><Icons.Heart size={30} color="#b3b3b3" /></button>
        <button className="sp-icon-btn sp-icon-btn--lg" aria-label="More"><Icons.Ellipsis size={26} color="#b3b3b3" /></button>
      </div>

      <div className="sp-tracklist">
        <div className="sp-track-head">
          <div className="sp-th-num">#</div>
          <div>Title</div>
          <div>Album</div>
          <div>Date added</div>
          <div className="sp-th-time">⏱</div>
        </div>
        {playlist.tracks.map((t, i) => (
          <TrackRow
            key={t.id}
            index={i}
            track={t}
            isPlaying={currentTrack === t.id}
            onPlay={onPlay}
          />
        ))}
      </div>
    </div>
  );
}

window.PlaylistView = PlaylistView;
