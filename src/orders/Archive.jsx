// src/orders/Archive.jsx
import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { Container, Table } from 'react-bootstrap';

export default function Archive() {
  const [allOrders, setAllOrders] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "order"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAllOrders(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsubscribe();
  }, []);

  return (
    <Container>
      <h2 className="my-3">Order Archive</h2>
      <Table striped>
        {/* Table implementation showing all historical orders */}
      </Table>
    </Container>
  );
}