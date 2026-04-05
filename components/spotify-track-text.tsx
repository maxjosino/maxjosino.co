"use client";

import { useEffect, useRef, useState } from "react";

interface SpotifyTrackTextProps {
  href: string | null;
  title: string;
  artist: string | null;
}

const mobileBreakpointQuery = "(max-width: 720px)";

function SpotifyTrackTextContent({ title, artist }: { title: string; artist: string | null }) {
  return (
    <>
      <span className="spotify-track-marquee__title">{title}</span>
      {artist ? (
        <>
          <span className="spotify-track-marquee__joiner"> by </span>
          <span className="spotify-track-marquee__artist">{artist}</span>
        </>
      ) : null}
    </>
  );
}

export function SpotifyTrackText({ href, title, artist }: SpotifyTrackTextProps) {
  const viewportRef = useRef<HTMLSpanElement | null>(null);
  const segmentRef = useRef<HTMLSpanElement | null>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    if (!viewportRef.current || !segmentRef.current) {
      return;
    }

    const mediaQuery = window.matchMedia(mobileBreakpointQuery);

    const measure = () => {
      if (!viewportRef.current || !segmentRef.current) {
        return;
      }

      if (!mediaQuery.matches) {
        setIsOverflowing(false);
        return;
      }

      setIsOverflowing(segmentRef.current.scrollWidth > viewportRef.current.clientWidth + 2);
    };

    measure();

    const resizeObserver = new ResizeObserver(() => {
      measure();
    });

    resizeObserver.observe(viewportRef.current);
    resizeObserver.observe(segmentRef.current);
    mediaQuery.addEventListener("change", measure);
    window.addEventListener("resize", measure);

    return () => {
      resizeObserver.disconnect();
      mediaQuery.removeEventListener("change", measure);
      window.removeEventListener("resize", measure);
    };
  }, [artist, title]);

  const content = href ? (
    <a className="now-playing__track spotify-track-marquee__content" href={href} target="_blank" rel="noopener noreferrer">
      <SpotifyTrackTextContent title={title} artist={artist} />
    </a>
  ) : (
    <span className="now-playing__track spotify-track-marquee__content">
      <SpotifyTrackTextContent title={title} artist={artist} />
    </span>
  );

  const duplicatedContent = href ? (
    <a
      className="now-playing__track spotify-track-marquee__content"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={-1}
      aria-hidden="true"
    >
      <SpotifyTrackTextContent title={title} artist={artist} />
    </a>
  ) : (
    <span className="now-playing__track spotify-track-marquee__content" aria-hidden="true">
      <SpotifyTrackTextContent title={title} artist={artist} />
    </span>
  );

  return (
    <span className={`spotify-track-marquee${isOverflowing ? " is-overflowing" : ""}`}>
      <span className="spotify-track-marquee__viewport" ref={viewportRef}>
        <span className="spotify-track-marquee__rail">
          <span className="spotify-track-marquee__segment" ref={segmentRef}>
            {content}
          </span>

          {isOverflowing ? (
            <span className="spotify-track-marquee__segment spotify-track-marquee__segment--duplicate">
              {duplicatedContent}
            </span>
          ) : null}
        </span>
      </span>
    </span>
  );
}
