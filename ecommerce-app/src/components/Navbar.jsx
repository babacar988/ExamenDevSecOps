import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { isAuthenticated, username, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        🛒 ShopSN
      </Link>
      <div className="navbar-links">
        <Link to="/">Catalogue</Link>
        <Link to="/cart">Panier ({totalItems})</Link>
        {isAuthenticated ? (
          <>
            <span className="navbar-user">Bonjour, {username}</span>
            <button onClick={handleLogout}>Déconnexion</button>
          </>
        ) : (
          <Link to="/login">Connexion</Link>
        )}
      </div>
    </nav>
  );
}
