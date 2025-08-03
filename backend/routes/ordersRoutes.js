const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  // Pobierz wszystkie zamówienia
  router.get('/', async (req, res) => {
    try {
      const snapshot = await db.collection('order').get();
      const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(orders);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  });

  // Aktualizuj status zamówienia
  // Metoda powinna być PATCH (częściowa aktualizacja), a nie PUT (pełna)
  router.patch('/:id/status', async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!status) return res.status(400).json({ error: 'Status is required' });

      await db.collection('order').doc(id).update({ status });
      res.json({ message: 'Order status updated' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update order status' });
    }
  });

  // Archiwalne zamówienia - niepotrzebnie duplikujesz endpoint z głównym get '/'
  // Rozumiem, że tu jest sortowanie - ok, ale nazwa 'archive' sugeruje coś innego
  router.get('/archive', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const snapshot = await db.collection('order')
      .where('status', 'in', ['Served', 'Cancelled'])
      .get();

    const orders = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(order => {
        if (order.status === 'Cancelled') return true;
        if (order.status === 'Served' && order.servedAt && order.servedAt.toDate() < today) return true;
        return false;
      });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders archive' });
  }
});

  // Pobranie zamówień "Served" z dzisiejszą datą lub później
  router.get('/completed-today', async (req, res) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const snapshot = await db.collection('order')
        .where('status', '==', 'Served')
        .where('completedAt', '>=', today)
        .get();
      const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(orders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch completed orders' });
    }
  });

  // Usunięcie wszystkich dzisiejszych zamówień z status "Served"
  router.delete('/completed-today', async (req, res) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const snapshot = await db.collection('order')
        .where('status', '==', 'Served')
        .where('completedAt', '>=', today)
        .get();

      const batch = db.batch();
      snapshot.docs.forEach(doc => batch.delete(doc.ref));
      await batch.commit();

      res.json({ message: 'Completed orders cleared' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to clear completed orders' });
    }
  });

  return router;
};
