import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, Menu, X } from 'lucide-react';
import { navLinks } from '../data/profile';
import { useActiveSection } from '../hooks/useActiveSection';

const sectionIds = navLinks.map((l) => l.id);

export function Navbar() {
  const active = useActiveSection(sectionIds);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, visible: false });
  // Light pill that follows the pointer/keyboard focus, separate from the black "active" pill.
  const [hover, setHover] = useState({ left: 0, width: 0, visible: false });

  const hoverTo = (el: HTMLElement) => setHover({ left: el.offsetLeft, width: el.offsetWidth, visible: true });
  const clearHover = () => setHover((h) => ({ ...h, visible: false }));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Slide the active pill under the current link.
  useLayoutEffect(() => {
    const update = () => {
      const link = listRef.current?.querySelector<HTMLAnchorElement>(`a[href="#${active}"]`);
      if (link) setIndicator({ left: link.offsetLeft, width: link.offsetWidth, visible: true });
      else setIndicator((s) => ({ ...s, visible: false }));
    };
    update();
    // Web fonts can shift link widths after first paint.
    document.fonts?.ready.then(update);
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [active]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth > 860) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
      document.body.style.overflow = '';
    };
  }, [open]);

  const activeLabel = navLinks.find((l) => l.id === active)?.label ?? 'Menu';

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
      <nav className="nav" aria-label="Primary">
        <ul ref={listRef} className="nav-links" onMouseLeave={clearHover}>
          <li
            className="nav-hover"
            aria-hidden="true"
            style={{ transform: `translateX(${hover.left}px)`, width: hover.width, opacity: hover.visible ? 1 : 0 }}
          />
          <li
            className="nav-indicator"
            aria-hidden="true"
            style={{ transform: `translateX(${indicator.left}px)`, width: indicator.width, opacity: indicator.visible ? 1 : 0 }}
          />
          {navLinks.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                className={active === link.id ? 'is-active' : ''}
                aria-current={active === link.id ? 'location' : undefined}
                onMouseEnter={(e) => hoverTo(e.currentTarget)}
                onFocus={(e) => hoverTo(e.currentTarget)}
                onBlur={clearHover}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="menu-btn"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          <span className="menu-current" aria-hidden="true">
            {open ? 'Close' : activeLabel}
          </span>
          {open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
        </button>

        <a href="#contact" className="nav-cta" data-magnetic data-umami-event="Contact Click" data-umami-event-location="nav">
          Let’s talk <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </nav>

      <div id="mobile-menu" className={`mobile-menu ${open ? 'is-open' : ''}`}>
        <ul>
          {navLinks.map((link, i) => (
            <li key={link.id} style={{ transitionDelay: open ? `${40 + i * 35}ms` : '0ms' }}>
              <a
                href={`#${link.id}`}
                tabIndex={open ? 0 : -1}
                onClick={() => setOpen(false)}
                className={active === link.id ? 'is-active' : ''}
              >
                <span className="mobile-index" aria-hidden="true">
                  0{i + 1}
                </span>
                {link.label}
                <ArrowRight size={22} className="mobile-arrow" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
