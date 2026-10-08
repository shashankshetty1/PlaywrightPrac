import { useEffect, useState } from 'react';

/** Tracks which section is currently in the reading zone (upper-middle of the viewport). */
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string>('');

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      // A thin band at 35% from the top: exactly one section intersects it at a time.
      { rootMargin: '-35% 0px -64% 0px' },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}
