export default function EmptyState({ title = "Data belum tersedia", description = "Silakan tambahkan data terlebih dahulu." }) {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
