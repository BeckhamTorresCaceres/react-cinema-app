import { useCallback, useRef } from "react";

/**
 * Procedural projector audio: mechanical click + low hum.
 * No external audio files needed.
 */
export function useProjectorAudio() {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current || ctxRef.current.state === "closed") {
      ctxRef.current = new AudioContext();
    }
    if (ctxRef.current.state === "suspended") {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  /** Mechanical click — short square-wave sweep */
  const playClick = useCallback(() => {
    try {
      const ctx = getCtx();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "square";
      osc.frequency.setValueAtTime(900, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.04);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.07);
    } catch {
      /* AudioContext not available — silent fallback */
    }
  }, [getCtx]);

  /** Low projector hum — bandpass-filtered noise, fades out over durationMs */
  const playHum = useCallback(
    (durationMs = 1800) => {
      try {
        const ctx = getCtx();
        const now = ctx.currentTime;
        const duration = durationMs / 1000;

        const bufferSize = ctx.sampleRate * duration;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const source = ctx.createBufferSource();
        source.buffer = buffer;

        const bandpass = ctx.createBiquadFilter();
        bandpass.type = "bandpass";
        bandpass.frequency.value = 110;
        bandpass.Q.value = 1.2;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.035, now + 0.08);
        gain.gain.setValueAtTime(0.035, now + duration * 0.5);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        source.connect(bandpass).connect(gain).connect(ctx.destination);
        source.start(now);
        source.stop(now + duration + 0.01);
      } catch {
        /* silent fallback */
      }
    },
    [getCtx]
  );

  return { playClick, playHum };
}
