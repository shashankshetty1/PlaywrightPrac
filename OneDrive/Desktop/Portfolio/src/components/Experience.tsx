import { useEffect, useRef } from 'react';
import { experiences } from '../data/profile';
import { Reveal } from './Reveal';
import { SectionHeading } from './SectionHeading';

export function Experience() {
  const timelineRef = useRef<HTMLOListElement>(null);

  // Fill the timeline rail as the user scrolls through it.
  useEffect(() => {
    const el = timelineRef.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const anchor = window.innerHeight * 0.6;
      const progress = Math.min(1, Math.max(0, (anchor - rect.top) / rect.height));
      el.style.setProperty('--fill', progress.toFixed(3));
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <section id="experience" className="section" aria-labelledby="experience-title">
      <div className="container split">
        <SectionHeading id="experience" index="03" label="Experience" title="Where I’ve worked." />

        <ol ref={timelineRef} className="split-body timeline">
          {experiences.map((job, i) => (
            <Reveal as="li" key={`${job.company}-${job.start}`} className="timeline-item" delay={i * 80}>
              <span className={`timeline-dot ${job.current ? 'is-current' : ''}`} aria-hidden="true" />
              <p className="timeline-date">
                <time>{job.start}</time> — <time>{job.end}</time>
                {job.current && <span className="badge-live">Current</span>}
              </p>
              <h3>{job.role}</h3>
              <p className="timeline-company">
                {job.company} <span aria-hidden="true">·</span> <span className="timeline-location">{job.location}</span>
              </p>
              <ul className="bullet-list">
                {job.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
