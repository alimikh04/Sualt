const cards = [
  { label: 'Active shipments', value: '128' },
  { label: 'SLA on-time', value: '87%' },
  { label: 'GMV (KZT)', value: '₸ 45.2M' },
  { label: 'Disputes', value: '3' },
];

export function DashboardPage() {
  return (
    <section>
      <h1>Control Tower Dashboard</h1>
      <p>Asia/Almaty • KZT • kk/ru</p>
      <div className="cards">
        {cards.map((c) => (
          <article className="card" key={c.label}>
            <small>{c.label}</small>
            <strong>{c.value}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}
