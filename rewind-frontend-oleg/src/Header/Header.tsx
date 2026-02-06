import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import logoImg from "../assets/logo.png";
import "./Header.css";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { isAuth, logout } = useAuth();

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
        <Link to="/members">MEMBERS</Link>
        <Link to="/journals">JOURNALS</Link>
        <Link to="/profile">ACCOUNT</Link>
      </nav>

      <div className="nav-right-container">
        <Link className="search-circle" to="/search">
          <Search size={18} />
        </Link>

        {/* ✅ У хедері НЕМАЄ Log in / Sign up взагалі */}
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
