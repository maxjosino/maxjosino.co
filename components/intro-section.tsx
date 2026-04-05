import avatarMini from "@/img/avatar_mini.png";
import meSocial from "@/img/me-social.png";

export function IntroSection() {
  return (
    <section className="intro-section">
      <div className="intro-name-row">
        <p className="name">Max Josino</p>

        <span className="intro-photo-trigger" tabIndex={0}>
          <img className="intro-photo-trigger__icon" src={avatarMini.src} alt="" aria-hidden="true" />

          <span className="intro-photo-preview" aria-hidden="true">
            <span className="intro-photo-frame">
              <img className="intro-photo" src={meSocial.src} alt="" />
            </span>
          </span>
        </span>
      </div>

      <p>
        I’m a Founding Product Designer working across product design and design engineering.
      </p>

      <p>
        I’m the first hire and Founding Product Designer at{" "}
        <a
          className="brand-link is-ground"
          href="https://joinground.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Ground
        </a>
        , helping build an AI-powered platform for DTC brands across product design, systems, and
        the engineering work behind the product itself.
      </p>

      <p>
        Previously, I was an early design hire at{" "}
        <a
          className="brand-link is-nubank"
          href="https://www.crunchbase.com/organization/nubank"
          target="_blank"
          rel="noopener noreferrer"
        >
          Nubank
        </a>{" "}
        (NYSE: NU), where I worked across Credit Card, Customer Support, and Payments as the
        company grew from a startup into one of the world’s largest digital banks, serving more
        than 100 million users. Later, at{" "}
        <a
          className="brand-link is-fast"
          href="https://www.linkedin.com/company/fast"
          target="_blank"
          rel="noopener noreferrer"
        >
          Fast
        </a>
        , I worked on checkout, mobile SDK, and design systems adoption across design and
        engineering.
      </p>
    </section>
  );
}
