import { GraduationCap } from 'lucide-react';
import { certifications, education } from '../data/profile';
import { Icon } from './Icon';
import { Reveal } from './Reveal';
import { SectionHeading } from './SectionHeading';

export function Credentials() {
  return (
    <section id="credentials" className="section" aria-labelledby="credentials-title">
      <div className="container split">
        <SectionHeading id="credentials" index="05" label="Credentials" title="Education & certifications." />

        <div className="split-body">
          <Reveal className="edu-card">
            <span className="icon-tile">
              <GraduationCap size={20} strokeWidth={1.75} aria-hidden="true" />
            </span>
            <div className="edu-body">
              <h3>{education.degree}</h3>
              <p className="edu-school">{education.school}</p>
            </div>
            <div className="edu-facts">
              <span>
                {education.start} — {education.end}
              </span>
              <span className="edu-grade">{education.grade}</span>
            </div>
          </Reveal>

          <ul className="cert-grid" aria-label="Certifications">
            {certifications.map((cert, i) => (
              <Reveal as="li" key={cert.name} className="cert-card" delay={80 + i * 50}>
                <Icon name={cert.icon} size={18} />
                <div>
                  <p className="cert-name">{cert.name}</p>
                  <p className="cert-issuer">
                    {cert.issuer}
                    {cert.date && <> · {cert.date}</>}
                  </p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
