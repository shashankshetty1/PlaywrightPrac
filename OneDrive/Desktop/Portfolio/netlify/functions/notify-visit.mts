// Netlify function → POST /api/notify-visit (same URL as on Vercel, so the frontend doesn't change).
// Configure RESEND_API_KEY, NOTIFY_EMAIL_TO etc. in Netlify → Site configuration → Environment variables.
import { handleNotifyVisit } from '../../server/notify-visit.js';

interface NetlifyContext {
  geo?: { country?: { code?: string } };
}

export default async (request: Request, context: NetlifyContext) =>
  handleNotifyVisit(request, { country: context.geo?.country?.code });

export const config = { path: '/api/notify-visit' };
