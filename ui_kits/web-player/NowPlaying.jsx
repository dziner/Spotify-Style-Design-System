/* global React */
const { useState: useState_NP, useEffect } = React;

function NowPlaying({ track, isPlaying, onToggle, onNext, onPrev, shuffle, repeat, onShuffle, onRepeat }) {
  const [progress, setProgress] = useState_NP(0.35);

  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => setProgress(p => (p >= 1 ? 0 : p + 0.005)), 250);
    return () => clearInterval(id);
  }, [isPlaying]);

  const total = parseDur(track?.duration || '3:59');
  const elapsed = fmt(total * progress);

  return (
    <footer className="sp-now">
      <div className="sp-now-left">
        {track && (
          <>
            <div className="sp-now-cover" style={{ background: track.cover }} />
            <div className="sp-now-meta">
              <div className="sp-now-title">{track.title}</div>
              <div className="sp-now-artist">{track.artist}</div>
            </div>
            <button className="sp-icon-btn"><Icons.HeartFilled size={18} color="#1ed760" /></button>
          </>
        )}
      </div>

      <div className="sp-now-center">
        <div className="sp-now-controls">
          <button className={`sp-icon-btn ${shuffle ? 'is-active' : ''}`} onClick={onShuffle} aria-label="Shuffle">
            <Icons.Shuffle size={18} color={shuffle ? '#1ed760' : '#b3b3b3'} />
          </button>
          <button className="sp-icon-btn" onClick={onPrev} aria-label="Previous"><Icons.Prev size={18} color="#fff" /></button>
          <button className="sp-now-play" onClick={onToggle} aria-label={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? <Icons.Pause size={16} color="#000" /> : <Icons.Play size={16} color="#000" />}
          </button>
          <button className="sp-icon-btn" onClick={onNext} aria-label="Next"><Icons.Next size={18} color="#fff" /></button>
          <button className={`sp-icon-btn ${repeat ? 'is-active' : ''}`} onClick={onRepeat} aria-label="Repeat">
            <Icons.Repeat size={18} color={repeat ? '#1ed760' : '#b3b3b3'} />
          </button>
        </div>
        <div className="sp-now-scrub">
          <span className="sp-now-t">{elapsed}</span>
          <div className="sp-now-track" onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setProgress(Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width)));
          }}>
            <div className="sp-now-fill" style={{ width: `${progress * 100}%` }} />
            <div className="sp-now-dot" style={{ left: `${progress * 100}%` }} />
          </div>
          <span className="sp-now-t">{track?.duration || '0:00'}</span>
        </div>
      </div>

      <div className="sp-now-right">
        <button className="sp-icon-btn"><Icons.Mic size={18} color="#b3b3b3" /></button>
        <button className="sp-icon-btn"><Icons.Queue size={18} color="#b3b3b3" /></button>
        <button className="sp-icon-btn"><Icons.Volume size={18} color="#b3b3b3" /></button>
        <div className="sp-vol"><div className="sp-vol-fill" style={{ width: '60%' }} /></div>
      </div>
    </footer>
  );
}

function parseDur(s) {
  const [m, sec] = s.split(':').map(Number);
  return m * 60 + sec;
}
function fmt(t) {
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

window.NowPlaying = NowPlaying;
