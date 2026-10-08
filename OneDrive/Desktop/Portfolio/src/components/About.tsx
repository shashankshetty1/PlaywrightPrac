import { focusAreas, profile } from '../data/profile';
import { Reveal } from './Reveal';
import { SectionHeading } from './SectionHeading';
import { TechLogo } from './TechLogo';

export function About() {
  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <div className="container split">
        <SectionHeading id="about" index="01" label="About" title="Quality, automated." />

        <div className="split-body">
          <Reveal className="about-copy">
            {profile.about.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </Reveal>

          <ul className="focus-grid" aria-label="Current focus">
            {focusAreas.map((area, i) => (
              <Reveal as="li" key={area.title} className="focus-card" delay={100 + i * 60}>
                <TechLogo logo={area.logo} className="tech-bare" />
                <span className="focus-title">{area.title}</span>
                <span className="focus-detail">{area.detail}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
