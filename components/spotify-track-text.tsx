"use client";

import { useEffect, useRef, useState } from "react";

interface SpotifyTrackTextProps {
  href: string | null;
  text: string;
}

const mobileBreakpointQuery = "(max-width: 720px)";

export function SpotifyTrackText({ href, text }: SpotifyTrackTextProps) {
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
  }, [text]);

  const content = href ? (
    <a className="now-playing__track spotify-track-marquee__content" href={href} target="_blank" rel="noopener noreferrer">
      {text}
    </a>
  ) : (
    <span className="now-playing__track spotify-track-marquee__content">{text}</span>
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
      {text}
    </a>
  ) : (
    <span className="now-playing__track spotify-track-marquee__content" aria-hidden="true">
      {text}
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
