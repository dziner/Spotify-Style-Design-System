/* global React */
function MarketingNav() {
  return (
    <header className="mk-nav">
      <div className="mk-nav-left">
        <Icons.SpotifyGlyph size={32} />
        <span className="mk-brand">Spotify</span>
        <nav className="mk-links">
          <a>Premium</a><a>Support</a><a>Download</a>
        </nav>
      </div>
      <div className="mk-nav-right">
        <a className="mk-link-muted">Sign up</a>
        <a className="mk-link-muted">Log in</a>
        <button className="mk-green-cta mk-green-cta--sm">Get Premium</button>
      </div>
    </header>
  );
}
window.MarketingNav = MarketingNav;
