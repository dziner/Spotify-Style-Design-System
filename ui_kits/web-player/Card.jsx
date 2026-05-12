/* global React */
function Card({ item, onPlay }) {
  return (
    <div className="sp-card" onClick={() => onPlay && onPlay(item)}>
      <div className="sp-card-art" style={{ background: item.cover }}>
        <button className="sp-card-fab" onClick={(e) => { e.stopPropagation(); onPlay && onPlay(item); }} aria-label={`Play ${item.name}`}>
          <Icons.Play size={18} color="#000" />
        </button>
      </div>
      <div className="sp-card-title">{item.name}</div>
      <div className="sp-card-sub">{item.description}</div>
    </div>
  );
}

function HeroCard({ item, onPlay }) {
  // Small horizontal hero card used in "Good afternoon" grid
  return (
    <div className="sp-hero-card" onClick={() => onPlay && onPlay(item)}>
      <div className="sp-hero-art" style={{ background: item.cover }}>
        {item.id === 'liked' && <Icons.HeartFilled size={32} color="#fff" />}
      </div>
      <div className="sp-hero-title">{item.name}</div>
      <button className="sp-hero-fab" onClick={(e) => { e.stopPropagation(); onPlay && onPlay(item); }} aria-label={`Play ${item.name}`}>
        <Icons.Play size={20} color="#000" />
      </button>
    </div>
  );
}

window.Card = Card;
window.HeroCard = HeroCard;
