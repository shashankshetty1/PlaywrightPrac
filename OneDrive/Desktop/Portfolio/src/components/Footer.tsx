import { ArrowUp } from 'lucide-react';
import { profile } from '../data/profile';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <a href="#top" className="back-top">
          Back to top <ArrowUp size={15} aria-hidden="true" />
        </a>
      </div>
    </footer>
  );
}
