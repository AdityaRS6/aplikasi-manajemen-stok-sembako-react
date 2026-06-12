import { useMemo, useState } from "react";
import { Link } from "react-router";
import EmptyState from "../components/EmptyState";
import { useApp } from "../context/AppContext";
import { categories } from "../data/initialProducts";
import { formatDate, formatRupiah, getStockStatus } from "../utils/helpers";

export default function Products() {
  const { products, deleteProduct } = useApp();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const keyword = search.toLowerCase();
      const matchKeyword =
        product.name.toLowerCase().includes(keyword) ||
        product.code.toLowerCase().includes(keyword);
      const matchCategory = category ? product.category === category : true;
      return matchKeyword && matchCategory;
    });
  }, [products, search, category]);

  function handleDelete(product) {
    const confirmed = window.confirm(`Hapus barang ${product.name}?`);
    if (!confirmed) return;
    const result = deleteProduct(product.id);
    setMessage(result.message);
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Data Barang</h1>
          <p>Kelola barang sembako, stok, harga, kategori, dan supplier.</p>
        </div>
        <Link className="btn btn-primary" to="/barang/tambah">+ Tambah Barang</Link>
      </div>

      {message && <div className="alert info">{message}</div>}

      <section className="card">
        <div className="toolbar">
          <input
            type="search"
            placeholder="Cari nama atau kode barang..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="">Semua Kategori</option>
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>

        {filteredProducts.length === 0 ? (
          <EmptyState title="Barang tidak ditemukan" description="Coba ubah kata kunci atau kategori pencarian." />
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Kode</th>
                  <th>Nama Barang</th>
                  <th>Kategori</th>
                  <th>Harga Beli</th>
                  <th>Harga Jual</th>
                  <th>Stok</th>
                  <th>Satuan</th>
                  <th>Supplier</th>
                  <th>Tanggal Input</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const status = getStockStatus(product.stock);
                  return (
                    <tr key={product.id}>
                      <td>{product.code}</td>
                      <td>{product.name}</td>
                      <td>{product.category}</td>
                      <td>{formatRupiah(product.purchasePrice)}</td>
                      <td>{formatRupiah(product.sellingPrice)}</td>
                      <td>{product.stock}</td>
                      <td>{product.unit}</td>
                      <td>{product.supplier}</td>
                      <td>{formatDate(product.inputDate)}</td>
                      <td><span className={`badge ${status.className}`}>{status.label}</span></td>
                      <td>
                        <div className="action-group">
                          <Link className="btn btn-edit small" to={`/barang/edit/${product.id}`}>Edit</Link>
                          <button className="btn btn-danger small" onClick={() => handleDelete(product)}>Hapus</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
