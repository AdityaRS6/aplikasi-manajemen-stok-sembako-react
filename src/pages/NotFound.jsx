import { Link } from "react-router";

export default function NotFound() {
  return (
    <main className="not-found">
      <section className="card center-card">
        <h1>404</h1>
        <p>Halaman yang Anda cari tidak ditemukan.</p>
        <Link className="btn btn-primary" to="/dashboard">Kembali ke Dashboard</Link>
      </section>
    </main>
  );
}
