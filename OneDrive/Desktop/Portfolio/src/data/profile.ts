import type { LogoName } from './logos';

/**
 * Single source of truth for all portfolio content.
 * Every fact here comes from the resume (ShashankShetty_Resume.pdf / readme.md).
 * Update this file — not the components — when your details change.
 */

export interface Link {
  label: string;
  href: string;
}

/** A skill with an official logo renders as a logo tile; the rest render as plain tags. */
export interface Skill {
  name: string;
  logo?: LogoName;
}

export interface SkillGroup {
  id: string;
  title: string;
  skills: Skill[];
}

export interface FocusArea {
  title: string;
  detail: string;
  logo: LogoName;
}

export interface Experience {
  role: string;
  company: string;
  location: string;
  start: string;
  end: string;
  current?: boolean;
  highlights: string[];
}

export interface Project {
  name: string;
  tagline: string;
  date: string;
  kind: string;
  icon: IconName;
  highlights: string[];
  stack: Skill[];
  links?: Link[];
}

export interface Certification {
  name: string;
  issuer: string;
  icon: IconName;
  date?: string;
}

/** Icon keys resolved to lucide components in components/Icon.tsx. */
export type IconName = 'automation' | 'api' | 'qa' | 'java' | 'project';

export const profile = {
  name: 'Shashank Shetty',
  title: 'Software Engineer · SDET',
  role: 'Junior Software QA Engineer',
  company: 'Vrio Digital Solutions',
  location: 'Bangalore, Karnataka',
  email: 'shettyshashank089@gmail.com',
  github: 'https://github.com/shashankshetty1',
  githubHandle: 'shashankshetty1',
  linkedin: 'https://www.linkedin.com/in/shashank-shetty-49a80b22b/',
  linkedinHandle: 'shashank-shetty',
  /**
   * Optional: drop your resume into /public (e.g. /public/resume.pdf) and set the path here
   * to show a "Resume" button. Left empty so the phone number on the PDF isn't published by default.
   */
  resumeUrl: '',
  /**
   * Profile photo. To swap it, replace /public/profile.jpg (or change `src`) and update the
   * intrinsic width/height — the hero keeps the photo's own aspect ratio, so nothing is cropped.
   */
  photo: {
    src: '/profile.jpg',
    alt: 'Shashank Shetty smiling at his desk with a laptop',
    width: 1374,
    height: 1145,
  },
  intro:
    'QA Engineer transitioning into SDET, specializing in Playwright + TypeScript automation, API testing, and scalable test frameworks that transform manual regression into reliable, CI-ready UI and API pipelines.',
  about: [
    'I’m a QA engineer at Vrio Digital Solutions focused on the SDET side of quality — building test automation in Playwright and TypeScript that covers both the UI and the API layer.',
    'My framework work uses the Page Object Model, custom fixtures and storageState sessions, with REST API testing through Playwright Request Context and Postman. Suites run in GitHub Actions CI/CD with HTML/Allure reports, and alongside automation I run end-to-end test plans in Jira Xray and validate backend data in BigQuery.',
  ],
  stats: [
    { value: '500+', label: 'Test cases executed' },
    { value: '150+', label: 'Defects tracked' },
    { value: '100+', label: 'Chatbot queries validated' },
    { value: '10', label: 'Reusable page objects' },
  ],
} as const;

export const navLinks = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'credentials', label: 'Credentials' },
  { id: 'contact', label: 'Contact' },
] as const;

/** What the About section highlights — the core of the current SDET profile. */
export const focusAreas: FocusArea[] = [
  { title: 'UI automation', detail: 'Playwright · POM · fixtures', logo: 'playwright' },
  { title: 'API testing', detail: 'Request Context · Postman', logo: 'postman' },
  { title: 'TypeScript', detail: 'Typed page objects & fixtures', logo: 'typescript' },
  { title: 'CI/CD', detail: 'GitHub Actions · Allure', logo: 'githubactions' },
];

export const skillGroups: SkillGroup[] = [
  {
    id: 'automation',
    title: 'Test Automation',
    skills: [{ name: 'Playwright', logo: 'playwright' }, { name: 'Page Object Model' }, { name: 'Custom Fixtures' }, { name: 'storageState Auth' }, { name: 'Smoke & Regression Suites' }],
  },
  {
    id: 'api',
    title: 'API Testing',
    skills: [{ name: 'Postman', logo: 'postman' }, { name: 'REST APIs' }, { name: 'Playwright Request Context' }, { name: 'CRUD Validation' }],
  },
  {
    id: 'performance',
    title: 'Performance Testing',
    skills: [{ name: 'k6', logo: 'k6' }],
  },
  {
    id: 'qa',
    title: 'Testing & QA',
    skills: [{ name: 'Jira', logo: 'jira' }, { name: 'Jira Xray' }, { name: 'End-to-End Functional' }, { name: 'Regression' }, { name: 'Manual Testing' }, { name: 'Agile / Scrum' }],
  },
  {
    id: 'languages',
    title: 'Languages',
    skills: [{ name: 'TypeScript', logo: 'typescript' }, { name: 'JavaScript', logo: 'javascript' }, { name: 'Java', logo: 'java' }, { name: 'HTML5', logo: 'html5' }, { name: 'CSS3', logo: 'css3' }, { name: 'SQL' }],
  },
  {
    id: 'tools',
    title: 'Tools',
    skills: [{ name: 'Node.js', logo: 'nodejs' }, { name: 'GitHub', logo: 'github' }, { name: 'VS Code', logo: 'vscode' }, { name: 'HTML / Allure Reports' }],
  },
  {
    id: 'cicd',
    title: 'CI/CD & Data',
    skills: [{ name: 'GitHub Actions', logo: 'githubactions' }, { name: 'Google BigQuery', logo: 'bigquery' }, { name: 'Firebase', logo: 'firebase' }, { name: 'MySQL', logo: 'mysql' }],
  },
];

export const experiences: Experience[] = [
  {
    role: 'Junior Software Quality Assurance Engineer',
    company: 'Vrio Digital Solutions',
    location: 'Bangalore',
    start: 'Aug 2025',
    end: 'Present',
    current: true,
    highlights: [
      'Execute end-to-end functional test plans and track coverage in Xray integrated with Jira across Agile sprints.',
      'Work closely with developers to reproduce, debug and verify defect fixes.',
      'Validate backend datasets in Google BigQuery to confirm data accuracy during test cycles.',
      'Self-initiated a Playwright/TypeScript framework, converting manual regression cases into an automated UI and API suite.',
    ],
  },
  {
    role: 'Full Stack Developer Intern',
    company: 'Besant Technologies',
    location: 'Bangalore',
    start: 'Jan 2025',
    end: 'May 2025',
    highlights: [
      'Built full-stack features and front-end/back-end integrations with Java, JavaScript, HTML, CSS and MySQL.',
      'Collaborated with cross-functional teams on responsive components and user experience.',
    ],
  },
];

export const projects: Project[] = [
  {
    name: 'OrangeHRM Test Automation Framework',
    tagline: 'Scalable Playwright + TypeScript framework for UI and API testing.',
    date: 'Sep 2026',
    kind: 'Automation',
    icon: 'automation',
    highlights: [
      'Page Object Model with 10 reusable page objects across Authentication, Admin, PIM and Dashboard, with smoke and regression suites.',
      'Custom fixtures, storageState session reuse and externalized JSON test data.',
      'REST API tests with Playwright Request Context covering CRUD workflows and dashboard APIs.',
      'GitHub Actions CI/CD with HTML/Allure reporting and automated failure diagnostics.',
    ],
    stack: [
      { name: 'Playwright', logo: 'playwright' },
      { name: 'TypeScript', logo: 'typescript' },
      { name: 'Node.js', logo: 'nodejs' },
      { name: 'GitHub Actions', logo: 'githubactions' },
    ],
    // Replace with the repository URL once it's public.
    links: [{ label: 'GitHub profile', href: 'https://github.com/shashankshetty1' }],
  },
  {
    name: 'SGE – Smart Growth Engine',
    tagline: 'End-to-end QA for Veolia’s global facility-management application.',
    date: 'Jan 2026',
    kind: 'Client QA',
    icon: 'qa',
    highlights: [
      'Tested WWTP/WTP facilities, GeoMap, filters, ownership and workforce data, validated against the facility table.',
      'Created and executed 500+ test cases in Jira Xray across functional, UI, chatbot, database and boundary scenarios.',
      'Validated 100+ chatbot queries for response accuracy and facility-specific information.',
      'Verified backend data with BigQuery SQL and Firebase; tracked 100+ defects through retest and regression.',
    ],
    stack: [{ name: 'Jira Xray' }, { name: 'SQL' }, { name: 'BigQuery', logo: 'bigquery' }, { name: 'Firebase', logo: 'firebase' }],
  },
];

export const certifications: Certification[] = [
  { name: 'Playwright JS/TS Automation', issuer: 'Udemy', icon: 'automation' },
  { name: 'Postman API Automation', issuer: 'Udemy', icon: 'api' },
  { name: 'Java', issuer: 'HackerRank', icon: 'java' },
  { name: 'Project Management', issuer: 'Great Learning', icon: 'project' },
];

export const education = {
  degree: 'B.E. in Computer Science & Engineering',
  school: 'AMC Engineering College',
  start: '2021',
  end: '2025',
  grade: 'CGPA 8.37 / 10',
};
