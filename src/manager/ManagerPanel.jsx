import React, { useState, useEffect } from 'react';
import {
  Container,
  Button,
  Table,
  Form,
  Modal,
  Alert,
  Tabs,
  Tab,
  Card,
  ListGroup,
  Badge
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
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showRemoveItemsModal, setShowRemoveItemsModal] = useState(false);
  const [itemsToggleMap, setItemsToggleMap] = useState(new Map());

  const navigate = useNavigate();

  // --- Fetch workers ---
  const fetchWorkers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/workers');
      if (!res.ok) throw new Error('Failed to fetch workers');
      const data = await res.json();
      setWorkers(data);
    } catch (e) {
      console.error(e);
    }
  };

  // --- Fetch orders ---
  const fetchOrders = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/orders');
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      setOrders(data);
    } catch (e) {
      console.error(e);
    }
  };

  // --- On login success, fetch data ---
  useEffect(() => {
    if (loggedIn) {
      fetchWorkers();
      fetchOrders();
    }
  }, [loggedIn]);

  // --- Handle login ---
  const handleLogin = async () => {
    try {
      setError('');
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.error || 'Login failed');
        return;
      }
      const user = await res.json();
      if (!user.isManager) {
        setError('Access Denied: You are not a manager.');
        return;
      }
      setLoggedIn(true);
    } catch {
      setError('Login failed.');
    }
  };

  // --- Handle logout ---
  const handleLogout = () => {
    setLoggedIn(false);
    setEmail('');
    setPassword('');
  };

  // --- Add worker ---
  const addWorker = async () => {
    if (!newWorker.name || !newWorker.email || !newWorker.password || !newWorker.role) {
      alert('Please fill out all fields');
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/workers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newWorker),
      });
      if (!res.ok) throw new Error('Failed to add worker');
      setShowAddWorker(false);
      setNewWorker({ email: '', name: '', role: '', password: '' });
      fetchWorkers();
    } catch {
      alert('Error adding worker');
    }
  };

  // --- Delete worker ---
  const deleteWorker = async (workerId, role) => {
    if (role === 'Supervisor') {
      alert('❌ Cannot delete a Supervisor!');
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/workers/${workerId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete worker');
      fetchWorkers();
    } catch {
      alert('Error deleting worker');
    }
  };

  // --- Cancel order ---
  const cancelOrder = async (orderId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Cancelled' }),
      });
      if (!res.ok) throw new Error('Failed to cancel order');
      fetchOrders();
    } catch {
      alert('Error cancelling order');
    }
  };

  // --- Open Remove Items Modal ---
  const openRemoveItemsModal = (order) => {
    setSelectedOrder(order);
    setItemsToggleMap(new Map());
    setShowRemoveItemsModal(true);
  };

  // --- Toggle item removed state ---
  const toggleItemToRemove = (index) => {
    setItemsToggleMap(prev => {
      const newMap = new Map(prev);
      const currentlyToggled = newMap.has(index) ? newMap.get(index) : null;
      const originalRemoved = selectedOrder?.items[index]?.removed || false;
      const newValue = currentlyToggled !== null ? !currentlyToggled : !originalRemoved;
      newMap.set(index, newValue);
      return newMap;
    });
  };

  // --- Confirm removing items ---
  const handleRemoveItemsConfirm = async () => {
    if (!selectedOrder) return;

    const newItems = selectedOrder.items.map((item, idx) => {
      if (itemsToggleMap.has(idx)) {
        return { ...item, removed: itemsToggleMap.get(idx) };
      }
      return item;
    });

    try {
      const res = await fetch(`http://localhost:5000/api/orders/${selectedOrder.id}/items`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: newItems }),
      });
      if (!res.ok) throw new Error('Failed to update items');
      setShowRemoveItemsModal(false);
      fetchOrders();
    } catch {
      alert('Error updating items');
    }
  };

  if (!loggedIn) {
    return (
      <Container className="py-5" style={{ maxWidth: '400px', textAlign: 'center' }}>
        <img src={KFCLogo} alt="KFC Logo" style={{ height: '80px', marginBottom: '10px' }} />
        <h3 className="mb-3" style={{ fontWeight: 'bold', color: '#d9232d' }}>Manager Login</h3>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter manager email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </Form.Group>

          <Button variant="dark" className="w-100 mb-2" onClick={handleLogin}>Login</Button>
          <Button variant="outline-secondary" className="w-100" onClick={() => navigate('/orders')}>⬅ Back</Button>
        </Form>
      </Container>
    );
  }

  return (
    <Container className="py-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="text-center">
          <img src={KFCLogo} alt="KFC Logo" style={{ height: '80px', marginBottom: '10px' }} />
          <h2 style={{ fontWeight: 'bold', color: '#d9232d' }}>Manager Panel</h2>
        </div>
        <Button variant="outline-dark" className="h-50" onClick={handleLogout}>🚪 Logout</Button>
      </div>

      <Tabs defaultActiveKey="orders" className="mb-3" fill>
        <Tab eventKey="orders" title="Orders">
          {orders.length === 0 ? (
            <p className="text-muted text-center mt-3">No orders found</p>
          ) : (
            <div>
              {orders.map(order => (
                <ManagerOrderCard
                  key={order.id}
                  order={order}
                  cancelOrder={cancelOrder}
                  openRemoveItemsModal={openRemoveItemsModal}
                />
              ))}
            </div>
          )}
        </Tab>

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
                      disabled={worker.role === 'Supervisor'}
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

      {/* Add Worker Modal */}
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
                onChange={e => setNewWorker({ ...newWorker, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={newWorker.email}
                onChange={e => setNewWorker({ ...newWorker, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={newWorker.password}
                onChange={e => setNewWorker({ ...newWorker, password: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                value={newWorker.role}
                onChange={e => setNewWorker({ ...newWorker, role: e.target.value })}
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

      {/* Remove Items Modal */}
      <Modal show={showRemoveItemsModal} onHide={() => setShowRemoveItemsModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Mark Items as Removed from Order {selectedOrder?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            {selectedOrder?.items.map((item, idx) => {
              const toggledRemoved = itemsToggleMap.has(idx)
                ? itemsToggleMap.get(idx)
                : item.removed || false;

              return (
                <ListGroup.Item
                  key={idx}
                  action
                  active={toggledRemoved}
                  onClick={() => toggleItemToRemove(idx)}
                  style={{
                    cursor: 'pointer',
                    textDecoration: toggledRemoved ? 'line-through' : 'none',
                    opacity: toggledRemoved ? 0.6 : 1
                  }}
                >
                  {item.name} × {item.quantity} {toggledRemoved && '(Removed)'}
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRemoveItemsModal(false)}>Cancel</Button>
          <Button
            variant="danger"
            disabled={itemsToggleMap.size === 0}
            onClick={handleRemoveItemsConfirm}
          >
            Update Items Removed Status
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

// --- Manager Order Card ---
const ManagerOrderCard = ({ order, cancelOrder, openRemoveItemsModal }) => {
  const statusColors = {
    Preparing: 'warning',
    Issue: 'danger',
    'Ready to serve': 'primary',
    Served: 'success',
    Late: 'danger',
    Cancelled: 'secondary'
  };

  const cancelledStyle = order.status === 'Cancelled'
    ? { opacity: 0.6, backgroundColor: '#f8f9fa' }
    : {};

  return (
    <Card className="mb-3 shadow-sm" style={{ borderLeft: '8px solid #d9232d', ...cancelledStyle }}>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h5 style={{ fontWeight: 'bold' }}>Table {order.table}</h5>
            <Badge bg={statusColors[order.status] || 'secondary'}>{order.status}</Badge>
            {order.status === 'Cancelled' && (
              <div className="text-danger fw-bold mt-1">🚫 Cancelled by Manager</div>
            )}
            <div className="text-muted small mt-1">🆔 Order ID: {order.id}</div>
            <div className="text-muted small">👤 Worker: {order.staffID || 'N/A'}</div>
          </div>

          <div className="d-flex flex-column gap-2">
            <Button
              variant="outline-danger"
              size="sm"
              disabled={order.status === 'Cancelled' || order.status === 'Served'}
              onClick={() => cancelOrder(order.id)}
            >
              ❌ Cancel Order
            </Button>

            <Button
              variant="outline-warning"
              size="sm"
              onClick={() => openRemoveItemsModal(order)}
              disabled={order.status === 'Cancelled'}
            >
              🗑️ Remove Items
            </Button>
          </div>
        </div>

        <ListGroup className="mt-3">
          {order.items?.map((item, index) => (
            <ListGroup.Item
              key={index}
              style={{
                textDecoration: item.removed ? 'line-through' : 'none',
                opacity: item.removed ? 0.6 : 1
              }}
            >
              {item.name} × {item.quantity} {item.removed && '(Removed)'}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  );
};
