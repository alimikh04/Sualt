import { useMemo, useState } from 'react';

type Shipment = {
  id: string;
  type: 'city' | 'intercity' | 'magistral';
  route: string;
  status: string;
  amount: string;
};

const data: Shipment[] = [
  { id: 'SHP-1001', type: 'city', route: 'Almaty → Almaty', status: 'assigned', amount: '₸ 55,000' },
  { id: 'SHP-1002', type: 'intercity', route: 'Almaty → Astana', status: 'enroute_dropoff', amount: '₸ 210,000' },
  { id: 'SHP-1003', type: 'magistral', route: 'KZ → KG', status: 'bidding', amount: '₸ 430,000' },
];

export function ShipmentsPage() {
  const [status, setStatus] = useState('all');
  const rows = useMemo(() => data.filter((d) => (status === 'all' ? true : d.status === status)), [status]);

  return (
    <section>
      <h1>Shipments</h1>
      <div className="row">
        <label>Status:</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">all</option>
          <option value="bidding">bidding</option>
          <option value="assigned">assigned</option>
          <option value="enroute_dropoff">enroute_dropoff</option>
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Type</th><th>Route</th><th>Status</th><th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td><td>{r.type}</td><td>{r.route}</td><td>{r.status}</td><td>{r.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
