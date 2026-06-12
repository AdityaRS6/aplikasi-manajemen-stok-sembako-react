import { useMemo, useState } from "react";
import EmptyState from "../components/EmptyState";
import { useApp } from "../context/AppContext";
import { formatRupiah } from "../utils/helpers";

export default function Sales() {
  const { products, addTransaction } = useApp();
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("Tunai");
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState({ type: "", text: "" });

  const selectedProduct = products.find((product) => product.id === selectedProductId);
  const availableProducts = products.filter((product) => Number(product.stock) > 0);

  const cartWithProduct = useMemo(() => {
    return cart.map((item) => {
      const product = products.find((product) => product.id === item.productId);
      return {
        ...item,
        product,
        subtotal: product ? Number(product.sellingPrice) * Number(item.quantity) : 0,
      };
    });
  }, [cart, products]);

  const totalPayment = cartWithProduct.reduce((sum, item) => sum + item.subtotal, 0);

  function addToCart(event) {
    event.preventDefault();
    setMessage({ type: "", text: "" });

    if (!selectedProduct) {
      setMessage({ type: "error", text: "Pilih barang terlebih dahulu." });
      return;
    }

    const numericQuantity = Number(quantity);
    const existingCartItem = cart.find((item) => item.productId === selectedProduct.id);
    const totalRequested = (existingCartItem?.quantity || 0) + numericQuantity;

    if (selectedProduct.stock === 0) {
      setMessage({ type: "error", text: `${selectedProduct.name} sedang habis.` });
      return;
    }

    if (numericQuantity <= 0) {
      setMessage({ type: "error", text: "Jumlah pembelian harus lebih dari 0." });
      return;
    }

    if (totalRequested > selectedProduct.stock) {
      setMessage({ type: "error", text: `Stok tidak cukup. Stok tersedia: ${selectedProduct.stock}.` });
      return;
    }

    if (existingCartItem) {
      setCart((prev) =>
        prev.map((item) =>
          item.productId === selectedProduct.id
            ? { ...item, quantity: Number(item.quantity) + numericQuantity }
            : item
        )
      );
    } else {
      setCart((prev) => [...prev, { productId: selectedProduct.id, quantity: numericQuantity }]);
    }

    setSelectedProductId("");
    setQuantity(1);
  }

  function removeCartItem(productId) {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  }

  function saveTransaction() {
    const result = addTransaction(cart, paymentMethod);
    if (result.success) {
      setCart([]);
      setPaymentMethod("Tunai");
      setMessage({ type: "success", text: result.message });
    } else {
      setMessage({ type: "error", text: result.message });
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Transaksi Penjualan</h1>
          <p>Catat transaksi penjualan dan kurangi stok otomatis.</p>
        </div>
      </div>

      {message.text && <div className={`alert ${message.type}`}>{message.text}</div>}

      <div className="grid-two align-start">
        <section className="card">
          <div className="section-title">
            <h2>Input Barang</h2>
            <p>Pilih barang, isi jumlah pembelian, lalu masukkan ke keranjang.</p>
          </div>
          <form className="form-grid" onSubmit={addToCart}>
            <label>
              Pilih Barang
              <select value={selectedProductId} onChange={(event) => setSelectedProductId(event.target.value)}>
                <option value="">Pilih barang</option>
                {availableProducts.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.code} - {product.name} - Stok {product.stock}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Harga Jual
              <input value={selectedProduct ? formatRupiah(selectedProduct.sellingPrice) : ""} readOnly placeholder="Harga otomatis" />
            </label>
            <label>
              Jumlah Beli
              <input type="number" min="1" value={quantity} onChange={(event) => setQuantity(event.target.value)} />
            </label>
            <label>
              Subtotal
              <input value={selectedProduct ? formatRupiah(Number(selectedProduct.sellingPrice) * Number(quantity || 0)) : ""} readOnly placeholder="Subtotal otomatis" />
            </label>
            <button className="btn btn-primary" type="submit">Tambah ke Keranjang</button>
          </form>
        </section>

        <section className="card">
          <div className="section-title">
            <h2>Keranjang Transaksi</h2>
            <p>Satu transaksi dapat berisi lebih dari satu barang.</p>
          </div>

          {cartWithProduct.length === 0 ? (
            <EmptyState title="Keranjang kosong" description="Tambahkan barang terlebih dahulu." />
          ) : (
            <>
              <div className="table-wrapper compact-table">
                <table>
                  <thead>
                    <tr>
                      <th>Barang</th>
                      <th>Jumlah</th>
                      <th>Harga</th>
                      <th>Subtotal</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartWithProduct.map((item) => (
                      <tr key={item.productId}>
                        <td>{item.product?.name}</td>
                        <td>{item.quantity}</td>
                        <td>{formatRupiah(item.product?.sellingPrice)}</td>
                        <td>{formatRupiah(item.subtotal)}</td>
                        <td><button className="btn btn-danger small" onClick={() => removeCartItem(item.productId)}>Hapus</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="payment-box">
                <label>
                  Metode Pembayaran
                  <select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}>
                    <option value="Tunai">Tunai</option>
                    <option value="QRIS">QRIS</option>
                    <option value="Transfer">Transfer</option>
                  </select>
                </label>
                <div className="total-box">
                  <span>Total Pembayaran</span>
                  <strong>{formatRupiah(totalPayment)}</strong>
                </div>
                <button className="btn btn-primary full" onClick={saveTransaction}>Simpan Transaksi</button>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
