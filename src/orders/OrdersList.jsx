import { useEffect, useState } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  doc, 
  updateDoc,
  getDoc
} from 'firebase/firestore';
import { db, auth } from '../firebase/firebase';
import { 
  Badge, 
  Button, 
  Card, 
  ListGroup, 
  Container,
  Tabs,
  Tab
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [isManager, setIsManager] = useState(false);
  const navigate = useNavigate();

  // Check if user is manager
  useEffect(() => {
    const checkManagerStatus = async () => {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        setIsManager(userDoc.data()?.isManager || false);
      }
    };
    checkManagerStatus();
  }, []);

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, "order", orderId), {
        status: newStatus,
        ...(newStatus === "Served" && { servedAt: new Date() })
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

  // Fetch active orders (not served)
  useEffect(() => {
    const q = query(
      collection(db, "order"),
      where("status", "!=", "Served")
    );
    
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

  // Dynamic title counter
  useEffect(() => {
    const pendingOrders = orders.filter(order => 
      order.status !== "Served"
    ).length;
    document.title = `🍗 (${pendingOrders}) Active Orders - KFC System`;
  }, [orders]);

  return (
    <Container className="py-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Kitchen Orders</h2>
        {isManager && (
          <Button 
            variant="primary"
            onClick={() => navigate('/manager')}
          >
            Manager Panel
          </Button>
        )}
      </div>

      <Tabs defaultActiveKey="active" className="mb-3">
        <Tab eventKey="active" title="Active Orders">
          {orders.length === 0 ? (
            <p className="text-muted">No active orders</p>
          ) : (
            <div className="order-list">
              {orders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onUpdateStatus={updateOrderStatus}
                  getWaitingTime={getWaitingTime}
                />
              ))}
            </div>
          )}
        </Tab>
        <Tab 
          eventKey="completed" 
          title="Completed Today" 
          onClick={() => navigate('/completed')}
        />
        <Tab 
          eventKey="archive" 
          title="Archive" 
          onClick={() => navigate('/archive')}
        />
      </Tabs>
    </Container>
  );
}

const OrderCard = ({ order, onUpdateStatus, getWaitingTime }) => {
  const statusColors = {
    "Preparing/Issue": "warning",
    "Ready to serve": "primary",
    "Served": "success"
  };

  return (
    <Card className="mb-3">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h5>Table {order.table}</h5>
            <Badge bg={statusColors[order.status]}>
              {order.status}
            </Badge>
            <div className="text-muted mt-1">
              Waiting: {getWaitingTime(order.createdAt)}
            </div>
          </div>
          
          <div className="d-flex gap-2">
            {order.status === "Preparing/Issue" && (
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={() => onUpdateStatus(order.id, "Ready to serve")}
              >
                Mark Ready
              </Button>
            )}
            {order.status === "Ready to serve" && (
              <Button 
                variant="outline-success" 
                size="sm"
                onClick={() => onUpdateStatus(order.id, "Served")}
              >
                Mark Served
              </Button>
            )}
          </div>
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
  );
};