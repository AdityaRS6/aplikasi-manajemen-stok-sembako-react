import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useApp } from "../context/AppContext";
import { categories } from "../data/initialProducts";

const initialForm = {
  code: "",
  name: "",
  category: "",
  purchasePrice: "",
  sellingPrice: "",
  stock: "",
  unit: "",
  supplier: "",
};

export default function ProductForm({ mode }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const { products, addProduct, updateProduct } = useApp();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");

  const isEdit = mode === "edit";
  const selectedProduct = products.find((product) => product.id === id);

  useEffect(() => {
    if (isEdit && selectedProduct) {
      setForm({
        code: selectedProduct.code,
        name: selectedProduct.name,
        category: selectedProduct.category,
        purchasePrice: selectedProduct.purchasePrice,
        sellingPrice: selectedProduct.sellingPrice,
        stock: selectedProduct.stock,
        unit: selectedProduct.unit,
        supplier: selectedProduct.supplier,
      });
    }
  }, [isEdit, selectedProduct]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validateForm() {
    const requiredFields = ["code", "name", "category", "purchasePrice", "sellingPrice", "stock", "unit", "supplier"];
    const isEmpty = requiredFields.some((field) => String(form[field]).trim() === "");

    if (isEmpty) return "Semua field wajib diisi.";
    if (Number.isNaN(Number(form.purchasePrice)) || Number(form.purchasePrice) < 0) return "Harga beli harus berupa angka valid.";
    if (Number.isNaN(Number(form.sellingPrice)) || Number(form.sellingPrice) < 0) return "Harga jual harus berupa angka valid.";
    if (Number.isNaN(Number(form.stock)) || Number(form.stock) < 0) return "Stok harus berupa angka valid.";
    return "";
  }

  function handleSubmit(event) {
    event.preventDefault();
    const validationMessage = validateForm();
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    const result = isEdit ? updateProduct(id, form) : addProduct(form);
    if (!result.success) {
      setError(result.message);
      return;
    }

    navigate("/barang");
  }

  if (isEdit && !selectedProduct) {
    return (
      <div className="page">
        <section className="card">
          <h1>Barang tidak ditemukan</h1>
          <p>Data barang yang ingin diedit tidak tersedia.</p>
          <Link className="btn btn-primary" to="/barang">Kembali</Link>
        </section>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>{isEdit ? "Edit Barang" : "Tambah Barang"}</h1>
          <p>{isEdit ? "Perbarui data barang yang sudah terdaftar." : "Tambahkan barang sembako baru ke sistem."}</p>
        </div>
      </div>

      <section className="card form-card">
        {error && <div className="alert error">{error}</div>}
        <form className="form-grid two-columns" onSubmit={handleSubmit}>
          <label>
            Kode Barang
            <input name="code" value={form.code} onChange={handleChange} placeholder="Contoh: BRG011" />
          </label>
          <label>
            Nama Barang
            <input name="name" value={form.name} onChange={handleChange} placeholder="Contoh: Telur Ayam 1kg" />
          </label>
          <label>
            Kategori
            <select name="category" value={form.category} onChange={handleChange}>
              <option value="">Pilih kategori</option>
              {categories.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
          </label>
          <label>
            Harga Beli
            <input type="number" name="purchasePrice" value={form.purchasePrice} onChange={handleChange} placeholder="Contoh: 20000" />
          </label>
          <label>
            Harga Jual
            <input type="number" name="sellingPrice" value={form.sellingPrice} onChange={handleChange} placeholder="Contoh: 23000" />
          </label>
          <label>
            Stok
            <input type="number" name="stock" value={form.stock} onChange={handleChange} placeholder="Contoh: 10" />
          </label>
          <label>
            Satuan
            <input name="unit" value={form.unit} onChange={handleChange} placeholder="Contoh: pcs, kg, botol" />
          </label>
          <label>
            Supplier
            <input name="supplier" value={form.supplier} onChange={handleChange} placeholder="Nama supplier" />
          </label>
          <div className="form-actions full-column">
            <button type="submit" className="btn btn-primary">Simpan</button>
            <Link to="/barang" className="btn btn-secondary">Batal</Link>
          </div>
        </form>
      </section>
    </div>
  );
}
