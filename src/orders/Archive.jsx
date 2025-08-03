import { useState, useEffect } from 'react';
import { Container, Table } from 'react-bootstrap';

export default function Archive() {
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/orders/archive')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch orders');
        return res.json();
      })
      .then(data => {
        setAllOrders(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <Container>Loading orders...</Container>;
  if (error) return <Container>Error: {error}</Container>;

  return (
    <Container>
      <h2 className="my-3">Order Archive</h2>
      <Table striped>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Table</th>
            <th>Status</th>
            <th>Created At</th>
            {/* Dodaj więcej kolumn jeśli potrzeba */}
          </tr>
        </thead>
        <tbody>
          {allOrders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.table}</td>
              <td>{order.status}</td>
              <td>{new Date(order.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
