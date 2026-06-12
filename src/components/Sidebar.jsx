import { NavLink } from "react-router";

const menus = [
  { path: "/dashboard", label: "Dashboard", icon: "🏠" },
  { path: "/barang", label: "Data Barang", icon: "📦" },
  { path: "/transaksi", label: "Transaksi", icon: "🛒" },
  { path: "/riwayat", label: "Riwayat", icon: "🧾" },
  { path: "/stok-masuk", label: "Stok Masuk", icon: "🚚" },
  { path: "/laporan", label: "Laporan", icon: "📊" },
  { path: "/profil", label: "Profil Toko", icon: "🏪" },
];

export default function Sidebar({ open, onClose }) {
  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      <div className="brand">
        <div className="brand-logo">SM</div>
        <div>
          <h1>Sembako</h1>
          <p>Makmur Jaya</p>
        </div>
      </div>
      <nav className="sidebar-menu">
        {menus.map((menu) => (
          <NavLink
            key={menu.path}
            to={menu.path}
            onClick={onClose}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <span>{menu.icon}</span>
            {menu.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
