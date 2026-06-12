import { useMemo, useState } from "react";
import EmptyState from "../components/EmptyState";
import StatCard from "../components/StatCard";
import { useApp } from "../context/AppContext";
import { calculateSoldProducts, formatDateTime, formatRupiah, getMonthKey } from "../utils/helpers";

export default function Reports() {
  const { transactions } = useApp();
  const [dateFilter, setDateFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState(getMonthKey());

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchDate = dateFilter ? transaction.date.slice(0, 10) === dateFilter : true;
      const matchMonth = monthFilter ? transaction.date.slice(0, 7) === monthFilter : true;
      return matchDate && matchMonth;
    });
  }, [transactions, dateFilter, monthFilter]);

  const totalIncome = filteredTransactions.reduce((sum, trx) => sum + Number(trx.totalPayment), 0);
  const totalSoldItems = filteredTransactions.reduce(
    (sum, trx) => sum + trx.items.reduce((itemSum, item) => itemSum + Number(item.quantity), 0),
    0
  );
  const bestSellingProduct = calculateSoldProducts(filteredTransactions)[0];

  function printReport() {
    window.print();
  }

  return (
    <div className="page report-page">
      <div className="page-header no-print">
        <div>
          <h1>Laporan Penjualan</h1>
          <p>Lihat laporan penjualan harian dan bulanan secara sederhana.</p>
        </div>
        <button className="btn btn-primary" onClick={printReport}>Cetak Laporan</button>
      </div>

      <section className="card print-area">
        <div className="report-heading">
          <h2>Laporan Penjualan Toko Sembako Makmur Jaya</h2>
          <p>Jl. Merdeka No. 10, Bengkalis</p>
        </div>

        <div className="toolbar no-print">
          <label>
            Filter Tanggal
            <input type="date" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} />
          </label>
          <label>
            Filter Bulan
            <input type="month" value={monthFilter} onChange={(event) => setMonthFilter(event.target.value)} />
          </label>
          <button className="btn btn-secondary" onClick={() => { setDateFilter(""); setMonthFilter(""); }}>
            Tampilkan Semua
          </button>
        </div>

        <div className="stats-grid report-stats">
          <StatCard title="Total Transaksi" value={filteredTransactions.length} icon="🧾" />
          <StatCard title="Total Pendapatan" value={formatRupiah(totalIncome)} icon="💰" />
          <StatCard title="Barang Terjual" value={totalSoldItems} icon="📦" />
          <StatCard title="Barang Terlaris" value={bestSellingProduct?.name || "-"} icon="🏆" description={bestSellingProduct ? `${bestSellingProduct.quantity} terjual` : "Belum ada data"} />
        </div>

        <div className="section-title">
          <h2>Tabel Transaksi</h2>
          <p>Daftar transaksi berdasarkan filter yang dipilih.</p>
        </div>

        {filteredTransactions.length === 0 ? (
          <EmptyState title="Tidak ada transaksi" description="Belum ada transaksi pada periode yang dipilih." />
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Nomor Transaksi</th>
                  <th>Tanggal</th>
                  <th>Barang</th>
                  <th>Total Bayar</th>
                  <th>Metode</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction, index) => (
                  <tr key={transaction.id}>
                    <td>{index + 1}</td>
                    <td>{transaction.number}</td>
                    <td>{formatDateTime(transaction.date)}</td>
                    <td>
                      {transaction.items.map((item) => `${item.name} (${item.quantity})`).join(", ")}
                    </td>
                    <td>{formatRupiah(transaction.totalPayment)}</td>
                    <td>{transaction.paymentMethod}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
