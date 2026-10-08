/**
 * Privacy-friendly analytics (Umami) + an optional "someone visited" email ping.
 *
 * - Nothing loads unless VITE_UMAMI_WEBSITE_ID is set, and only in production builds.
 * - Umami is cookieless; we also honour Do Not Track and skip automated browsers (e.g. CI tests).
 * - Visit your site once with `?notrack` to exclude your own browser from both; `?track` undoes it.
 *
 * Declarative click events use Umami's `data-umami-event` attributes (see components);
 * `track()` is for events that aren't plain link clicks.
 */

type EventData = Record<string, string | number | boolean>;

declare global {
  interface Window {
    umami?: { track: (event: string, data?: EventData) => void };
  }
}

const env = import.meta.env;
const WEBSITE_ID = env.VITE_UMAMI_WEBSITE_ID?.trim();
const SCRIPT_URL = env.VITE_UMAMI_SCRIPT_URL?.trim() || 'https://cloud.umami.is/script.js';
const DOMAINS = env.VITE_UMAMI_DOMAINS?.trim();
const NOTIFY_ENABLED = env.VITE_VISIT_NOTIFY === 'true';
const NOTIFY_ENDPOINT = env.VITE_VISIT_NOTIFY_ENDPOINT?.trim() || '/api/notify-visit';

const OPT_OUT_KEY = 'umami.disabled'; // Umami's own opt-out flag, reused for the email ping.
const NOTIFIED_KEY = 'visit-notified-at';
const NOTIFY_INTERVAL_MS = 24 * 60 * 60 * 1000;

const storage = {
  get(key: string) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string) {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* storage blocked — fine, we just can't remember */
    }
  },
  remove(key: string) {
    try {
      localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  },
};

/** `?notrack` / `?track` toggles tracking for this browser, then cleans the URL. */
function applyOptOutParam() {
  const url = new URL(window.location.href);
  if (url.searchParams.has('notrack')) storage.set(OPT_OUT_KEY, '1');
  else if (url.searchParams.has('track')) storage.remove(OPT_OUT_KEY);
  else return;
  url.searchParams.delete('notrack');
  url.searchParams.delete('track');
  window.history.replaceState(null, '', url.pathname + url.search + url.hash);
}

function isTrackingAllowed() {
  const dnt = navigator.doNotTrack === '1' || (window as { doNotTrack?: string }).doNotTrack === '1';
  return env.PROD && !dnt && !navigator.webdriver && storage.get(OPT_OUT_KEY) !== '1';
}

// Events fired before the Umami script finishes loading are queued, then flushed.
const queue: [string, EventData | undefined][] = [];

export function track(event: string, data?: EventData) {
  if (window.umami) window.umami.track(event, data);
  else if (WEBSITE_ID && isTrackingAllowed()) queue.push([event, data]);
}

function loadUmami() {
  if (!WEBSITE_ID || document.querySelector('script[data-website-id]')) return;
  const script = document.createElement('script');
  script.defer = true;
  script.src = SCRIPT_URL;
  script.dataset.websiteId = WEBSITE_ID;
  script.dataset.doNotTrack = 'true';
  // Restrict counting to your real domain(s) so preview deployments don't skew stats.
  if (DOMAINS) script.dataset.domains = DOMAINS;
  script.addEventListener('load', () => {
    queue.splice(0).forEach(([event, data]) => window.umami?.track(event, data));
  });
  document.head.appendChild(script);
}

/** Sends one anonymous "visit" ping per browser per day, after the page has been open a few seconds. */
function scheduleVisitNotification() {
  if (!NOTIFY_ENABLED) return;
  const last = Number(storage.get(NOTIFIED_KEY) ?? 0);
  if (Date.now() - last < NOTIFY_INTERVAL_MS) return;

  // Waiting filters out instant bounces and most link-preview bots.
  window.setTimeout(() => {
    if (document.visibilityState !== 'visible') return;
    storage.set(NOTIFIED_KEY, String(Date.now()));
    let referrer = '';
    try {
      referrer = document.referrer ? new URL(document.referrer).hostname : '';
    } catch {
      /* malformed referrer */
    }
    const width = window.innerWidth;
    fetch(NOTIFY_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        path: window.location.pathname,
        referrer,
        device: width < 640 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop',
        language: navigator.language,
      }),
    }).catch(() => {
      /* notifications are best-effort */
    });
  }, 5000);
}

/** Reports each main section once per visit — shows how far visitors actually scroll. */
export function trackSectionViews(ids: readonly string[]) {
  if (!WEBSITE_ID || !isTrackingAllowed()) return () => {};
  const seen = new Set<string>();
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const id = entry.target.id;
        if (entry.isIntersecting && !seen.has(id)) {
          seen.add(id);
          track('Section View', { section: id });
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.35 },
  );
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
  return () => observer.disconnect();
}

export function initAnalytics() {
  applyOptOutParam();
  if (!isTrackingAllowed()) return;
  loadUmami();
  scheduleVisitNotification();
}
