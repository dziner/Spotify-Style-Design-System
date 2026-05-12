/* global React */
function TrackRow({ index, track, isPlaying, isHovered, onPlay }) {
  return (
    <div className={`sp-track-row ${isPlaying ? 'is-playing' : ''}`} onDoubleClick={() => onPlay && onPlay(track, index)}>
      <div className="sp-track-num">
        {isPlaying
          ? <PlayingBars />
          : <>
              <span className="sp-track-num-text">{index + 1}</span>
              <button className="sp-track-play" onClick={() => onPlay && onPlay(track, index)} aria-label={`Play ${track.title}`}>
                <Icons.Play size={14} color="#fff" />
              </button>
            </>}
      </div>
      <div className="sp-track-title">
        <div className="sp-track-cover" style={{ background: track.cover }} />
        <div>
          <div className={`sp-track-name ${isPlaying ? 'is-playing-text' : ''}`}>{track.title}</div>
          <div className="sp-track-artist">{track.artist}</div>
        </div>
      </div>
      <div className="sp-track-album">{track.album}</div>
      <div className="sp-track-added">{track.added}</div>
      <div className="sp-track-time">{track.duration}</div>
    </div>
  );
}

function PlayingBars() {
  return (
    <div className="sp-eq" aria-label="Now playing">
      <span /><span /><span /><span />
    </div>
  );
}

window.TrackRow = TrackRow;
window.PlayingBars = PlayingBars;
