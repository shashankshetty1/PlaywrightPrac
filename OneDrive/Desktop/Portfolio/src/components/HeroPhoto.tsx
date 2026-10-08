import { useEffect, useRef, type CSSProperties } from 'react';
import { profile } from '../data/profile';

/**
 * Layered hero portrait: an offset tinted plate and a hairline frame sit behind the photo,
 * and each layer drifts a different distance with the pointer for a subtle depth effect.
 * The photo keeps its native aspect ratio (set from profile.photo), so nothing is cropped.
 */
export function HeroPhoto() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;

    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        // Normalised -1..1 offset of the pointer from the viewport centre.
        el.style.setProperty('--px', ((e.clientX / window.innerWidth) * 2 - 1).toFixed(3));
        el.style.setProperty('--py', ((e.clientY / window.innerHeight) * 2 - 1).toFixed(3));
      });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  const { src, alt, width, height } = profile.photo;

  return (
    <div ref={ref} className="hero-figure hero-step" style={{ '--i': 2, '--ratio': `${width} / ${height}` } as CSSProperties}>
      <div className="figure-plate" aria-hidden="true" />
      <div className="figure-frame" aria-hidden="true" />
      <div className="figure-dots" aria-hidden="true" />

      <figure className="figure-photo">
        <img src={src} alt={alt} width={width} height={height} fetchPriority="high" decoding="async" />
      </figure>

      <div className="figure-card">
        <span className="status-dot" aria-hidden="true" />
        <span>
          <span className="figure-card-label">Currently</span>
          <span className="figure-card-value">
            {profile.role} · {profile.company}
          </span>
        </span>
      </div>

      <div className="figure-tag" aria-hidden="true">
        plan · code · <b>test</b> · repeat
      </div>
    </div>
  );
}
