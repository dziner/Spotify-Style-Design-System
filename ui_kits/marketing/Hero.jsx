/* global React */
function Hero() {
  return (
    <section className="mk-hero">
      <div className="mk-hero-text">
        <div className="mk-eyebrow">Premium Individual</div>
        <h1 className="mk-display">Listening is everything.</h1>
        <p className="mk-lead">Millions of songs and podcasts. No credit card needed.</p>
        <div className="mk-hero-actions">
          <button className="mk-green-cta">GET PREMIUM FREE</button>
          <button className="mk-outline-pill">Learn more</button>
        </div>
        <p className="mk-fine">$11.99/month after. Cancel anytime.</p>
      </div>
      <div className="mk-hero-art" aria-hidden="true">
        <div className="mk-hero-disc" />
        <div className="mk-hero-disc mk-hero-disc--2" />
        <div className="mk-hero-disc mk-hero-disc--3" />
      </div>
    </section>
  );
}
window.Hero = Hero;
