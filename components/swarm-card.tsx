import { getLatestSwarmCheckin } from "@/lib/foursquare";
import batGif from "@/img/bat.gif";

function SwarmIcon() {
  return (
    <svg className="swarm-icon" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path
        className="swarm-icon__outline"
        d="M42.76,50A8,8,0,0,0,40,56V224a8,8,0,0,0,16,0V179.77c26.79-21.16,49.87-9.75,76.45,3.41,16.4,8.11,34.06,16.85,53,16.85,13.93,0,28.54-4.75,43.82-18a8,8,0,0,0,2.76-6V56A8,8,0,0,0,218.76,50c-28,24.23-51.72,12.49-79.21-1.12C111.07,34.76,78.78,18.79,42.76,50ZM216,172.25c-26.79,21.16-49.87,9.74-76.45-3.41-25-12.35-52.81-26.13-83.55-8.4V59.79c26.79-21.16,49.87-9.75,76.45,3.4,25,12.35,52.82,26.13,83.55,8.4Z"
      />
      <path
        className="swarm-icon__filled"
        d="M232,56V176a8,8,0,0,1-2.76,6c-15.28,13.23-29.89,18-43.82,18-18.91,0-36.57-8.74-53-16.85C105.87,170,82.79,158.61,56,179.77V224a8,8,0,0,1-16,0V56a8,8,0,0,1,2.77-6h0c36-31.18,68.31-15.21,96.79-1.12C167,62.46,190.79,74.2,218.76,50A8,8,0,0,1,232,56Z"
      />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg className="swarm-pin" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path
        className="swarm-pin__outline"
        d="M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z"
      />
      <path
        className="swarm-pin__filled"
        d="M128,16a88.1,88.1,0,0,0-88,88c0,75.3,80,132.17,83.41,134.55a8,8,0,0,0,9.18,0C136,236.17,216,179.3,216,104A88.1,88.1,0,0,0,128,16Zm0,56a32,32,0,1,1-32,32A32,32,0,0,1,128,72Z"
      />
    </svg>
  );
}

function formatCheckinDate(createdAt: string | null) {
  if (!createdAt) {
    return null;
  }

  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(date);
}

export async function SwarmCard() {
  const latestCheckin = await getLatestSwarmCheckin();

  if (!latestCheckin) {
    return null;
  }

  const formattedDate = formatCheckinDate(latestCheckin.createdAt);
  const meta = [latestCheckin.city, formattedDate].filter(Boolean).join(" · ");

  return (
    <section className="swarm-section" aria-label="Last check-in">
      <div className="now-playing">
        <div className="now-playing__body">
          <span className="now-playing__icon" aria-hidden="true">
            <SwarmIcon />
          </span>

          <p className="now-playing__copy">
            <span className="now-playing__label">Last check-in</span>

            {latestCheckin.venueUrl ? (
              <a
                className="now-playing__track"
                href={latestCheckin.venueUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {latestCheckin.venueName}
              </a>
            ) : (
              <span className="now-playing__track">{latestCheckin.venueName}</span>
            )}

            {meta ? <span className="now-playing__meta">{` · ${meta}`}</span> : null}
          </p>
        </div>

        <div className="now-playing__art">
          <span className="now-playing__location">
            <span className="now-playing__location-icon" aria-hidden="true">
              <PinIcon />
            </span>
            <span className="now-playing__location-label">Berlin &amp; NYC</span>
          </span>
          <img className="now-playing__bat" src={batGif.src} alt="" />
        </div>
      </div>
    </section>
  );
}
