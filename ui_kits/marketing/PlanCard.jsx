/* global React */
function PlanCard({ name, price, period, features, cta, featured }) {
  return (
    <div className={`mk-plan ${featured ? 'is-featured' : ''}`}>
      {featured && <div className="mk-plan-badge">Most popular</div>}
      <div className="mk-plan-name">{name}</div>
      <div className="mk-plan-price">
        <span className="mk-plan-cur">$</span>
        <span className="mk-plan-num">{price}</span>
        <span className="mk-plan-period">/{period}</span>
      </div>
      <ul className="mk-plan-features">
        {features.map((f, i) => (
          <li key={i}>
            <span className="mk-check">✓</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <button className={featured ? 'mk-green-cta' : 'mk-outline-cta'}>{cta}</button>
    </div>
  );
}
window.PlanCard = PlanCard;
