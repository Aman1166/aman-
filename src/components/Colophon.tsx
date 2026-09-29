import React from 'react';

export const Colophon: React.FC = () => {
  return (
    <footer className="colophon">
      <h2>Colophon</h2>
      <ul>
        <li>
          <strong>Built With:</strong> React / GSAP / Framer / Lenis
        </li>
        <li>
          <strong>Typeface:</strong> Inter / Helvetica
        </li>
        <li>
          <strong>Deployed On:</strong> Vercel
        </li>
      </ul>
      <p>&copy; 2026</p>
    </footer>
  );
};