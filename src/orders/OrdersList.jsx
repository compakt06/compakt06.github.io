import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { Badge, Button, Card, ListGroup } from 'react-bootstrap';

export default function OrdersList() {
  const [orders, setOrders] = useState([]);

  // Update order status
  const handleCompleteOrder = async (orderId) => {
    try {
      await updateDoc(doc(db, "order", orderId), {
        status: "ready_to_serve"
      });
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  // Calculate waiting time
  const getWaitingTime = (createdAt) => {
    if (!createdAt) return "0m";
    const createdTime = createdAt.toDate();
    const now = new Date();
    const diffMinutes = Math.floor((now - createdTime) / (1000 * 60));
    
    if (diffMinutes >= 60) {
      const hours = Math.floor(diffMinutes / 60);
      const mins = diffMinutes % 60;
      return `${hours}h ${mins}m`;
    }
    return `${diffMinutes}m`;
  };

  useEffect(() => {
    const q = query(collection(db, "order"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const allOrders = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt || doc.data().created_at
      }));
      setOrders(allOrders);
    });

    return () => unsubscribe();
  }, []);

  // Dynamic title (excludes "ready_to_serve" orders)
  useEffect(() => {
    const pendingOrders = orders.filter(order => 
      order.status !== "ready_to_serve"
    ).length;
    document.title = `🍗q (${pendingOrders}) New Orders - KFC System`;
  }, [orders]);

  return (
    <div className="order-list">
      {orders.map((order) => (
        <Card key={order.id} className="mb-3">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h5>Table {order.table}</h5>
                <Badge bg={
                  order.status === "ready_to_serve" ? "success" :
                  order.status === "cooking" ? "primary" : "warning"
                }>
                  {order.status}
                </Badge>
                <div className="text-muted mt-1">
                  Waiting: {getWaitingTime(order.createdAt)}
                </div>
              </div>
              
              <Button 
                variant="outline-success" 
                size="sm"
                onClick={() => handleCompleteOrder(order.id)}
                disabled={order.status === "ready_to_serve"}
              >
                {order.status === "ready_to_serve" ? "Ready" : "Mark Ready"}
              </Button>
            </div>

            <ListGroup className="mt-2">
              {order.items?.map((item, index) => (
                <ListGroup.Item key={index}>
                  {item.name} × {item.quantity}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}