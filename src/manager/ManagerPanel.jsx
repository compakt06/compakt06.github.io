import { useState, useEffect } from 'react';
import { 
  collection, query, getDocs, doc, updateDoc, deleteDoc, onSnapshot, addDoc 
} from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { 
  Container, Button, Table, Form, Modal, Alert, Tabs, Tab, Card, ListGroup, Badge 
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import KFCLogo from '../assets/kfc-logo.png';

export default function ManagerPanel() {
  const [workers, setWorkers] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showAddWorker, setShowAddWorker] = useState(false);
  const [newWorker, setNewWorker] = useState({ email: '', name: '', role: '', password: '' });
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  // ✅ Load workers if logged in
  useEffect(() => {
    if (loggedIn) {
      const fetchWorkers = async () => {
        const q = query(collection(db, "staff"));
        const snapshot = await getDocs(q);
        setWorkers(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      };
      fetchWorkers();
    }
  }, [loggedIn]);

  // ✅ Live listen for orders
  useEffect(() => {
    if (loggedIn) {
      const unsubscribe = onSnapshot(collection(db, "order"), (snapshot) => {
        setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
      return () => unsubscribe();
    }
  }, [loggedIn]);

  // ✅ Firestore-Only Login
  const handleLogin = async () => {
    try {
      setError('');
      const staffRef = collection(db, "staff");
      const staffSnapshot = await getDocs(staffRef);

      const staffMember = staffSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .find(worker => worker.email === email && worker.password === password);

      if (!staffMember) {
        setError('Invalid email or password');
        return;
      }

      if (!staffMember.isManager) {
        setError('Access Denied: You are not a manager.');
        return;
      }

      setLoggedIn(true);
    } catch (err) {
      console.error(err);
      setError('Login failed.');
    }
  };

  // ✅ Cancel Order (just changes status)
  const cancelOrder = async (orderId) => {
    await updateDoc(doc(db, "order", orderId), { status: "Cancelled" });
  };

  // ✅ Delete Worker (JSM restriction)
  const deleteWorker = async (workerId, role) => {
    if (role === "Supervisor") {
      alert("❌ JSM cannot delete a Supervisor!");
      return;
    }
    await deleteDoc(doc(db, "staff", workerId));
  };

  // ✅ Add Worker
  const addWorker = async () => {
    if (!newWorker.name || !newWorker.email || !newWorker.password || !newWorker.role) {
      alert("Please fill out all fields");
      return;
    }

    try {
      await addDoc(collection(db, "staff"), {
        name: newWorker.name,
        email: newWorker.email,
        password: newWorker.password,
        role: newWorker.role,
        isManager: ["JSM", "Assistant Manager", "Manager", "Supervisor"].includes(newWorker.role)
      });

      // Clear the modal and refresh workers list
      setNewWorker({ email: '', name: '', role: '', password: '' });
      setShowAddWorker(false);

      // Reload workers
      const snapshot = await getDocs(collection(db, "staff"));
      setWorkers(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("Error adding worker: ", err);
    }
  };

  // ✅ Show login if not logged in
  if (!loggedIn) {
    return (
      <Container className="py-5" style={{ maxWidth: '400px', textAlign: 'center' }}>
        <img src={KFCLogo} alt="KFC Logo" style={{ height: "80px", marginBottom: "10px" }} />
        <h3 className="mb-3" style={{ fontWeight: "bold", color: "#d9232d" }}>Manager Login</h3>

        {error && <Alert variant="danger">{error}</Alert>}
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control 
              type="email" 
              placeholder="Enter manager email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control 
              type="password" 
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
            />
          </Form.Group>

          <Button variant="dark" className="w-100 mb-2" onClick={handleLogin}>
            Login
          </Button>
          <Button variant="outline-secondary" className="w-100" onClick={() => navigate('/')}>
            ⬅ Back
          </Button>
        </Form>
      </Container>
    );
  }

  // ✅ Manager panel UI
  return (
    <Container className="py-3">
      {/* ✅ HEADER */}
      <div className="text-center mb-4">
        <img src={KFCLogo} alt="KFC Logo" style={{ height: "80px", marginBottom: "10px" }} />
        <h2 style={{ fontWeight: "bold", color: "#d9232d" }}>Manager Panel</h2>
      </div>

      {/* ✅ TABS for Orders & Workers */}
      <Tabs defaultActiveKey="orders" className="mb-3" fill>
        {/* 🛠 ORDERS TAB */}
        <Tab eventKey="orders" title="Orders">
          {orders.length === 0 ? (
            <p className="text-muted text-center mt-3">No orders found</p>
          ) : (
            <div>
              {orders.map((order) => (
                <ManagerOrderCard 
                  key={order.id} 
                  order={order} 
                  cancelOrder={cancelOrder} 
                />
              ))}
            </div>
          )}
        </Tab>

        {/* 👥 WORKERS TAB */}
        <Tab eventKey="workers" title="Workers">
          <div className="mb-3 d-flex justify-content-between align-items-center">
            <h4>Workers</h4>
            <Button variant="dark" onClick={() => setShowAddWorker(true)}>Add Worker</Button>
          </div>

          <Table striped>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {workers.map(worker => (
                <tr key={worker.id}>
                  <td>{worker.name}</td>
                  <td>{worker.email}</td>
                  <td>{worker.role}</td>
                  <td>
                    <Button 
                      variant="danger" 
                      size="sm" 
                      disabled={worker.role === "Supervisor"} // ✅ Can't delete Supervisor
                      onClick={() => deleteWorker(worker.id, worker.role)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
      </Tabs>

      {/* ➕ Add Worker Modal */}
      <Modal show={showAddWorker} onHide={() => setShowAddWorker(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Worker</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control 
                type="text" 
                value={newWorker.name} 
                onChange={(e) => setNewWorker({...newWorker, name: e.target.value})} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control 
                type="email" 
                value={newWorker.email} 
                onChange={(e) => setNewWorker({...newWorker, email: e.target.value})} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control 
                type="password" 
                value={newWorker.password} 
                onChange={(e) => setNewWorker({...newWorker, password: e.target.value})} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                value={newWorker.role}
                onChange={(e) => setNewWorker({ ...newWorker, role: e.target.value })}
              >
                <option value="">Select role</option>
                <option value="Crew Member">Crew Member</option>
                <option value="Trainee">Trainee</option>
                <option value="JSM">JSM</option>
                <option value="Assistant Manager">Assistant Manager</option>
                <option value="Manager">Manager</option>
                <option value="Supervisor">Supervisor</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddWorker(false)}>Cancel</Button>
          <Button variant="dark" onClick={addWorker}>Add Worker</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

/* ✅ Order Card for Manager */
const ManagerOrderCard = ({ order, cancelOrder }) => {
  const statusColors = {
    "Preparing": "warning",
    "Issue": "danger",
    "Ready to serve": "primary",
    "Served": "success",
    "Late": "danger",
    "Cancelled": "secondary"
  };

  const cancelledStyle = order.status === "Cancelled"
    ? { opacity: 0.6, backgroundColor: "#f8f9fa" }
    : {};

  return (
    <Card className="mb-3 shadow-sm" style={{ borderLeft: "8px solid #d9232d", ...cancelledStyle }}>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h5 style={{ fontWeight: "bold" }}>Table {order.table}</h5>
            <Badge bg={statusColors[order.status] || "secondary"}>{order.status}</Badge>
            {order.status === "Cancelled" && (
              <div className="text-danger fw-bold mt-1">🚫 Cancelled by Manager</div>
            )}
            <div className="text-muted small mt-1">🆔 Order ID: {order.id}</div>
            <div className="text-muted small">👤 Worker: {order.staffID || 'N/A'}</div>
          </div>

          {/* 🚫 Cancel Button (disabled if already cancelled) */}
          <Button 
            variant="outline-danger" 
            size="sm" 
            disabled={order.status === "Cancelled"}
            onClick={() => cancelOrder(order.id)}
          >
            ❌ Cancel Order
          </Button>
        </div>

        {/* ITEMS */}
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
