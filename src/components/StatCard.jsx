export default function StatCard({ title, value, icon, description }) {
  return (
    <article className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div>
        <p>{title}</p>
        <h3>{value}</h3>
        {description && <small>{description}</small>}
      </div>
    </article>
  );
}
