import type { MouseEvent } from 'react';
import { ArrowUpRight, Check } from 'lucide-react';
import { projects } from '../data/profile';
import { Icon } from './Icon';
import { Reveal } from './Reveal';
import { SectionHeading } from './SectionHeading';
import { TechLogo } from './TechLogo';

/** Feeds cursor position to CSS for the soft spotlight hover effect. */
function trackPointer(e: MouseEvent<HTMLElement>) {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`);
}

export function Projects() {
  return (
    <section id="projects" className="section" aria-labelledby="projects-title">
      <div className="container">
        <SectionHeading id="projects" index="04" label="Projects" title="Selected work." />

        <div className="projects">
          {projects.map((project, i) => (
            <Reveal key={project.name} delay={i * 100} className="project-wrap">
              <article className="project-card" onMouseMove={trackPointer} aria-labelledby={`project-${i}`}>
                <div className="project-top">
                  <span className="icon-tile">
                    <Icon name={project.icon} size={20} />
                  </span>
                  <span className="project-meta">
                    {project.kind} <span aria-hidden="true">·</span> {project.date}
                  </span>
                </div>

                <h3 id={`project-${i}`}>{project.name}</h3>
                <p className="project-tagline">{project.tagline}</p>

                <ul className="check-list">
                  {project.highlights.map((h) => (
                    <li key={h}>
                      <Check size={16} strokeWidth={2.25} aria-hidden="true" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>

                <div className="project-foot">
                  <ul className="chip-list" aria-label="Tech stack">
                    {project.stack.map((s) => (
                      <li key={s.name}>
                        {s.logo ? <TechLogo logo={s.logo} label={s.name} size="sm" /> : <span className="tag tag-sm">{s.name}</span>}
                      </li>
                    ))}
                  </ul>
                  {project.links?.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-link"
                      data-umami-event={link.href.includes('github.com') ? 'GitHub Click' : 'Project Link'}
                      data-umami-event-location="project"
                      data-umami-event-project={project.name}
                    >
                      {link.label} <ArrowUpRight size={16} aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
