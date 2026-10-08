// Vercel serverless function → POST /api/notify-visit
// Configure RESEND_API_KEY, NOTIFY_EMAIL_TO etc. in Vercel → Project → Settings → Environment Variables.
import { handleNotifyVisit } from '../server/notify-visit.js';

export function POST(request: Request) {
  return handleNotifyVisit(request);
}
