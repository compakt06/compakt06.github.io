// src/orders/CompletedOrders.jsx
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { Container, Table, Button } from 'react-bootstrap';

export default function CompletedOrders() {
  const [completedOrders, setCompletedOrders] = useState([]);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const q = query(
      collection(db, "order"),
      where("status", "==", "Served"),
      where("completedAt", ">=", today)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCompletedOrders(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsubscribe();
  }, []);

  const clearCompleted = async () => {
    const batch = writeBatch(db);
    completedOrders.forEach(order => {
      batch.delete(doc(db, "order", order.id));
    });
    await batch.commit();
  };

  return (
    <Container>
      <div className="d-flex justify-content-between my-3">
        <h2>Today's Completed Orders</h2>
        <Button variant="danger" onClick={clearCompleted}>
          Clear All
        </Button>
      </div>
      <Table striped>
        {/* Table implementation similar to others */}
      </Table>
    </Container>
  );
}