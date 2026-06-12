import { useMemo, useState } from "react";
import EmptyState from "../components/EmptyState";
import { useApp } from "../context/AppContext";
import { formatDateTime, formatRupiah } from "../utils/helpers";

export default function Transactions() {
  const { transactions } = useApp();
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((trx) => {
        const matchSearch = trx.number.toLowerCase().includes(search.toLowerCase());
        const matchDate = dateFilter ? trx.date.slice(0, 10) === dateFilter : true;
        return matchSearch && matchDate;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions, search, dateFilter]);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Riwayat Transaksi</h1>
          <p>Lihat transaksi yang sudah disimpan beserta detail barangnya.</p>
        </div>
      </div>

      <section className="card">
        <div className="toolbar">
          <input
            type="search"
            placeholder="Cari nomor transaksi..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <input type="date" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} />
          <button className="btn btn-secondary" onClick={() => { setSearch(""); setDateFilter(""); }}>
            Reset Filter
          </button>
        </div>

        {filteredTransactions.length === 0 ? (
          <EmptyState title="Transaksi tidak ditemukan" description="Belum ada transaksi atau filter tidak sesuai." />
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Nomor</th>
                  <th>Tanggal</th>
                  <th>Total Pembayaran</th>
                  <th>Metode</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{transaction.number}</td>
                    <td>{formatDateTime(transaction.date)}</td>
                    <td>{formatRupiah(transaction.totalPayment)}</td>
                    <td>{transaction.paymentMethod}</td>
                    <td>
                      <button className="btn btn-edit small" onClick={() => setSelectedTransaction(transaction)}>
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selectedTransaction && (
        <div className="modal-backdrop" onClick={() => setSelectedTransaction(null)}>
          <section className="modal-card" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>Detail Transaksi {selectedTransaction.number}</h2>
                <p>{formatDateTime(selectedTransaction.date)}</p>
              </div>
              <button className="btn btn-secondary small" onClick={() => setSelectedTransaction(null)}>Tutup</button>
            </div>
            <div className="table-wrapper compact-table">
              <table>
                <thead>
                  <tr>
                    <th>Nama Barang</th>
                    <th>Jumlah</th>
                    <th>Harga Satuan</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedTransaction.items.map((item) => (
                    <tr key={`${selectedTransaction.id}-${item.productId}`}>
                      <td>{item.name}</td>
                      <td>{item.quantity} {item.unit}</td>
                      <td>{formatRupiah(item.price)}</td>
                      <td>{formatRupiah(item.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="modal-total">
              <span>Metode: {selectedTransaction.paymentMethod}</span>
              <strong>Total: {formatRupiah(selectedTransaction.totalPayment)}</strong>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
