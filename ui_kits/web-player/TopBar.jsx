/* global React */
function TopBar({ onBack, onForward, view, query, onQueryChange }) {
  const showSearch = view === 'search';
  return (
    <header className="sp-topbar">
      <div className="sp-topbar-left">
        <button className="sp-topbar-arrow" onClick={onBack} aria-label="Back"><Icons.ChevronLeft size={20} color="#fff" /></button>
        <button className="sp-topbar-arrow" onClick={onForward} aria-label="Forward"><Icons.ChevronRight size={20} color="#fff" /></button>
        {showSearch && (
          <div className="sp-topbar-search">
            <Icons.Search size={20} color="#fff" />
            <input value={query} onChange={e => onQueryChange(e.target.value)} placeholder="What do you want to play?" />
          </div>
        )}
      </div>
      <div className="sp-topbar-right">
        <button className="sp-btn sp-btn--ghost-upper">Explore Premium</button>
        <button className="sp-btn sp-btn--dark-pill">Install App</button>
        <div className="sp-avatar">JR</div>
      </div>
    </header>
  );
}

window.TopBar = TopBar;
