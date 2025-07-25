import { useEffect, useState } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db, auth } from '../firebase/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Button, Spinner, Alert, ListGroup, Badge } from 'react-bootstrap';
import { useAuth } from '../auth/authContext';

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    const q = query(collection(db, "order"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const allOrders = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        allOrders.push({
          id: doc.id,
          table: data.table || 'Nieznany',
          staffID: data.staffID || 'Nieznany',
          status: data.status || 'Oczekujące',
          createdAt: data.created_at || data.createdAt,
          items: data.items || []
        });
      });
      setOrders(allOrders);
      setLoading(false);
    }, (error) => {
      console.error("Firestore error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Zamówienia ({orders.length})</h1>
        <div className="d-flex align-items-center">
          <span className="me-3">
            Witaj, <strong>{currentUser?.displayName || currentUser?.email}</strong>
          </span>
          <Button variant="outline-danger" onClick={handleLogout}>
            Wyloguj
          </Button>
        </div>
      </div>
      
      {orders.length === 0 ? (
        <Alert variant="info">Brak zamówień</Alert>
      ) : (
        <div className="d-grid gap-3">
          {orders.map((order) => (
            <Card key={order.id}>
              <Card.Body>
                <div className="d-flex justify-content-between mb-3">
                  <div>
                    <strong>Stolik:</strong> {order.table}
                  </div>
                  <div>
                    <strong>Kelner:</strong> {order.staffID}
                  </div>
                  <div>
                    <strong>Status:</strong> {' '}
                    <Badge bg={
                      order.status.toLowerCase().includes('complete') ? 'success' :
                      order.status.toLowerCase().includes('progress') ? 'primary' : 'warning'
                    }>
                      {order.status}
                    </Badge>
                  </div>
                </div>
                
                <h5>Produkty:</h5>
                <ListGroup>
                  {order.items.map((item, index) => (
                    <ListGroup.Item key={index} className="d-flex justify-content-between">
                      <span>{item.name || 'Nieznana pozycja'}</span>
                      <Badge bg="secondary">× {item.quantity || 1}</Badge>
                    </ListGroup.Item>
                  ))}
                </ListGroup>

                {order.createdAt && (
                  <div className="text-muted mt-3">
                    {order.createdAt.toDate().toLocaleString('pl-PL')}
                  </div>
                )}
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
}