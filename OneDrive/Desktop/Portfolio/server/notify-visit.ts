/**
 * Server-side "new visitor" email notification, sent through Resend (free tier: 3,000 emails/month).
 * Runs as a serverless function — see api/notify-visit.ts (Vercel) and
 * netlify/functions/notify-visit.mts (Netlify). The Resend API key never reaches the browser.
 *
 * Privacy: only coarse, non-identifying details are emailed (page, referrer domain, device class,
 * browser/OS family, language, country). No IP address is read, stored or sent.
 *
 * Abuse protection (the endpoint is necessarily public):
 * - POST + JSON only, tiny body limit, strict field sanitising, HTML-escaped email content
 * - optional Origin allow-list (NOTIFY_ALLOWED_ORIGINS)
 * - bot/crawler user agents ignored
 * - per-instance cooldown and daily cap (best effort — serverless instances don't share memory),
 *   with Resend's own daily quota as the hard backstop
 */

interface VisitContext {
  /** ISO country code when the host provides geolocation (Netlify passes it in explicitly). */
  country?: string;
}

const BOT_UA = /bot|crawl|spider|slurp|headless|lighthouse|preview|facebookexternalhit|embedly|monitor/i;
const MAX_BODY = 2048;

// Best-effort rate limiting, shared by requests hitting the same warm instance.
const limiter = { lastSent: 0, day: '', sentToday: 0 };

const json = (status: number, body?: unknown) =>
  new Response(body === undefined ? null : JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

const clip = (value: unknown, max: number) => (typeof value === 'string' ? value.trim().slice(0, max) : '');

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] ?? c);

function describeAgent(ua: string) {
  const browser = /Edg\//.test(ua)
    ? 'Edge'
    : /OPR\//.test(ua)
      ? 'Opera'
      : /Firefox\//.test(ua)
        ? 'Firefox'
        : /Chrome\//.test(ua)
          ? 'Chrome'
          : /Safari\//.test(ua)
            ? 'Safari'
            : 'Other';
  const os = /Windows/.test(ua)
    ? 'Windows'
    : /Android/.test(ua)
      ? 'Android'
      : /iPhone|iPad|iPod/.test(ua)
        ? 'iOS'
        : /Mac OS X/.test(ua)
          ? 'macOS'
          : /Linux/.test(ua)
            ? 'Linux'
            : 'Other';
  return `${browser} on ${os}`;
}

export async function handleNotifyVisit(request: Request, context: VisitContext = {}): Promise<Response> {
  if (request.method !== 'POST') return json(405, { error: 'Method not allowed' });

  const env = process.env;
  const apiKey = env.RESEND_API_KEY;
  const recipients = (env.NOTIFY_EMAIL_TO ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  // Not configured yet: succeed quietly so the site never shows errors.
  if (!apiKey || recipients.length === 0) return json(204);

  const allowedOrigins = (env.NOTIFY_ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((s) => s.trim().replace(/\/$/, ''))
    .filter(Boolean);
  const origin = request.headers.get('origin') ?? '';
  if (allowedOrigins.length > 0 && !allowedOrigins.includes(origin)) return json(403, { error: 'Origin not allowed' });

  const ua = request.headers.get('user-agent') ?? '';
  if (!ua || BOT_UA.test(ua)) return json(204);

  if (!(request.headers.get('content-type') ?? '').includes('application/json')) return json(415, { error: 'JSON only' });
  const raw = await request.text();
  if (raw.length > MAX_BODY) return json(413, { error: 'Payload too large' });

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
  } catch {
    return json(400, { error: 'Invalid JSON' });
  }

  const now = Date.now();
  const cooldownMs = Math.max(0, Number(env.NOTIFY_COOLDOWN_SECONDS ?? 60)) * 1000;
  const dailyLimit = Math.max(1, Number(env.NOTIFY_DAILY_LIMIT ?? 50));
  const today = new Date(now).toISOString().slice(0, 10);
  if (limiter.day !== today) {
    limiter.day = today;
    limiter.sentToday = 0;
  }
  if (now - limiter.lastSent < cooldownMs || limiter.sentToday >= dailyLimit) return json(429, { error: 'Rate limited' });

  const path = clip(body.path, 200).startsWith('/') ? clip(body.path, 200) : '/';
  const referrer = clip(body.referrer, 120).replace(/[^a-z0-9.-]/gi, '') || 'Direct / unknown';
  const device = ['mobile', 'tablet', 'desktop'].includes(String(body.device)) ? String(body.device) : 'unknown';
  const language = clip(body.language, 20).replace(/[^a-z0-9-]/gi, '') || 'unknown';
  const country = (context.country ?? request.headers.get('x-vercel-ip-country') ?? '').replace(/[^A-Z]/gi, '').slice(0, 2).toUpperCase();
  const agent = describeAgent(ua);
  const timeZone = env.NOTIFY_TIMEZONE || 'Asia/Kolkata';
  let when: string;
  try {
    when = new Date(now).toLocaleString('en-GB', { timeZone, dateStyle: 'medium', timeStyle: 'short' });
  } catch {
    when = new Date(now).toUTCString();
  }

  const rows: [string, string][] = [
    ['When', `${when} (${timeZone})`],
    ['Page', path],
    ['Came from', referrer],
    ['Device', `${device} · ${agent}`],
    ['Language', language],
    ...(country ? ([['Country', country]] as [string, string][]) : []),
  ];
  const subject = `New portfolio visit${country ? ` from ${country}` : ''} · ${device}`;
  const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n');
  const html = `<div style="font-family:system-ui,sans-serif;font-size:14px;color:#1d2230">
  <p style="margin:0 0 12px"><strong>Someone is viewing your portfolio.</strong></p>
  <table cellpadding="6" style="border-collapse:collapse">${rows
    .map(
      ([k, v]) =>
        `<tr><td style="color:#6f7582;padding-right:16px">${escapeHtml(k)}</td><td>${escapeHtml(v)}</td></tr>`,
    )
    .join('')}</table>
  <p style="margin:16px 0 0;color:#6f7582;font-size:12px">Full stats are in your Umami dashboard.</p>
</div>`;

  // Reserve the slot before the network call so parallel requests can't slip past the limit.
  limiter.lastSent = now;
  limiter.sentToday += 1;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: env.NOTIFY_EMAIL_FROM || 'Portfolio <onboarding@resend.dev>',
      to: recipients,
      subject,
      text,
      html,
    }),
  });

  if (!res.ok) {
    // Log status only — never the key or the response body, which may echo request details.
    console.error(`notify-visit: Resend responded ${res.status}`);
    return json(502, { error: 'Email provider error' });
  }
  return json(204);
}
