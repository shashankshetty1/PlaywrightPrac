import type { CSSProperties } from 'react';
import { logos, type LogoName } from '../data/logos';

interface Props {
  logo: LogoName;
  /** Rendered next to the logo; omit for a logo-only mark. */
  label?: string;
  size?: 'sm' | 'md';
  className?: string;
}

/** Official logo on a soft tint of its own brand colour. */
export function TechLogo({ logo, label, size = 'md', className = '' }: Props) {
  const { src, color } = logos[logo];
  return (
    <span className={`tech tech-${size} ${className}`.trim()} style={{ '--brand': color } as CSSProperties}>
      <span className="tech-mark">
        <img src={src} alt="" width={20} height={20} loading="lazy" decoding="async" />
      </span>
      {label && <span className="tech-label">{label}</span>}
    </span>
  );
}
