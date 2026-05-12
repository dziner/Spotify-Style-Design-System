/* global React */
function Footer() {
  const cols = [
    { title: 'Company', links: ['About', 'Jobs', 'For the Record'] },
    { title: 'Communities', links: ['For Artists', 'Developers', 'Advertising', 'Investors', 'Vendors'] },
    { title: 'Useful links', links: ['Support', 'Free Mobile App', 'Popular Albums'] },
    { title: 'Spotify Plans', links: ['Premium Individual', 'Premium Duo', 'Premium Family', 'Premium Student', 'Spotify Free'] },
  ];
  return (
    <footer className="mk-footer">
      <div className="mk-footer-inner">
        <div className="mk-footer-brand">
          <Icons.SpotifyGlyph size={36} />
        </div>
        <div className="mk-footer-cols">
          {cols.map(c => (
            <div key={c.title} className="mk-footer-col">
              <div className="mk-footer-col-title">{c.title}</div>
              {c.links.map(l => <a key={l}>{l}</a>)}
            </div>
          ))}
        </div>
      </div>
      <div className="mk-footer-base">
        <span>© 2026 Spotify-Style Design System (recreation)</span>
        <span>Legal · Privacy Center · Cookies</span>
      </div>
    </footer>
  );
}
window.Footer = Footer;
