import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import logoImg from "../assets/logo.png";
import "./Header.css";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { isAuth, logout } = useAuth();

  const preventNav = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
  };

  return (
    <header className="rewind-header">
      <div className="nav-left">
        <div className="logo">
          <Link to="/">
            <img src={logoImg} alt="Rewind Logo" />
          </Link>
        </div>
      </div>

      <nav className="nav-center">
        <Link to="/search">FILMS</Link>
        <Link to="/lists">LISTS</Link>

        {/* поки що не ведуть нікуди */}
        <a href="#" onClick={preventNav} className="nav-disabled">
          MEMBERS
        </a>
        <a href="#" onClick={preventNav} className="nav-disabled">
          JOURNALS
        </a>

        <Link to={isAuth ? "/profile" : "/register"}>ACCOUNT</Link>
      </nav>

      <div className="nav-right-container">
        <Link className="search-circle" to="/search">
          <Search size={18} />
        </Link>

        {isAuth && (
          <button className="login-toggle" onClick={logout}>
            Log out
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
