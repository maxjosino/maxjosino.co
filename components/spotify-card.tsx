import { fallbackSpotifyTrack } from "@/lib/spotify";
import batGif from "@/img/bat.gif";

function SpotifyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path
        d="M12 21s6-5.45 6-11a6 6 0 1 0-12 0c0 5.55 6 11 6 11Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export function SpotifyCard() {
  const displayTrack = fallbackSpotifyTrack;

  return (
    <section className="spotify-section" aria-label="Last played">
      <div className="now-playing">
        <div className="now-playing__body">
          <span className="now-playing__icon" aria-hidden="true">
            <SpotifyIcon />
          </span>

          <p className="now-playing__copy">
            <span className="now-playing__label">Last played</span>

            {displayTrack?.songUrl ? (
              <>
                <a
                  className="now-playing__track"
                  href={displayTrack.songUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {displayTrack.title}
                </a>

                {displayTrack?.artist ? (
                  <>
                    {" by "}
                    <a
                      className="now-playing__track"
                      href={displayTrack.songUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {displayTrack.artist}
                    </a>
                  </>
                ) : null}
              </>
            ) : (
              <span className="now-playing__track">
                {displayTrack?.title}
                {displayTrack?.artist ? ` by ${displayTrack.artist}` : ""}
              </span>
            )}
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
