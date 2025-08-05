import { useState, useEffect } from "react";
import { collection, onSnapshot, doc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { Badge, Button, Card, ListGroup, Container, Dropdown, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Clock, CheckCircle, Archive } from "lucide-react";
import KFCLogo from "../assets/kfc-logo.png";

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [archivedOrders, setArchivedOrders] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [completedFilter, setCompletedFilter] = useState("All");
  const [archiveFilter, setArchiveFilter] = useState("All");
  const [mainTab, setMainTab] = useState("active");
  const navigate = useNavigate();

  const updateOrderStatus = async (orderId, newStatus) => await updateDoc(doc(db, "order", orderId), {
    status: newStatus,
    ...(newStatus === "Served" && { servedAt: Timestamp.fromDate(new Date()) })
  });

  const formatWaitTime = (minutes) => {
    if (minutes === null || minutes === undefined) return "0m";
    if (minutes < 60) return `${minutes}m`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  useEffect(() => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const unsubAll = onSnapshot(collection(db, "order"), (snapshot) => {
      const allOrders = snapshot.docs.map(doc => {
        const data = doc.data();

        const freezeAt = data.servedAt || data.cancelledAt ? data.servedAt || data.cancelledAt : null;
        const createdAtDate = data.created_at?.toDate();

        let waitTime = 0;
        if (createdAtDate) {
          const endDate = freezeAt ? freezeAt.toDate() : new Date();
          waitTime = Math.floor((endDate - createdAtDate) / 60000);
          if (waitTime < 0) waitTime = 0;
        }

        return {
          id: doc.id,
          ...data,
          waitTime,
          createdAt: data.createdAt,
          servedAt: data.servedAt,
          cancelledAt: data.cancelledAt
        };
      });

      setOrders(allOrders.filter(order => !["Served", "Cancelled"].includes(order.status)));
      setCompletedOrders(allOrders.filter(order =>
        order.status === "Served" &&
        order.servedAt &&
        order.servedAt.toDate() >= startOfDay
      ));
      setArchivedOrders(allOrders.filter(order =>
        (order.status === "Served" &&
          order.servedAt &&
          order.servedAt.toDate() < startOfDay) ||
        order.status === "Cancelled"
      ));
    });

    return () => unsubAll();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      orders.forEach(order => {
        if (["Preparing", "Issue"].includes(order.status) &&
          (new Date() - order.createdAt.toDate()) > 5 * 60 * 1000) {
          updateOrderStatus(order.id, "Late");
        }
      });
    }, 60000);
    return () => clearInterval(timer);
  }, [orders]);

  useEffect(() => {
    document.title = `🍗 (${orders.length}) Active Orders - KFC System`;
  }, [orders]);

  const filterOrders = (list, filter) => filter === "All" ? list : list.filter(order => order.status === filter);

  const tabData = {
    active: { list: filterOrders(orders, activeFilter), filter: activeFilter, set: setActiveFilter },
    completed: { list: filterOrders(completedOrders, completedFilter), filter: completedFilter, set: setCompletedFilter },
    archive: { list: filterOrders(archivedOrders, archiveFilter), filter: archiveFilter, set: setArchiveFilter }
  };

  const { list, filter, set } = tabData[mainTab];

  return (
    <div style={{ display: "flex", height: "100vh", background: "#fafafa" }}>
      <Sidebar mainTab={mainTab} setMainTab={setMainTab} navigate={navigate} />

      <Container fluid className="p-4" style={{ overflowY: "auto" }}>
        <h2 className="fw-bold mb-3" style={{ color: "#d9232d" }}>
          {mainTab === "active" ? "Active Orders" : mainTab === "completed" ? "Completed Orders" : "Archive"}
        </h2>

        <Form.Select className="mb-3" value={filter} onChange={e => set(e.target.value)} style={{ maxWidth: 220 }}>
          {["All", "Preparing", "Issue", "Ready to serve", "Served", "Late", "Cancelled"].map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </Form.Select>

        {list.length === 0 ? (
          <p className="text-muted text-center mt-3">No {mainTab} orders</p>
        ) : (
          list.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onUpdateStatus={mainTab === "active" ? updateOrderStatus : null}
              formatWaitTime={formatWaitTime}
              mainTab={mainTab}
            />
          ))
        )}
      </Container>
    </div>
  );
}

const Sidebar = ({ mainTab, setMainTab, navigate }) => {
  const buttons = [
    { icon: <Clock size={20} />, label: "Active Orders", tab: "active" },
    { icon: <CheckCircle size={20} />, label: "Completed", tab: "completed" },
    { icon: <Archive size={20} />, label: "Archive", tab: "archive" }
  ];

  return (
    <div style={{ width: 230, background: "#fff", borderRight: "1px solid #e0e0e0", padding: "20px 10px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div>
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <img src={KFCLogo} alt="KFC Logo" style={{ height: 70 }} />
        </div>
        {buttons.map(btn => (
          <SidebarButton key={btn.tab} icon={btn.icon} label={btn.label} active={mainTab === btn.tab} onClick={() => setMainTab(btn.tab)} />
        ))}
      </div>
      <Button variant="outline-dark" className="w-100 mt-3" onClick={() => navigate("/manager")}>Manager Panel</Button>
    </div>
  );
};

const SidebarButton = ({ icon, label, active, onClick }) => (
  <div onClick={onClick} style={{
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "12px 16px",
    marginBottom: 8,
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: active ? "bold" : "normal",
    background: active ? "#fbe9eb" : "transparent",
    color: active ? "#d9232d" : "#333"
  }}>
    {icon} {label}
  </div>
);

const OrderCard = ({ order, onUpdateStatus, formatWaitTime, mainTab }) => {
  const statusColors = {
    Preparing: "warning",
    Issue: "danger",
    "Ready to serve": "primary",
    Served: "success",
    Late: "danger",
    Cancelled: "secondary"
  };
  const allStatuses = ["Preparing", "Issue", "Ready to serve", "Served", "Late"];

  return (
    <Card className="mb-3 shadow-sm" style={{ borderLeft: "8px solid #d9232d", ...(order.status === "Cancelled" && { opacity: 0.6, background: "#f8f9fa" }) }}>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h5 className="fw-bold">Table {order.table}</h5>
            <Badge bg={statusColors[order.status] || "secondary"} className="mb-1">{order.status}</Badge>
            {order.status === "Cancelled" && <div className="text-danger fw-bold mt-1">🚫 Cancelled by Manager</div>}
            <div className="text-muted mt-1">
              {mainTab === "active" ? <>⏳ Waiting: {formatWaitTime(order.waitTime)}</> : <>⏳ Waited: {formatWaitTime(order.waitTime)}</>}
            </div>
            <div className="text-muted small">🆔 Order ID: {order.id}</div>
            <div className="text-muted small">👤 Worker: {order.staffID || "N/A"}</div>
          </div>

          {onUpdateStatus && order.status !== "Cancelled" && (
            <Dropdown>
              <Dropdown.Toggle variant="outline-dark" size="sm">Change Status</Dropdown.Toggle>
              <Dropdown.Menu>
                {allStatuses.map(status => (
                  <Dropdown.Item key={status} active={status === order.status} onClick={() => onUpdateStatus(order.id, status)}>
                    {status}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>

        <ListGroup className="mt-3">
          {order.items?.map((item, idx) => (
            <ListGroup.Item key={idx} className="d-flex justify-content-between" style={{ textDecoration: item.removed ? "line-through" : "none", opacity: item.removed ? 0.6 : 1 }}>
              <span>{item.name}</span>
              <span className="fw-bold">× {item.quantity}</span>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  );
};
