import batGif from "@/img/bat.gif";

function LocationPinIcon() {
  return (
    <svg className="pin-icon" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path
        className="pin-icon__outline"
        d="M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z"
      />
      <path
        className="pin-icon__filled"
        d="M128,16a88.1,88.1,0,0,0-88,88c0,75.3,80,132.17,83.41,134.55a8,8,0,0,0,9.18,0C136,236.17,216,179.3,216,104A88.1,88.1,0,0,0,128,16Zm0,56a32,32,0,1,1-32,32A32,32,0,0,1,128,72Z"
      />
    </svg>
  );
}

export function LocationCard() {
  return (
    <section className="location-section" aria-label="Location">
      <div className="now-playing">
        <div className="now-playing__body">
          <span className="now-playing__icon" aria-hidden="true">
            <LocationPinIcon />
          </span>

          <p className="now-playing__copy">
            <span className="now-playing__label">Based in</span>
            <span className="now-playing__track">Berlin &amp; NYC</span>
          </p>
        </div>

        <div className="now-playing__art">
          <img className="now-playing__bat" src={batGif.src} alt="" />
        </div>
      </div>
    </section>
  );
}
