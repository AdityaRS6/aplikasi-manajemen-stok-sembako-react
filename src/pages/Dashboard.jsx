import StatCard from "../components/StatCard";
import EmptyState from "../components/EmptyState";
import { useApp } from "../context/AppContext";
import { calculateSoldProducts, formatRupiah, getMonthKey, getTodayKey, getStockStatus } from "../utils/helpers";

export default function Dashboard() {
  const { products, transactions } = useApp();
  const todayKey = getTodayKey();
  const monthKey = getMonthKey();

  const todayTransactions = transactions.filter((trx) => trx.date.slice(0, 10) === todayKey);
  const monthlyTransactions = transactions.filter((trx) => trx.date.slice(0, 7) === monthKey);
  const lowStockProducts = products.filter((product) => Number(product.stock) <= 5);
  const bestSellingProducts = calculateSoldProducts(transactions).slice(0, 5);

  const totalStock = products.reduce((sum, product) => sum + Number(product.stock), 0);
  const todayIncome = todayTransactions.reduce((sum, trx) => sum + Number(trx.totalPayment), 0);
  const monthlyIncome = monthlyTransactions.reduce((sum, trx) => sum + Number(trx.totalPayment), 0);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Ringkasan kondisi stok dan penjualan toko hari ini.</p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard title="Total Barang" value={products.length} icon="📦" description="Jenis barang terdaftar" />
        <StatCard title="Total Stok" value={totalStock} icon="🏷️" description="Jumlah seluruh stok" />
        <StatCard title="Transaksi Hari Ini" value={todayTransactions.length} icon="🛒" description="Transaksi tersimpan" />
        <StatCard title="Pendapatan Hari Ini" value={formatRupiah(todayIncome)} icon="💰" description="Total omzet harian" />
        <StatCard title="Pendapatan Bulan Ini" value={formatRupiah(monthlyIncome)} icon="📅" description="Total omzet bulanan" />
        <StatCard title="Stok Rendah" value={lowStockProducts.length} icon="⚠️" description="Stok ≤ 5" />
      </div>

      <div className="grid-two">
        <section className="card">
          <div className="section-title">
            <h2>Barang Hampir Habis</h2>
            <p>Segera lakukan stok masuk jika diperlukan.</p>
          </div>
          {lowStockProducts.length === 0 ? (
            <EmptyState title="Tidak ada stok rendah" description="Semua stok barang masih aman." />
          ) : (
            <div className="table-wrapper compact-table">
              <table>
                <thead>
                  <tr>
                    <th>Barang</th>
                    <th>Stok</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockProducts.map((product) => {
                    const status = getStockStatus(product.stock);
                    return (
                      <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>{product.stock} {product.unit}</td>
                        <td><span className={`badge ${status.className}`}>{status.label}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="card">
          <div className="section-title">
            <h2>Barang Terlaris</h2>
            <p>Berdasarkan jumlah barang yang terjual.</p>
          </div>
          {bestSellingProducts.length === 0 ? (
            <EmptyState title="Belum ada penjualan" description="Barang terlaris akan muncul setelah transaksi tersimpan." />
          ) : (
            <div className="rank-list">
              {bestSellingProducts.map((item, index) => (
                <div className="rank-item" key={item.productId}>
                  <span>{index + 1}</span>
                  <div>
                    <strong>{item.name}</strong>
                    <p>{item.quantity} terjual • {formatRupiah(item.total)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
