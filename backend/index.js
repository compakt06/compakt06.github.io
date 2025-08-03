const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

const ordersRoutes = require('./routes/ordersRoutes');
const workersRoutes = require('./routes/workersRoutes');

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const app = express();

app.use(cors());
app.use(express.json());

// 📌 Routes
app.use('/api/orders', ordersRoutes(db));
app.use('/api/workers', workersRoutes(db));
app.use('/api', workersRoutes(db)); // 🔥 DODANE, aby /api/login działało poprawnie

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
