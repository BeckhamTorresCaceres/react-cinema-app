import { useEffect, useRef } from "react";

const GRAIN_SCALE = 3;
const SCRATCH_COUNT = 3;
const SCRATCH_LIFESPAN = 180;

interface Scratch {
  x: number;
  born: number;
  width: number;
  opacity: number;
}

/**
 * Renders film grain + vertical scratch lines on a canvas at 1/3 resolution.
 * Returns a ref to attach to the <canvas> element.
 */
export function useFilmGrain(active: boolean) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>(0);
  const scratchesRef = useRef<Scratch[]>([]);
  const lastFrameRef = useRef(0);
  const activeRef = useRef(active);

  useEffect(() => {
    activeRef.current = active;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!active) {
      cancelAnimationFrame(rafRef.current);
      scratchesRef.current = [];
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    const parent = canvas.parentElement;
    if (!parent) return;

    const resize = () => {
      canvas.width = Math.ceil(parent.clientWidth / GRAIN_SCALE);
      canvas.height = Math.ceil(parent.clientHeight / GRAIN_SCALE);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    const draw = (timestamp: number) => {
      if (!activeRef.current || document.hidden) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // ── Grain ──
      const imageData = ctx.createImageData(w, h);
      const pixels = imageData.data;
      for (let i = 0; i < pixels.length; i += 4) {
        const v = (Math.random() * 40) | 0;
        pixels[i] = v;
        pixels[i + 1] = v;
        pixels[i + 2] = v;
        pixels[i + 3] = 28;
      }
      ctx.putImageData(imageData, 0, 0);

      // ── Vertical scratch lines ──
      if (timestamp - lastFrameRef.current > SCRATCH_LIFESPAN) {
        lastFrameRef.current = timestamp;
        if (Math.random() < 0.5) {
          const scratches = scratchesRef.current;
          if (scratches.length < SCRATCH_COUNT) {
            scratches.push({
              x: Math.random() * w,
              born: timestamp,
              width: Math.random() < 0.4 ? 2 : 1,
              opacity: 0.08 + Math.random() * 0.1,
            });
          }
        }
      }

      const alive: Scratch[] = [];
      for (const s of scratchesRef.current) {
        const age = timestamp - s.born;
        if (age > SCRATCH_LIFESPAN * 2) continue;
        const fade = age > SCRATCH_LIFESPAN ? 1 - (age - SCRATCH_LIFESPAN) / SCRATCH_LIFESPAN : 1;
        ctx.fillStyle = `rgba(200,200,200,${s.opacity * fade})`;
        ctx.fillRect(s.x, 0, s.width, h);
        alive.push(s);
      }
      scratchesRef.current = alive;

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, [active]);

  return canvasRef;
}
