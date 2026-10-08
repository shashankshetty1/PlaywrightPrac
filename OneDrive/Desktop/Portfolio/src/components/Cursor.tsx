import { useEffect, useRef } from 'react';

const INTERACTIVE = 'a, button, [role="button"]';
const MAGNET_STRENGTH = 0.22;
const MAGNET_MAX = 8;

/**
 * Two quiet pointer interactions (the native cursor is left untouched):
 * 1. A soft accent glow that trails the pointer across the white canvas and tightens over links.
 * 2. "Magnetic" controls — elements marked `data-magnetic` lean a few pixels toward the pointer.
 * Only runs on fine pointers when reduced motion isn't requested.
 */
export function Cursor() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;
    const media = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    if (!media.matches) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 3 };
    const pos = { ...target };
    let frame = 0;
    let running = false;
    let magnet: HTMLElement | null = null;

    const tick = () => {
      pos.x += (target.x - pos.x) * 0.12;
      pos.y += (target.y - pos.y) * 0.12;
      glow.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      // Stop once caught up so the effect costs nothing while the pointer is idle.
      if (Math.abs(target.x - pos.x) > 0.2 || Math.abs(target.y - pos.y) > 0.2) {
        frame = requestAnimationFrame(tick);
      } else {
        running = false;
      }
    };

    const release = () => {
      if (magnet) magnet.style.translate = '';
      magnet = null;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      target.x = e.clientX;
      target.y = e.clientY;
      glow.classList.add('is-visible');
      if (!running) {
        running = true;
        frame = requestAnimationFrame(tick);
      }

      const el = (e.target as Element | null)?.closest?.<HTMLElement>('[data-magnetic]') ?? null;
      if (el !== magnet) release();
      if (el) {
        magnet = el;
        const r = el.getBoundingClientRect();
        const dx = Math.max(-MAGNET_MAX, Math.min(MAGNET_MAX, (e.clientX - (r.left + r.width / 2)) * MAGNET_STRENGTH));
        const dy = Math.max(-MAGNET_MAX, Math.min(MAGNET_MAX, (e.clientY - (r.top + r.height / 2)) * MAGNET_STRENGTH));
        // `translate` composes with any CSS `transform` hover effect instead of overriding it.
        el.style.translate = `${dx.toFixed(1)}px ${dy.toFixed(1)}px`;
      }
    };

    const onOver = (e: PointerEvent) => {
      glow.classList.toggle('is-focus', Boolean((e.target as Element | null)?.closest?.(INTERACTIVE)));
    };
    const onLeave = () => {
      glow.classList.remove('is-visible');
      release();
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerover', onOver, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(frame);
      release();
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return <div ref={glowRef} className="cursor-glow" aria-hidden="true" />;
}
