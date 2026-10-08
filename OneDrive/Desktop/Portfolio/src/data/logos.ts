/**
 * Official technology logos. SVGs come from Devicon (MIT, full-colour "original" marks);
 * BigQuery comes from Simple Icons (CC0) filled with its official brand colour.
 * `color` is each brand's primary colour, used for the soft tint behind the logo.
 */
import bigquery from '../assets/logos/bigquery.svg';
import css3 from '../assets/logos/css3.svg';
import firebase from '../assets/logos/firebase.svg';
import github from '../assets/logos/github.svg';
import githubactions from '../assets/logos/githubactions.svg';
import html5 from '../assets/logos/html5.svg';
import java from '../assets/logos/java.svg';
import javascript from '../assets/logos/javascript.svg';
import jira from '../assets/logos/jira.svg';
import k6 from '../assets/logos/k6.svg';
import mysql from '../assets/logos/mysql.svg';
import nodejs from '../assets/logos/nodejs.svg';
import playwright from '../assets/logos/playwright.svg';
import postman from '../assets/logos/postman.svg';
import typescript from '../assets/logos/typescript.svg';
import vscode from '../assets/logos/vscode.svg';

export const logos = {
  playwright: { src: playwright, color: '#2EAD33' },
  postman: { src: postman, color: '#FF6C37' },
  k6: { src: k6, color: '#7D64FF' },
  jira: { src: jira, color: '#2684FF' },
  typescript: { src: typescript, color: '#3178C6' },
  javascript: { src: javascript, color: '#F7DF1E' },
  java: { src: java, color: '#E76F00' },
  html5: { src: html5, color: '#E34F26' },
  css3: { src: css3, color: '#1572B6' },
  nodejs: { src: nodejs, color: '#5FA04E' },
  github: { src: github, color: '#6E7681' },
  vscode: { src: vscode, color: '#007ACC' },
  githubactions: { src: githubactions, color: '#2088FF' },
  bigquery: { src: bigquery, color: '#669DF6' },
  firebase: { src: firebase, color: '#FFCA28' },
  mysql: { src: mysql, color: '#00758F' },
} as const;

export type LogoName = keyof typeof logos;
