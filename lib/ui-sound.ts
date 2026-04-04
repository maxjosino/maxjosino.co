import type { MutableRefObject } from "react";

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

function getAudioContext(audioContextRef: MutableRefObject<AudioContext | null>) {
  const AudioContextClass = window.AudioContext ?? window.webkitAudioContext;

  if (!AudioContextClass) {
    return null;
  }

  const audioContext = audioContextRef.current ?? new AudioContextClass();
  audioContextRef.current = audioContext;

  if (audioContext.state === "suspended") {
    void audioContext.resume();
  }

  return audioContext;
}

export function playThemeToggleSound(
  theme: "dark" | "light",
  audioContextRef: MutableRefObject<AudioContext | null>
) {
  const audioContext = getAudioContext(audioContextRef);

  if (!audioContext) {
    return;
  }

  const now = audioContext.currentTime;
  const gainNode = audioContext.createGain();
  gainNode.connect(audioContext.destination);

  const oscillator = audioContext.createOscillator();
  oscillator.type = theme === "dark" ? "triangle" : "sine";
  oscillator.frequency.setValueAtTime(theme === "dark" ? 720 : 980, now);
  oscillator.frequency.exponentialRampToValueAtTime(theme === "dark" ? 420 : 700, now + 0.08);

  gainNode.gain.setValueAtTime(0.0001, now);
  gainNode.gain.exponentialRampToValueAtTime(0.045, now + 0.008);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

  oscillator.connect(gainNode);
  oscillator.start(now);
  oscillator.stop(now + 0.09);
}
