import { BadgeCheck, Bot, ClipboardCheck, Coffee, Network, type LucideProps } from 'lucide-react';
import type { ComponentType } from 'react';
import type { IconName } from '../data/profile';

const icons: Record<IconName, ComponentType<LucideProps>> = {
  automation: Bot,
  api: Network,
  qa: ClipboardCheck,
  java: Coffee,
  project: BadgeCheck,
};

export function Icon({ name, ...props }: { name: IconName } & LucideProps) {
  const Component = icons[name];
  return <Component aria-hidden="true" strokeWidth={1.75} {...props} />;
}
