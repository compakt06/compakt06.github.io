const express = require('express');
const cors = require('cors');

const db = require('./firebaseAdmin');
const ordersRoutes = require('./routes/ordersRoutes');
const workersRoutes = require('./routes/workersRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Podpinamy routery, przekazując instancję Firestore
app.use('/api/orders', ordersRoutes(db));
app.use('/api/workers', workersRoutes(db));
app.use('/api', workersRoutes(db)); // aby /api/login działało poprawnie

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
