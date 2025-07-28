import { useEffect, useState } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  doc, 
  updateDoc,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { 
  Badge, 
  Button, 
  Card, 
  ListGroup, 
  Container,
  Tabs,
  Tab,
  Dropdown
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import KFCLogo from '../assets/kfc-logo.png'; // ✅ Make sure you have the KFC logo in /src/assets

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const navigate = useNavigate();

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, "order", orderId), {
        status: newStatus,
        ...(newStatus === "Served" && { servedAt: Timestamp.fromDate(new Date()) })
      });
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

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

  // ✅ Active Orders
  useEffect(() => {
    const q = query(collection(db, "order"), where("status", "!=", "Served"));
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

  // ✅ Completed Orders
  useEffect(() => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const q = query(
      collection(db, "order"),
      where("status", "==", "Served"),
      where("servedAt", ">=", Timestamp.fromDate(startOfDay))
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCompletedOrders(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })));
    });

    return () => unsubscribe();
  }, []);

  // ✅ Auto mark as late
  useEffect(() => {
    const interval = setInterval(() => {
      orders.forEach(order => {
        if (
          (order.status === "Preparing" || order.status === "Issue") &&
          order.createdAt &&
          (new Date() - order.createdAt.toDate()) > 5 * 60 * 1000
        ) {
          updateOrderStatus(order.id, "Late");
        }
      });
    }, 60000);
    return () => clearInterval(interval);
  }, [orders]);

  // ✅ Dynamic Title
  useEffect(() => {
    const pendingOrders = orders.filter(order => order.status !== "Served").length;
    document.title = `🍗 (${pendingOrders}) Active Orders - KFC System`;
  }, [orders]);

  return (
    <Container className="py-3">
      {/* ✅ HEADER */}
      <div className="text-center mb-4">
        <img src={KFCLogo} alt="KFC Logo" style={{ height: "80px", marginBottom: "10px" }} />
        <h2 style={{ fontWeight: "bold", color: "#d9232d" }}>KFC Kitchen Dashboard</h2>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 style={{ color: "#000" }}>Orders</h3>
        <Button 
          variant="dark"
          onClick={() => navigate('/manager')}
        >
          Manager Panel
        </Button>
      </div>

      {/* ✅ TABS */}
      <Tabs defaultActiveKey="active" className="mb-3" fill>
        <Tab eventKey="active" title="Active Orders">
          {orders.length === 0 ? (
            <p className="text-muted text-center mt-3">No active orders</p>
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

        <Tab eventKey="completed" title="Completed Today">
          {completedOrders.length === 0 ? (
            <p className="text-muted text-center mt-3">No completed orders today</p>
          ) : (
            <div className="order-list">
              {completedOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  getWaitingTime={getWaitingTime}
                />
              ))}
            </div>
          )}
        </Tab>

        <Tab 
          eventKey="archive" 
          title="Archive" 
          onClick={() => navigate('/archive')}
        />
      </Tabs>
    </Container>
  );
}

/* ✅ Order Card Component */
const OrderCard = ({ order, onUpdateStatus, getWaitingTime }) => {
  const statusColors = {
    "Preparing": "warning",
    "Issue": "danger",
    "Ready to serve": "primary",
    "Served": "success",
    "Late": "danger",
    "Cancelled": "secondary"
  };

  const allStatuses = ["Preparing", "Issue", "Ready to serve", "Served", "Late"];

  // ✅ Cancelled style (faded)
  const cancelledStyle = order.status === "Cancelled" 
    ? { opacity: 0.6, backgroundColor: "#f8f9fa" } 
    : {};

  return (
    <Card className="mb-3 shadow-sm" style={{ borderLeft: "8px solid #d9232d", ...cancelledStyle }}>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          {/* LEFT SIDE */}
          <div>
            <h5 style={{ fontWeight: "bold" }}>Table {order.table}</h5>
            <Badge bg={statusColors[order.status] || "secondary"} className="mb-1">
              {order.status}
            </Badge>
            {order.status === "Cancelled" && (
              <div className="text-danger fw-bold mt-1">🚫 Cancelled by Manager</div>
            )}
            <div className="text-muted mt-1">
              ⏳ Waiting: {getWaitingTime(order.createdAt)}
            </div>
            <div className="text-muted small">🆔 Order ID: {order.id}</div>
            <div className="text-muted small">👤 Worker: {order.staffID || 'N/A'}</div>
          </div>

          {/* DROPDOWN (Disabled if Cancelled) */}
          {onUpdateStatus && order.status !== "Cancelled" && (
            <Dropdown>
              <Dropdown.Toggle 
                variant="outline-dark" 
                size="sm" 
                id={`dropdown-${order.id}`}
              >
                Change Status
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {allStatuses.map((status) => (
                  <Dropdown.Item 
                    key={status}
                    active={status === order.status}
                    onClick={() => onUpdateStatus(order.id, status)}
                  >
                    {status}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          )}

          {order.status === "Cancelled" && (
            <Button variant="secondary" size="sm" disabled>
              Cancelled
            </Button>
          )}
        </div>

        {/* ORDER ITEMS */}
        <ListGroup className="mt-3">
          {order.items?.map((item, index) => (
            <ListGroup.Item key={index} className="d-flex justify-content-between">
              <span>{item.name}</span>
              <span className="fw-bold">× {item.quantity}</span>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  );
};
