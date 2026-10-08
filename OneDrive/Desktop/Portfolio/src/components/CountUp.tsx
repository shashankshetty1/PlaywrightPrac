import { useEffect, useRef } from 'react';

/** Counts a stat like "500+" up from zero the first time it scrolls into view. */
export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const match = value.match(/^(\d+)(.*)$/);
    if (!el || !match || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const target = Number(match[1]);
    const suffix = match[2];
    let frame = 0;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const duration = 1400;
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 4);
        el.textContent = `${Math.round(target * eased)}${suffix}`;
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      el.textContent = `0${suffix}`;
      frame = requestAnimationFrame(tick);
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <>
      <span ref={ref} aria-hidden="true">
        {value}
      </span>
      <span className="sr-only">{value}</span>
    </>
  );
}
