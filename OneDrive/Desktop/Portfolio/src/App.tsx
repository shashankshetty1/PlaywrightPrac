import { useEffect } from 'react';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Credentials } from './components/Credentials';
import { Cursor } from './components/Cursor';
import { Experience } from './components/Experience';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { Navbar } from './components/Navbar';
import { Projects } from './components/Projects';
import { QaMascot } from './components/QaMascot';
import { Skills } from './components/Skills';
import { navLinks } from './data/profile';
import { trackSectionViews } from './lib/analytics';

export default function App() {
  useEffect(() => trackSectionViews(navLinks.map((l) => l.id)), []);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Cursor />
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Credentials />
        <Contact />
      </main>
      <Footer />
      <QaMascot />
    </>
  );
}
