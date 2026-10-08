import { useEffect, useState } from 'react';
import { ArrowUpRight, Check, Copy } from 'lucide-react';
import { profile } from '../data/profile';
import { track } from '../lib/analytics';
import { GitHubIcon, LinkedInIcon } from './BrandIcons';
import { Reveal } from './Reveal';

export function Contact() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      track('Email Copy');
    } catch {
      // Clipboard can be blocked (non-secure context); fall back to the mail client.
      window.location.href = `mailto:${profile.email}`;
    }
  };

  const channels = [
    { label: 'LinkedIn', event: 'LinkedIn Click', value: profile.linkedinHandle, href: profile.linkedin, icon: <LinkedInIcon size={18} /> },
    { label: 'GitHub', event: 'GitHub Click', value: profile.githubHandle, href: profile.github, icon: <GitHubIcon size={18} /> },
  ];

  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <div className="container">
        <Reveal className="contact-panel">
          <p className="section-label">
            <span className="section-index">06</span>
            <span className="section-rule" aria-hidden="true" />
            Contact
          </p>
          <h2 id="contact-title">
            Let’s build software <br className="br-desktop" />
            that <em>works</em>.
          </h2>
          <p className="contact-lead">Open to Software Engineer and SDET roles. Email is the quickest way to reach me.</p>

          <div className="contact-email">
            <a href={`mailto:${profile.email}`} className="email-link" data-umami-event="Contact Click" data-umami-event-location="email">
              {profile.email}
              <ArrowUpRight size={22} aria-hidden="true" />
            </a>
            <button type="button" className="copy-btn" data-magnetic onClick={copyEmail} aria-label="Copy email address">
              {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <span className="sr-only" role="status" aria-live="polite">
              {copied ? 'Email address copied to clipboard' : ''}
            </span>
          </div>

          <ul className="contact-channels">
            {channels.map((c) => (
              <li key={c.label}>
                <a href={c.href} target="_blank" rel="noreferrer" className="channel" data-magnetic data-umami-event={c.event} data-umami-event-location="contact">
                  {c.icon}
                  <span className="channel-label">{c.label}</span>
                  <span className="channel-value">{c.value}</span>
                  <ArrowUpRight size={16} aria-hidden="true" className="channel-arrow" />
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
