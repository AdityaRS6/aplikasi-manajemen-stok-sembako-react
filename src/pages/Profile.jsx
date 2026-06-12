import { useState } from "react";
import { useApp } from "../context/AppContext";

export default function Profile() {
  const { resetApplicationData } = useApp();
  const [message, setMessage] = useState("");

  function handleReset() {
    const confirmed = window.confirm("Reset data aplikasi ke data awal? Semua transaksi dan stok masuk akan dihapus.");
    if (!confirmed) return;
    resetApplicationData();
    setMessage("Data aplikasi berhasil dikembalikan ke data awal.");
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Profil Toko</h1>
          <p>Informasi identitas UMKM Toko Sembako.</p>
        </div>
      </div>

      {message && <div className="alert success">{message}</div>}

      <section className="profile-card">
        <div className="store-logo">🏪</div>
        <div className="profile-content">
          <h2>Toko Sembako Makmur Jaya</h2>
          <p className="profile-description">
            Toko Sembako Makmur Jaya adalah UMKM yang menyediakan kebutuhan pokok harian masyarakat seperti beras, minyak goreng, gula, tepung, mie instan, minuman, susu, bumbu dapur, serta kebutuhan rumah tangga lainnya.
          </p>
          <div className="profile-grid">
            <div>
              <span>Pemilik</span>
              <strong>Bapak Ahmad</strong>
            </div>
            <div>
              <span>Alamat</span>
              <strong>Jl. Merdeka No. 10, Bengkalis</strong>
            </div>
            <div>
              <span>Nomor Telepon</span>
              <strong>081234567890</strong>
            </div>
            <div>
              <span>Jenis Usaha</span>
              <strong>UMKM Toko Sembako</strong>
            </div>
          </div>
          <button className="btn btn-danger" onClick={handleReset}>Reset Data Demo</button>
        </div>
      </section>
    </div>
  );
}
