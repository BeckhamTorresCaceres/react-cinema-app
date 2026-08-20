import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

import { useFilmGrain } from "./useFilmGrain";
import "./FilmProjector.css";

interface FilmProjectorTransitionProps {
  active: boolean;
  duration?: number;
  onComplete?: () => void;
}

export const FilmProjectorTransition = ({
  active,
  duration = 2,
  onComplete,
}: FilmProjectorTransitionProps) => {
  const [grainActive, setGrainActive] = useState(false);
  const grainCanvasRef = useFilmGrain(grainActive);

  const blackoutRef = useRef<HTMLDivElement>(null);
  const beamRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);
  const flickerRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!active) {
      tlRef.current?.kill();
      gsap.set(
        [blackoutRef.current, beamRef.current, vignetteRef.current, flickerRef.current].filter(Boolean),
        { opacity: 0 }
      );
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setGrainActive(false);
          onComplete?.();
        },
      });
      tlRef.current = tl;

      const blackout = blackoutRef.current;
      const beam = beamRef.current;
      const vignette = vignetteRef.current;
      const flicker = flickerRef.current;

      if (!blackout || !beam || !vignette || !flicker) return;

      // Phase 1: Blackout appears instantly
      tl.set(blackout, { opacity: 1 }, 0);

      // Phase 2: Beam fades in
      tl.to(beam, { opacity: 0.7, duration: 0.4, ease: "power2.out" }, 0.1);

      // Phase 3: Blackout fades away
      tl.to(blackout, { opacity: 0, duration: 0.35, ease: "power1.in" }, 0.25);

      // Phase 4: Vignette + grain + flicker appear
      tl.call(() => setGrainActive(true), [], 0.35);
      tl.to(vignette, { opacity: 1, duration: 0.3, ease: "power1.out" }, 0.35);
      tl.to(flicker, { opacity: 1, duration: 0.15, ease: "none" }, 0.35);

      // Phase 5: Everything fades out smoothly
      const fadeStart = duration * 0.55;
      tl.to(beam, { opacity: 0, duration: duration * 0.4, ease: "power1.in" }, fadeStart);
      tl.to(vignette, { opacity: 0, duration: duration * 0.35, ease: "power1.in" }, fadeStart);
      tl.to(flicker, { opacity: 0, duration: duration * 0.3, ease: "power1.in" }, fadeStart);
    });

    return () => ctx.revert();
  }, [active, duration, onComplete]);

  return (
    <div className="film-projector-overlay">
      <div ref={blackoutRef} className="film-projector__blackout" />
      <div ref={beamRef} className="film-projector__beam" />
      <div ref={vignetteRef} className="film-projector__vignette" />
      <div
        ref={flickerRef}
        className={`film-projector__flicker ${grainActive ? "film-projector__flicker--active" : ""}`}
      />
      <canvas ref={grainCanvasRef} className="film-projector__grain-canvas" />
    </div>
  );
};
