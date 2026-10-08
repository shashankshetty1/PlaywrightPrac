# Shashank Shetty — Portfolio

Personal portfolio for a Software Engineer / SDET, built with **React 19 + Vite + TypeScript**.

```bash
npm install
npm run dev        # local dev server
npm run build      # type-check + production build → dist/
npm run preview    # serve the production build locally
npm run lint
```

| Path | What it is |
| --- | --- |
| `src/data/profile.ts` | **All site content** (bio, skills, experience, projects…). Edit this, not the components. |
| `src/lib/analytics.ts` | Umami loader, custom events, and the visit-notification ping |
| `server/notify-visit.ts` | Email-notification logic (runs server-side only) |
| `api/notify-visit.ts` | Vercel serverless wrapper → `POST /api/notify-visit` |
| `netlify/functions/notify-visit.mts` | Netlify wrapper → same URL |
| `.env.example` | Every configurable variable, documented |
| `resume/ShashankShetty_Resume.tex` | LaTeX source of the resume (moved here from the old `readme.md`) |

---

## Analytics & visit notifications — setup

Both features are **off until you configure them**. The site builds and runs normally without any of this.

### How it fits together

```
Browser ──(cookieless pageviews + events)──▶ Umami Cloud        (dashboard: visitors, referrers, devices, pages, events)
Browser ──POST /api/notify-visit (no secrets)──▶ Serverless fn ──(RESEND_API_KEY)──▶ Resend ──▶ your inbox
```

- **Public** settings start with `VITE_` and are baked into the JavaScript bundle. They are *identifiers*, not secrets.
- **Secret** settings (the Resend API key) have **no** `VITE_` prefix, so Vite never exposes them. They exist only as environment variables on your host.
- **Never** put a real key in a `VITE_*` variable, and never commit `.env` files. They're already git-ignored.

### Step 1 — Umami analytics (free)

1. Create a free account at **https://cloud.umami.is**. The Hobby plan is free: 100k events/month, 3 websites. You can also [self-host Umami](https://umami.is/docs/install) for free.
2. **Settings → Websites → Add website.** Enter your domain, e.g. `shashankshetty.dev`.
3. Open the website → **Edit** → copy the **Website ID** (a UUID like `4f1c…-…`).
4. Add it where your site is built:
   - **Vercel:** Project → Settings → **Environment Variables** → `VITE_UMAMI_WEBSITE_ID` = the UUID (Production).
   - **Netlify:** Site configuration → **Environment variables** → same key/value.
   - **Local production build:** copy `.env.example` to `.env.local` and fill it in.
5. Optional but recommended: set `VITE_UMAMI_DOMAINS=shashankshetty.dev` (your real hostname, comma-separated if several) so preview deployments aren't counted.
6. If you self-host Umami, set `VITE_UMAMI_SCRIPT_URL=https://<your-umami-host>/script.js`.
7. **Redeploy.** `VITE_*` values are read at build time, so changing them needs a new build.

**What you'll see in Umami:** page views, unique visitors, referrers, browsers, OS, devices, countries, and these custom events:

| Event | Fired when | Extra data |
| --- | --- | --- |
| `Resume Download` | Resume button clicked (appears once `resumeUrl` is set in `profile.ts`) | `location` |
| `GitHub Click` | Any GitHub link (hero, contact, project cards) | `location`, `project` |
| `LinkedIn Click` | Any LinkedIn link | `location` |
| `Contact Click` | "Contact me", "Let's talk", or the email link | `location` (`hero` / `nav` / `email`) |
| `Email Copy` | "Copy" next to the email address | — |
| `Projects Click` | "View projects" in the hero | `location` |
| `Section View` | A section scrolls into view (once per visit) — shows how far people read | `section` |
| `Mascot Click` | Someone clicks the QA bot | — |

**Privacy:** Umami uses no cookies and stores no personal data. The script also honours *Do Not Track*, skips automated browsers (CI/test runners), and only loads in production builds.

**Exclude your own visits:** open your live site once with `?notrack` (e.g. `https://shashankshetty.dev/?notrack`). That browser is then ignored by both Umami and the email alerts. `?track` turns it back on.

### Step 2 — Email notification on visits (free)

Uses **Resend** (free tier: 3,000 emails/month, 100/day) called from a serverless function, so the API key stays on the server.

1. Sign up at **https://resend.com** and create an **API key** (Sending access is enough).
2. In your host's environment variables (Vercel: Settings → Environment Variables; Netlify: Site configuration → Environment variables), add:

   | Variable | Value | Secret? |
   | --- | --- | --- |
   | `RESEND_API_KEY` | `re_…` from Resend | **Yes** — server only |
   | `NOTIFY_EMAIL_TO` | Your email. With the default sender it **must be the address you registered with Resend**. | No |
   | `NOTIFY_ALLOWED_ORIGINS` | Your live URL, e.g. `https://shashankshetty.dev` (no trailing slash) | No |
   | `VITE_VISIT_NOTIFY` | `true` — tells the site to send the ping | No (public) |
   | `NOTIFY_EMAIL_FROM` | *Optional.* Default `Portfolio <onboarding@resend.dev>`. To send from your own domain, verify it in Resend first. | No |
   | `NOTIFY_TIMEZONE` | *Optional.* Default `Asia/Kolkata` | No |
   | `NOTIFY_COOLDOWN_SECONDS` / `NOTIFY_DAILY_LIMIT` | *Optional.* Defaults `60` / `50` | No |

3. **Redeploy**, then open the site in a private window and wait about 5 seconds. You should get an email like:

   > **New portfolio visit from IN · mobile**
   > When: 24 Sept 2026, 14:05 · Page: / · Came from: linkedin.com · Device: mobile · Chrome on Android · Language: en-IN

**How it behaves**
- One email per visitor per day at most. The browser remembers it already pinged.
- Only sent after the page has been open for 5 seconds, which filters out bounces and most link-preview bots.
- Bots, crawlers, *Do Not Track* browsers, `?notrack` browsers and automated test browsers never trigger it.
- **No IP address** is read, stored or emailed. The email contains only page, referrer domain, device class, browser/OS family, language and country.
- The function rejects anything that isn't a small JSON `POST` from an allowed origin, escapes all content, and applies a cooldown plus a daily cap. Resend's own 100/day free limit is the hard ceiling, so the worst case of someone spamming the endpoint is a capped number of emails, never a bill.
- On a busy day, prefer Umami's dashboard, or raise `NOTIFY_COOLDOWN_SECONDS` so you get at most one email every few minutes.

### Deploying

**Vercel (recommended):** import the repo. Vercel auto-detects Vite, and `api/notify-visit.ts` becomes the function automatically. No config file is needed.

**Netlify:** import the repo. `netlify.toml` sets the build, and `netlify/functions/notify-visit.mts` serves `/api/notify-visit`.

**Testing the function locally:** `npm i -g vercel` then `vercel dev`, or `npm i -g netlify-cli` then `netlify dev`. Both run the site and the function together and read a local `.env` file. Plain `npm run dev` doesn't run serverless functions, and analytics stays off in dev mode by design.

---

## Customising

- **Photo:** replace `public/profile.jpg` and update `photo.width/height` in `src/data/profile.ts`.
- **Resume button:** put a PDF in `public/` (a version without your phone number is a good idea) and set `resumeUrl` in `profile.ts`.
- **Tech logos:** `src/assets/logos/` (Devicon, MIT; BigQuery from Simple Icons, CC0), registered in `src/data/logos.ts`.
