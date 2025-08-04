const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  function calculateWaitTime(startTimestamp, endTimestamp) {
    if (!startTimestamp || !endTimestamp) return 0;

    try {
      const start = startTimestamp.toDate();
      const end = endTimestamp.toDate();

      const diff = end - start;
      const minutes = Math.floor(diff / 60000);

      console.log(`🕒 Order waited ${minutes} minutes (from ${start.toISOString()} to ${end.toISOString()})`);
      return minutes;
    } catch (err) {
      console.error('Failed to calculate wait time:', err);
      return 0;
    }
  }

  // ➕ Utwórz nowe zamówienie
  router.post('/', async (req, res) => {
    try {
      const {
        table,
        staffID,
        status = 'Active',
        items = [],
        timestamp = new Date().toISOString(),
        servedAt = null
      } = req.body;

      if (!table || !staffID || !Array.isArray(items)) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const newOrder = {
        table,
        staffID,
        status,
        items,
        timestamp,
        servedAt,
        created_at: new Date()
      };

      const docRef = await db.collection('order').add(newOrder);
      res.status(201).json({ message: 'Order created', id: docRef.id });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create order' });
    }
  });

  // 📥 Pobierz wszystkie zamówienia
  router.get('/', async (req, res) => {
    try {
      const snapshot = await db.collection('order').get();
      const orders = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.created_at?.toDate?.().toISOString() || null,
          waitTime: calculateWaitTime(data.created_at, data.servedAt || data.cancelledAt)
        };
      });
      res.json(orders);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  });

  // 🔄 Zmień status zamówienia
  router.patch('/:id/status', async (req, res) => {
    try {
      const { status } = req.body;
      await db.collection('order').doc(req.params.id).update({ status });
      res.json({ message: 'Order status updated' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update order status' });
    }
  });

  // 🗑️ Zaktualizuj listę itemów w zamówieniu
  router.patch('/:id/items', async (req, res) => {
    try {
      const { items } = req.body;
      if (!Array.isArray(items)) {
        return res.status(400).json({ error: 'Invalid items array' });
      }

      await db.collection('order').doc(req.params.id).update({ items });
      res.json({ message: 'Order items updated' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update order items' });
    }
  });

  // 📦 Pobierz archiwalne zamówienia
  router.get('/archive', async (req, res) => {
    try {
      const snapshot = await db.collection('order')
        .where('status', 'in', ['Served', 'Cancelled'])
        .get();

      const archivedOrders = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.created_at?.toDate?.().toISOString() || null,
          completedAt: data.servedAt?.toDate?.().toISOString() || data.cancelledAt?.toDate?.().toISOString() || null,
          waitTime: calculateWaitTime(data.created_at, data.servedAt || data.cancelledAt)
        };
      });

      res.json(archivedOrders);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch archived orders' });
    }
  });

  // 📅 Pobierz dzisiejsze completed zamówienia
  router.get('/completed-today', async (req, res) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const snapshot = await db.collection('order')
        .where('status', '==', 'Served')
        .get();

      const todayOrders = snapshot.docs.map(doc => {
        const data = doc.data();
        const createdAt = data.created_at?.toDate?.().toISOString() || null;
        const completedAt = data.servedAt?.toDate?.().toISOString() || null;

        return {
          id: doc.id,
          ...data,
          createdAt,
          completedAt,
          waitTime: calculateWaitTime(data.created_at, data.servedAt)
        };
      }).filter(order => order.createdAt?.startsWith(today));

      res.json(todayOrders);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch today\'s completed orders' });
    }
  });

  // 🧹 Usuń dzisiejsze completed zamówienia
  router.delete('/completed-today', async (req, res) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const snapshot = await db.collection('order')
        .where('status', '==', 'Served')
        .get();

      const batch = db.batch();
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        const createdAt = data.created_at?.toDate?.().toISOString() || null;
        if (createdAt?.startsWith(today)) {
          batch.delete(doc.ref);
        }
      });

      await batch.commit();
      res.json({ message: 'Today\'s completed orders deleted' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete orders' });
    }
  });

  return router;
};
