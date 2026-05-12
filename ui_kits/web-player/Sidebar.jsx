/* global React */
const { useState } = React;

function Sidebar({ active, onNavigate, playlists, currentPlaylist }) {
  return (
    <aside className="sp-sidebar">
      <nav className="sp-sidebar-nav">
        <div className="sp-sidebar-brand">
          <Icons.SpotifyGlyph size={36} />
          <span className="sp-sidebar-brand-name">Spotify</span>
        </div>
        <NavItem icon={<Icons.Home size={24} />} label="Home" active={active === 'home'} onClick={() => onNavigate('home')} />
        <NavItem icon={<Icons.Search size={24} />} label="Search" active={active === 'search'} onClick={() => onNavigate('search')} />
      </nav>

      <div className="sp-sidebar-lib">
        <div className="sp-sidebar-lib-head">
          <div className="sp-sidebar-lib-title">
            <Icons.Library size={24} color="#b3b3b3" />
            <span>Your Library</span>
          </div>
          <button className="sp-icon-btn" aria-label="Create playlist"><Icons.Plus size={20} color="#b3b3b3" /></button>
        </div>

        <div className="sp-sidebar-lib-filters">
          <button className="sp-pill-sm sp-pill-sm--active">Playlists</button>
          <button className="sp-pill-sm">Artists</button>
          <button className="sp-pill-sm">Albums</button>
        </div>

        <div className="sp-sidebar-lib-list">
          {playlists.map(pl => (
            <button key={pl.id} className={`sp-lib-row ${currentPlaylist === pl.id ? 'is-current' : ''}`} onClick={() => onNavigate('playlist', pl.id)}>
              <div className="sp-lib-art" style={{ background: pl.cover }}>
                {pl.id === 'liked' && <Icons.HeartFilled size={20} color="#fff" />}
              </div>
              <div className="sp-lib-meta">
                <div className={`sp-lib-name ${currentPlaylist === pl.id ? 'is-playing' : ''}`}>{pl.name}</div>
                <div className="sp-lib-sub">{pl.kind} · {pl.owner}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <button className={`sp-nav-item ${active ? 'is-active' : ''}`} onClick={onClick}>
      {icon}<span>{label}</span>
    </button>
  );
}

window.Sidebar = Sidebar;
