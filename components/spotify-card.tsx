"use client";

import { useEffect, useMemo, useState } from "react";
import type { SpotifyTrackPayload } from "@/lib/spotify";

function SpotifyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

function SpotifySkeleton() {
  return (
    <div className="spotify-card spotify-card--loading" aria-hidden="true">
      <div className="spotify-card__skeleton">
        <div className="spotify-card__skeleton-art" />
        <div className="spotify-card__skeleton-copy">
          <div className="spotify-card__skeleton-line is-short" />
          <div className="spotify-card__skeleton-line is-medium" />
          <div className="spotify-card__skeleton-line is-smaller" />
        </div>
      </div>
    </div>
  );
}

function formatPlayedAt(value: string | null) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

export function SpotifyCard() {
  const [track, setTrack] = useState<SpotifyTrackPayload | null>(null);
  const [lastValidTrack, setLastValidTrack] = useState<SpotifyTrackPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadTrack = async (initial = false) => {
      try {
        const response = await fetch("/api/spotify", {
          cache: "no-store"
        });

        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as SpotifyTrackPayload;

        if (!mounted) {
          return;
        }

        setTrack(payload);

        if (payload.title) {
          setLastValidTrack(payload);
        } else if (initial) {
          setLastValidTrack(null);
        }
      } catch {
        // Keep the last valid payload on screen when Spotify is temporarily unavailable.
      } finally {
        if (mounted && initial) {
          setIsLoading(false);
        }
      }
    };

    void loadTrack(true);

    const intervalId = window.setInterval(() => {
      void loadTrack();
    }, 15000);

    return () => {
      mounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const displayTrack = useMemo(() => {
    if (track?.title) {
      return track;
    }

    return lastValidTrack;
  }, [lastValidTrack, track]);

  if (isLoading) {
    return (
      <section className="spotify-section" aria-labelledby="spotify-title">
        <h2 className="section-title" id="spotify-title">
          Listening
        </h2>
        <SpotifySkeleton />
      </section>
    );
  }

  const statusLabel = displayTrack?.isPlaying
    ? "Now playing"
    : displayTrack?.title
      ? "Last played"
      : "Not listening";
  const playedAt = displayTrack?.isPlaying ? null : formatPlayedAt(displayTrack?.playedAt ?? null);

  return (
    <section className="spotify-section" aria-labelledby="spotify-title">
      <h2 className="section-title" id="spotify-title">
        Listening
      </h2>

      <div className="spotify-card">
        <div className="spotify-card__art" data-playing={displayTrack?.isPlaying ? "true" : "false"} aria-hidden="true">
          {displayTrack?.albumImageUrl ? (
            <img src={displayTrack.albumImageUrl} alt="Album art" />
          ) : (
            <div className="spotify-card__art-fallback">♪</div>
          )}
        </div>

        <div className="spotify-card__content">
          <span className="spotify-card__eyebrow">
            <span
              className="spotify-card__status-dot"
              data-playing={displayTrack?.isPlaying ? "true" : "false"}
            />
            <span>{statusLabel}</span>
          </span>

          {displayTrack?.songUrl && displayTrack.title ? (
            <a
              className="spotify-card__title"
              href={displayTrack.songUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {displayTrack.title}
            </a>
          ) : (
            <span className="spotify-card__title">Nothing playing</span>
          )}

          {displayTrack?.artist ? (
            <div className="spotify-card__artist">{displayTrack.artist}</div>
          ) : null}

          {playedAt ? <div className="spotify-card__meta">Last played at {playedAt}</div> : null}
        </div>

        {displayTrack?.songUrl ? (
          <a
            className="spotify-card__icon-link"
            href={displayTrack.songUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open in Spotify"
          >
            <SpotifyIcon />
          </a>
        ) : null}
      </div>
    </section>
  );
}
