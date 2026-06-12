import { useNavigate } from "react-router";
import { useApp } from "../context/AppContext";

export default function Navbar({ onToggleSidebar }) {
  const navigate = useNavigate();
  const { logout } = useApp();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className="navbar">
      <button className="menu-toggle" onClick={onToggleSidebar} aria-label="Buka menu">
        ☰
      </button>
      <div>
        <h2>Aplikasi Manajemen Toko Sembako</h2>
        <p>Admin / Pemilik Toko</p>
      </div>
      <button className="btn btn-outline" onClick={handleLogout}>
        Logout
      </button>
    </header>
  );
}
