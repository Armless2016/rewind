import { Search } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logoImg from "../assets/logo.png";
import "./Header.css";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { isAuth, logout } = useAuth();
  const location = useLocation();

  const isHome = location.pathname === "/";
  const hideAuthLinksOnHome = !isAuth && isHome;

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
        <Link to="/profile">ACCOUNT</Link>
      </nav>

      <div className="nav-right-container">
        <Link className="search-circle" to="/search">
          <Search size={18} />
        </Link>

        {/* ✅ На головній для гостя ховаємо Log in / Sign up */}
        {!isAuth ? (
          hideAuthLinksOnHome ? null : (
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <Link to="/login">Log in</Link>
              <Link to="/register">Sign up</Link>
            </div>
          )
        ) : (
          <button className="login-toggle" onClick={logout}>
            Log out
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
