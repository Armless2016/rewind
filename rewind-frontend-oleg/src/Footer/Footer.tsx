import "./Footer.css";
import logoImg from "../assets/logo.png";
import { Link } from "react-router-dom";

const preventNav = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.preventDefault();
};

function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-content">
        <div className="footer-logo">
          <img src={logoImg} alt="Rewind Logo" />
        </div>

        <nav className="footer-nav">
          <Link to="/about">ABOUT US</Link>

          {/* поки що не веде нікуди */}
          <a href="#" onClick={preventNav} className="footer-link-disabled">
            NEWS
          </a>

          <Link to="/help">HELP</Link>
          <Link to="/terms">TERMS</Link>
          <Link to="/contacts">CONTACTS</Link>
        </nav>
      </div>

      <div className="footer-socials">
        <a href="#" className="social-icon-twitter" aria-label="X">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
              fill="currentColor"
            />
          </svg>
        </a>

        <a href="#" className="social-icon" aria-label="Instagram">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
        </a>

        <a href="#" className="social-icon" aria-label="LinkedIn">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
            <rect x="2" y="9" width="4" height="12"></rect>
            <circle cx="4" cy="4" r="2"></circle>
          </svg>
        </a>
      </div>

      <p className="footer-copy">
        © 2025 Rewind. Made by students in Kyiv, Ukraine. Film data from IMDB
      </p>
    </footer>
  );
}

export default Footer;
