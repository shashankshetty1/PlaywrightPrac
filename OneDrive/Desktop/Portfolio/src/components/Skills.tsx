import { skillGroups } from '../data/profile';
import { Reveal } from './Reveal';
import { SectionHeading } from './SectionHeading';
import { TechLogo } from './TechLogo';

export function Skills() {
  return (
    <section id="skills" className="section" aria-labelledby="skills-title">
      <div className="container split">
        <SectionHeading id="skills" index="02" label="Skills" title="The toolkit I test and build with." />

        <ul className="split-body skill-rows">
          {skillGroups.map((group, i) => (
            <Reveal as="li" key={group.id} className="skill-row" delay={i * 50}>
              <h3 className="skill-row-title">{group.title}</h3>
              <ul className="skill-items" aria-label={`${group.title} skills`}>
                {group.skills.map((skill) => (
                  <li key={skill.name}>
                    {skill.logo ? <TechLogo logo={skill.logo} label={skill.name} /> : <span className="tag">{skill.name}</span>}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
