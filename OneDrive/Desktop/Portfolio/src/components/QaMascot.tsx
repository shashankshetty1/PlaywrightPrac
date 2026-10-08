import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { track } from '../lib/analytics';

/**
 * A small QA bot that strolls along the bottom edge of the page like a desktop companion.
 * It walks to a random spot, then does one "testing" action — typing on a laptop while checks
 * pop out, inspecting a bug with a magnifier, blinking, or a little celebration hop — and repeats.
 *
 * Motion is driven by a tiny state machine: position is written straight to the DOM each frame
 * (no React re-render), while the current pose is a CSS class. All pose animation lives in CSS.
 */

type Mode = 'walk' | 'test' | 'inspect' | 'idle' | 'celebrate';
type Action = Exclude<Mode, 'walk'>;

interface Step {
  at: number;
  bubble: string | null;
}

// Timeline for each action: when to show which speech bubble, and when the action ends.
const ACTIONS: Record<Action, { duration: number; steps: Step[] }> = {
  test: {
    duration: 5200,
    steps: [
      { at: 300, bubble: 'running tests…' },
      { at: 3400, bubble: '✓ all green' },
      { at: 4900, bubble: null },
    ],
  },
  inspect: {
    duration: 4200,
    steps: [
      { at: 300, bubble: 'hmm, a bug?' },
      { at: 2300, bubble: 'logged in Jira ✓' },
      { at: 3900, bubble: null },
    ],
  },
  idle: { duration: 2600, steps: [] },
  celebrate: {
    duration: 2200,
    steps: [
      { at: 100, bubble: 'build passed!' },
      { at: 1900, bubble: null },
    ],
  },
};

const WEIGHTS: [Action, number][] = [
  ['test', 4],
  ['inspect', 3],
  ['idle', 2],
  ['celebrate', 1.5],
];

const GREETINGS = ['hi! I’m the QA bot', 'every check, automated', 'found a bug? I’ll log it'];

/** Rendered width of the bot; smaller on phones. */
const botSize = () => (window.innerWidth < 640 ? 64 : 84);

function pickAction(previous: Action | null): Action {
  const pool = WEIGHTS.filter(([a]) => a !== previous);
  let r = Math.random() * pool.reduce((s, [, w]) => s + w, 0);
  for (const [action, weight] of pool) {
    if ((r -= weight) <= 0) return action;
  }
  return pool[0][0];
}

export function QaMascot() {
  const rootRef = useRef<HTMLDivElement>(null);
  // Starts idle (off-screen on the right) and strolls in shortly after load.
  const [mode, setMode] = useState<Mode>('idle');
  const [bubble, setBubble] = useState<string | null>(null);
  const [facing, setFacing] = useState<1 | -1>(-1);
  const [reduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  // Mutable animation state kept out of React to avoid per-frame renders.
  const sim = useRef({ x: 0, target: 0, lastAction: null as Action | null, hovered: false, greet: 0 });
  const timers = useRef<number[]>([]);
  const startWalkRef = useRef<() => void>(() => {});

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);
  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);

  const place = useCallback((x: number) => {
    const el = rootRef.current;
    if (!el) return;
    el.style.setProperty('--x', `${x.toFixed(1)}px`);
    // Which half of the screen we're on decides which way the speech bubble opens.
    el.dataset.side = x + botSize() / 2 < window.innerWidth / 2 ? 'l' : 'r';
  }, []);

  const runAction = useCallback((action: Action) => {
    sim.current.lastAction = action;
    setMode(action);
    const { duration, steps } = ACTIONS[action];
    steps.forEach((s) => later(() => setBubble(s.bubble), s.at));
    later(() => startWalkRef.current(), duration);
  }, [later]);

  const startWalk = useCallback(() => {
    const vw = window.innerWidth;
    const w = botSize();
    const margin = 16;
    const s = sim.current;
    const min = margin;
    const max = Math.max(min, vw - w - margin);
    // Short strolls (≈3–9s) read as purposeful; crossing the whole screen would feel aimless.
    const distance = 140 + Math.random() * 240;
    let target: number;
    if (s.x > max) {
      // Entering from off-screen: stop not far past the right edge.
      target = max - Math.random() * 180;
    } else {
      // Head whichever way has room, preferring a random direction.
      const roomLeft = s.x - min;
      const roomRight = max - s.x;
      const goLeft = roomLeft > distance && roomRight > distance ? Math.random() < 0.5 : roomLeft > roomRight;
      target = goLeft ? s.x - Math.min(distance, roomLeft) : s.x + Math.min(distance, roomRight);
    }
    target = Math.max(min, Math.min(max, target));
    s.target = target;
    setFacing(target < s.x ? -1 : 1);
    setBubble(null);
    setMode('walk');
  }, []);
  useEffect(() => {
    startWalkRef.current = startWalk;
  }, [startWalk]);

  // Walking loop — only runs while in walk mode.
  useEffect(() => {
    if (mode !== 'walk' || reduced) return;
    let frame = 0;
    let last = performance.now();
    const speed = window.innerWidth < 640 ? 30 : 42; // px per second
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const s = sim.current;
      if (!s.hovered) {
        const dir = Math.sign(s.target - s.x);
        s.x += dir * speed * dt;
        if (Math.sign(s.target - s.x) !== dir || dir === 0) {
          s.x = s.target;
          place(s.x);
          runAction(pickAction(s.lastAction));
          return;
        }
        place(s.x);
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [mode, reduced, place, runAction]);

  // Entrance: start just off the right edge and stroll in after the page has settled.
  useEffect(() => {
    const s = sim.current;
    if (reduced) {
      s.x = window.innerWidth - botSize() - 16;
      place(s.x);
      return clearTimers;
    }
    s.x = window.innerWidth + 20;
    place(s.x);
    later(() => startWalkRef.current(), 1800);
    return clearTimers;
  }, [reduced, place, later, clearTimers]);

  // Keep it on-screen when the viewport shrinks.
  useEffect(() => {
    const onResize = () => {
      const s = sim.current;
      const max = window.innerWidth - botSize() - 16;
      if (s.x > max) {
        s.x = Math.max(16, max);
        s.target = Math.min(s.target, s.x);
        place(s.x);
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [place]);

  // Eyes follow the pointer on devices with a mouse.
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const el = rootRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const dx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / 320));
        const dy = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 3)) / 320));
        el.style.setProperty('--look-x', dx.toFixed(2));
        el.style.setProperty('--look-y', dy.toFixed(2));
      });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  const onClick = () => {
    const s = sim.current;
    const line = GREETINGS[s.greet++ % GREETINGS.length];
    track('Mascot Click');
    if (reduced) {
      setBubble(line);
      clearTimers();
      later(() => setBubble(null), 2400);
      return;
    }
    clearTimers();
    setMode('celebrate');
    setBubble(line);
    later(() => setBubble(null), 2000);
    later(() => startWalkRef.current(), 2300);
  };

  return (
    <div
      ref={rootRef}
      className={`mascot is-${mode} ${reduced ? 'is-static' : ''}`}
      style={{ '--facing': facing } as CSSProperties}
      onPointerEnter={() => (sim.current.hovered = true)}
      onPointerLeave={() => (sim.current.hovered = false)}
    >
      {bubble && (
        <span key={bubble} className="mascot-bubble" aria-hidden="true">
          {bubble}
        </span>
      )}
      <button type="button" className="mascot-btn" onClick={onClick} aria-label="QA bot mascot — say hi">
        <MascotSvg />
      </button>
    </div>
  );
}

/** The bot itself. Parts are grouped so CSS can animate each pose independently. */
function MascotSvg() {
  return (
    <svg className="mascot-svg" viewBox="0 0 100 96" aria-hidden="true">
      <ellipse cx="50" cy="90" rx="19" ry="3.2" className="m-shadow" />

      {/* Bug the bot inspects (inspect mode) — gets "logged" and turns into a check. */}
      <g className="m-bug">
        <ellipse cx="86" cy="86" rx="4.2" ry="3" className="m-bug-body" />
        <circle cx="89.6" cy="85.2" r="1.6" className="m-bug-body" />
        <path d="M83 84l-2-2M86 83.5V81M85 88.5l-2 1.5M88 88.5l1 2" className="m-bug-legs" />
      </g>
      <g className="m-bug-fixed">
        <circle cx="86" cy="85" r="4.5" className="m-ok" />
        <path d="M84 85l1.5 1.5 3-3" className="m-ok-tick" />
      </g>

      <g className="m-legs">
        <rect x="40" y="72" width="7" height="14" rx="3.5" className="m-leg m-leg-l" />
        <rect x="53" y="72" width="7" height="14" rx="3.5" className="m-leg m-leg-r" />
      </g>

      <g className="m-bot">
        {/* body */}
        <rect x="33" y="46" width="34" height="30" rx="12" className="m-ink" />
        <rect x="42" y="60" width="16" height="6" rx="3" className="m-panel" />
        <rect x="44" y="62" width="7" height="2" rx="1" className="m-panel-led" />

        {/* arms */}
        <path d="M35 54 Q27 60 27 67" className="m-arm m-arm-l" />
        <path d="M65 54 Q73 60 73 67" className="m-arm m-arm-r" />

        {/* magnifier, held in the right hand while inspecting */}
        <g className="m-magnifier">
          <path d="M77 70 L82 76" className="m-handle" />
          <circle cx="75" cy="67" r="5.5" className="m-lens" />
        </g>

        {/* head */}
        <g className="m-head">
          <line x1="50" y1="15" x2="50" y2="7" className="m-antenna" />
          <circle cx="50" cy="6" r="3.4" className="m-bulb" />
          <rect x="25" y="14" width="50" height="35" rx="15" className="m-ink" />
          <rect x="31" y="20" width="38" height="23" rx="10" className="m-visor" />
          <g className="m-eyes">
            <rect x="39" y="26.5" width="6" height="9" rx="3" className="m-eye" />
            <rect x="55" y="26.5" width="6" height="9" rx="3" className="m-eye" />
          </g>
          <circle cx="35.5" cy="38" r="2.4" className="m-cheek" />
          <circle cx="64.5" cy="38" r="2.4" className="m-cheek" />
        </g>
      </g>

      {/* laptop (test mode) — we see the lid from behind, with a check logo */}
      <g className="m-laptop">
        <rect x="27" y="55" width="46" height="24" rx="3.5" className="m-lid" />
        <path d="M45 67l3.5 3.5 7-7.5" className="m-lid-logo" />
        <rect x="23" y="79" width="54" height="4" rx="2" className="m-deck" />
      </g>

      {/* checks that pop out of the laptop while tests run */}
      {[0, 1, 2].map((i) => (
        <g key={i} className={`m-pop m-pop-${i}`}>
          <circle cx="72" cy="56" r="4" className="m-ok" />
          <path d="M70.2 56l1.3 1.3 2.6-2.7" className="m-ok-tick" />
        </g>
      ))}

      {/* celebration sparkles */}
      <g className="m-sparkles">
        <path d="M18 24l1.4 3.6L23 29l-3.6 1.4L18 34l-1.4-3.6L13 29l3.6-1.4z" className="m-spark m-spark-a" />
        <path d="M82 14l1 2.6 2.6 1-2.6 1-1 2.6-1-2.6-2.6-1 2.6-1z" className="m-spark m-spark-b" />
        <path d="M86 40l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" className="m-spark m-spark-c" />
      </g>
    </svg>
  );
}
