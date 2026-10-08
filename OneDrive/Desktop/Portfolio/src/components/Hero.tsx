import type { CSSProperties } from 'react';
import { ArrowRight, Download, MapPin } from 'lucide-react';
import { profile } from '../data/profile';
import { GitHubIcon, LinkedInIcon } from './BrandIcons';
import { CountUp } from './CountUp';
import { HeroPhoto } from './HeroPhoto';

/** Index for the staggered entrance animation. */
const step = (i: number) => ({ '--i': i }) as CSSProperties;

export function Hero() {
  return (
    <section id="top" className="hero" aria-labelledby="hero-title">
      <div className="container hero-inner">
        <div className="hero-copy">
          <p className="hero-kicker hero-step" style={step(0)}>
            <span className="section-rule" aria-hidden="true" />
            {profile.title}
          </p>

          <h1 id="hero-title" className="hero-title hero-step" style={step(1)}>
            Shashank
            <br />
            Shetty<span className="hero-title-dot">.</span>
          </h1>

          <p className="hero-intro hero-step" style={step(2)}>
            {profile.intro}
          </p>

          <div className="hero-ctas hero-step" style={step(3)}>
            <a href="#projects" className="btn btn-primary" data-magnetic data-umami-event="Projects Click" data-umami-event-location="hero">
              View projects <ArrowRight size={18} aria-hidden="true" className="btn-arrow" />
            </a>
            <a href="#contact" className="btn btn-secondary" data-magnetic data-umami-event="Contact Click" data-umami-event-location="hero">
              Contact me
            </a>
            {profile.resumeUrl && (
              <a href={profile.resumeUrl} className="btn btn-secondary" download data-umami-event="Resume Download" data-umami-event-location="hero">
                <Download size={18} aria-hidden="true" /> Resume
              </a>
            )}
          </div>

          <div className="hero-meta hero-step" style={step(4)}>
            <a href={profile.github} target="_blank" rel="noreferrer" className="icon-link" data-magnetic aria-label="GitHub" data-umami-event="GitHub Click" data-umami-event-location="hero">
              <GitHubIcon size={18} />
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="icon-link" data-magnetic aria-label="LinkedIn" data-umami-event="LinkedIn Click" data-umami-event-location="hero">
              <LinkedInIcon size={18} />
            </a>
            <span className="hero-meta-divider" aria-hidden="true" />
            <span className="hero-location">
              <MapPin size={15} aria-hidden="true" /> {profile.location}
            </span>
          </div>
        </div>

        <HeroPhoto />
      </div>

      <div className="container">
        <dl className="hero-stats hero-step" style={step(5)}>
          {profile.stats.map((s) => (
            <div key={s.label} className="hero-stat">
              <dt>{s.label}</dt>
              <dd>
                <CountUp value={s.value} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
