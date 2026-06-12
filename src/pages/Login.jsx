import { useState } from "react";
import { Navigate, useNavigate } from "react-router";
import { useApp } from "../context/AppContext";

export default function Login() {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useApp();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const result = login(form.username, form.password);

    if (result.success) {
      navigate("/dashboard", { replace: true });
    } else {
      setError(result.message);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-header">
          <div className="brand-logo large">SM</div>
          <h1>Login Admin</h1>
          <p>Aplikasi Manajemen Stok dan Penjualan Toko Sembako</p>
        </div>

        <form onSubmit={handleSubmit} className="form-grid">
          {error && <div className="alert error">{error}</div>}
          <label>
            Username
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Masukkan username"
              autoComplete="username"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Masukkan password"
              autoComplete="current-password"
              required
            />
          </label>
          <button className="btn btn-primary full" type="submit">
            Login
          </button>
        </form>

        <div className="demo-account">
          <strong>Akun Demo</strong>
          <span>Username: admin</span>
          <span>Password: admin123</span>
        </div>
      </section>
    </main>
  );
}
