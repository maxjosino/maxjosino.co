import type { MutableRefObject } from "react";

export function playThemeToggleSound(audioRef: MutableRefObject<HTMLAudioElement | null>) {
  const audio = audioRef.current ?? new Audio("/sounds/mouse-click.mp3");

  audio.preload = "auto";
  audio.volume = 0.55;
  audioRef.current = audio;

  try {
    audio.currentTime = 0;
  } catch {
    // Some browsers can throw if the media metadata has not loaded yet.
  }

  void audio.play().catch(() => {
    // Ignore blocked playback attempts so the theme interaction still completes.
  });
}
