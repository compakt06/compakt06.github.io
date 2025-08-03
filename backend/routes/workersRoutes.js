const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  // Pobierz wszystkich pracowników
  router.get('/', async (req, res) => {
    try {
      const snapshot = await db.collection('staff').get();
      const workers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(workers);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch workers' });
    }
  });

  // Dodaj nowego pracownika
  router.post('/', async (req, res) => {
    try {
      const { name, email, role, password, isManager } = req.body;
      if (!name || !email || !role || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      const docRef = await db.collection('staff').add({
        name,
        email,
        role,
        password,
        isManager: !!isManager
      });
      res.status(201).json({ message: 'Worker added', id: docRef.id });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to add worker' });
    }
  });

  // Usuń pracownika
  router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const workerDoc = db.collection('staff').doc(id);
      const docSnap = await workerDoc.get();

      if (!docSnap.exists) {
        return res.status(404).json({ error: 'Worker not found' });
      }

      if (docSnap.data().role === 'Supervisor') {
        return res.status(403).json({ error: 'Cannot delete Supervisor' });
      }

      await workerDoc.delete();
      res.json({ message: 'Worker deleted' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete worker' });
    }
  });

  // 🔐 LOGIN ENDPOINT
  router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
      const snapshot = await db.collection('staff').where('email', '==', email).get();

      if (snapshot.empty) {
        return res.status(401).json({ error: 'User not found' });
      }

      const user = snapshot.docs[0].data();

      // Sprawdzenie hasła
      if (user.password !== password) {
        return res.status(401).json({ error: 'Invalid password' });
      }

      // ✅ Wysyłamy dane użytkownika (frontend sprawdzi isManager)
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Login failed' });
    }
  });

  return router;
};
