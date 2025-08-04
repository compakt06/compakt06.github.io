import { useState, useEffect } from 'react';
import { Container, Table, Button, Alert } from 'react-bootstrap';

export default function CompletedOrders() {
  const [completedOrders, setCompletedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clearError, setClearError] = useState(null);
  const [clearSuccess, setClearSuccess] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/orders/completed-today')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch completed orders');
        return res.json();
      })
      .then(data => {
        setCompletedOrders(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const clearCompleted = async () => {
    setClearError(null);
    setClearSuccess(null);
    try {
      const res = await fetch('http://localhost:5000/api/orders/completed-today', {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to clear completed orders');
      setClearSuccess('All completed orders cleared.');
      setCompletedOrders([]);
    } catch (err) {
      setClearError(err.message);
    }
  };

  if (loading) return <Container>Loading completed orders...</Container>;
  if (error) return <Container>Error: {error}</Container>;

  return (
    <Container>
      <div className="d-flex justify-content-between my-3 align-items-center">
        <h2>Today's Completed Orders</h2>
        <Button variant="danger" onClick={clearCompleted} disabled={completedOrders.length === 0}>
          Clear All
        </Button>
      </div>

      {clearError && <Alert variant="danger">{clearError}</Alert>}
      {clearSuccess && <Alert variant="success">{clearSuccess}</Alert>}

      <Table striped>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Table</th>
            <th>Status</th>
            <th>Completed At</th>
          </tr>
        </thead>
        <tbody>
          {completedOrders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.table}</td>
              <td>{order.status}</td>
              <td>{new Date(order.completedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
