/* global React */
function BrowseHome({ greetingItems, sections, onPlay, onOpenPlaylist }) {
  return (
    <div className="sp-browse">
      <h1 className="sp-browse-greeting">Good evening</h1>
      <div className="sp-hero-grid">
        {greetingItems.map(item => <HeroCard key={item.id} item={item} onPlay={onPlay} />)}
      </div>

      {sections.map(section => (
        <section key={section.title} className="sp-browse-section">
          <div className="sp-section-head">
            <h2 className="sp-section-title">{section.title}</h2>
            <button className="sp-section-more">Show all</button>
          </div>
          <div className="sp-card-grid">
            {section.items.map(item => (
              <div key={item.id} onClick={() => item.kind === 'Playlist' && onOpenPlaylist && onOpenPlaylist(item.id)}>
                <Card item={item} onPlay={onPlay} />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

window.BrowseHome = BrowseHome;
