import { Reveal } from './Reveal';

interface Props {
  id: string;
  index: string;
  label: string;
  title: string;
}

export function SectionHeading({ id, index, label, title }: Props) {
  return (
    <Reveal className="section-heading">
      <p className="section-label">
        <span className="section-index">{index}</span>
        <span className="section-rule" aria-hidden="true" />
        {label}
      </p>
      <h2 id={`${id}-title`}>{title}</h2>
    </Reveal>
  );
}
