// src/manager/ManagerPanel.jsx
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { Container, Button, Table, Form, Modal } from 'react-bootstrap';

export default function ManagerPanel() {
  const [workers, setWorkers] = useState([]);
  const [showAddWorker, setShowAddWorker] = useState(false);
  const [newWorker, setNewWorker] = useState({ email: '', name: '', isManager: false });

  useEffect(() => {
    const fetchWorkers = async () => {
      const q = query(collection(db, "users"));
      const snapshot = await getDocs(q);
      setWorkers(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    fetchWorkers();
  }, []);

  const addWorker = async () => {
    // Implement your worker creation logic
    // This would typically involve Firebase Auth + Firestore
    setShowAddWorker(false);
  };

  const deleteOrder = async (orderId) => {
    await deleteDoc(doc(db, "order", orderId));
  };

  return (
    <Container>
      <h2 className="my-3">Manager Panel</h2>
      
      <div className="mb-4">
        <h4>Workers</h4>
        <Button onClick={() => setShowAddWorker(true)}>Add Worker</Button>
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
                <td>{worker.isManager ? "Manager" : "Staff"}</td>
                <td>
                  <Button variant="danger" size="sm">Remove</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Add Worker Modal */}
      <Modal show={showAddWorker} onHide={() => setShowAddWorker(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Worker</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" value={newWorker.name} onChange={(e) => setNewWorker({...newWorker, name: e.target.value})} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={newWorker.email} onChange={(e) => setNewWorker({...newWorker, email: e.target.value})} />
            </Form.Group>
            <Form.Check 
              type="checkbox" 
              label="Is Manager" 
              checked={newWorker.isManager}
              onChange={(e) => setNewWorker({...newWorker, isManager: e.target.checked})}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddWorker(false)}>Cancel</Button>
          <Button variant="primary" onClick={addWorker}>Add Worker</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}