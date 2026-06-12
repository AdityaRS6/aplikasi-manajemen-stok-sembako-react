import { useState } from "react";
import EmptyState from "../components/EmptyState";
import { useApp } from "../context/AppContext";
import { formatDateTime } from "../utils/helpers";

export default function StockIn() {
  const { products, stockIns, addStockIn } = useApp();
  const [form, setForm] = useState({ productId: "", quantity: "", supplier: "", note: "" });
  const [message, setMessage] = useState({ type: "", text: "" });

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.productId || !form.quantity || !form.supplier.trim()) {
      setMessage({ type: "error", text: "Barang, jumlah masuk, dan supplier wajib diisi." });
      return;
    }

    const result = addStockIn(form);
    if (result.success) {
      setForm({ productId: "", quantity: "", supplier: "", note: "" });
      setMessage({ type: "success", text: result.message });
    } else {
      setMessage({ type: "error", text: result.message });
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Stok Masuk</h1>
          <p>Catat barang masuk dari supplier dan tambah stok otomatis.</p>
        </div>
      </div>

      {message.text && <div className={`alert ${message.type}`}>{message.text}</div>}

      <div className="grid-two align-start">
        <section className="card">
          <div className="section-title">
            <h2>Form Stok Masuk</h2>
            <p>Jumlah stok masuk harus lebih dari 0.</p>
          </div>
          <form className="form-grid" onSubmit={handleSubmit}>
            <label>
              Pilih Barang
              <select name="productId" value={form.productId} onChange={handleChange}>
                <option value="">Pilih barang</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>{product.code} - {product.name}</option>
                ))}
              </select>
            </label>
            <label>
              Jumlah Masuk
              <input type="number" min="1" name="quantity" value={form.quantity} onChange={handleChange} placeholder="Contoh: 10" />
            </label>
            <label>
              Supplier
              <input name="supplier" value={form.supplier} onChange={handleChange} placeholder="Nama supplier" />
            </label>
            <label>
              Keterangan
              <textarea name="note" rows="4" value={form.note} onChange={handleChange} placeholder="Contoh: Restock mingguan" />
            </label>
            <button className="btn btn-primary" type="submit">Simpan Stok Masuk</button>
          </form>
        </section>

        <section className="card">
          <div className="section-title">
            <h2>Riwayat Stok Masuk</h2>
            <p>Daftar stok barang yang pernah ditambahkan.</p>
          </div>
          {stockIns.length === 0 ? (
            <EmptyState title="Belum ada stok masuk" description="Riwayat akan muncul setelah data disimpan." />
          ) : (
            <div className="table-wrapper compact-table">
              <table>
                <thead>
                  <tr>
                    <th>Tanggal</th>
                    <th>Barang</th>
                    <th>Jumlah</th>
                    <th>Supplier</th>
                    <th>Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  {stockIns.map((stockIn) => (
                    <tr key={stockIn.id}>
                      <td>{formatDateTime(stockIn.date)}</td>
                      <td>{stockIn.productName}</td>
                      <td>{stockIn.quantity}</td>
                      <td>{stockIn.supplier}</td>
                      <td>{stockIn.note || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
