const users = [
  { name: 'Aruzhan S.', role: 'corporate_operator', status: 'active' },
  { name: 'Dias K.', role: 'fleet_admin', status: 'active' },
  { name: 'Support BOT', role: 'support', status: 'invited' },
];

export function UsersPage() {
  return (
    <section>
      <h1>Users & Roles</h1>
      <ul>
        {users.map((u) => (
          <li key={u.name}><strong>{u.name}</strong> — {u.role} ({u.status})</li>
        ))}
      </ul>
    </section>
  );
}
