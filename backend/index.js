const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const app = express();

app.use(cors());
app.use(express.json());

// Firebase initialization
const serviceAccount = require('./serviceAccountKey.json'); // path to your key
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://smarthome-d3e80-default-rtdb.firebaseio.com'
});

const db = admin.database();

// IoT status
app.post('/api/status', (req, res) => {
  const { distance, buzzerOn, lightOn } = req.body;
  db.ref('status').set({ distance, buzzerOn, lightOn });
  console.log("Received from ESP32:", { distance, buzzerOn, lightOn });
  res.sendStatus(200);
});

// Frontend fetches status
app.get('/api/status', async (req, res) => {
  const snapshot = await db.ref('status').once('value');
  res.json(snapshot.val());
});

// Frontend sends control instructions
app.post('/api/control', (req, res) => {
  const { buzzerOn, lightOn } = req.body;
  db.ref('control').set({ buzzerOn, lightOn });
  console.log("Control sent from frontend:", { buzzerOn, lightOn });
  res.sendStatus(200);
});

// ESP32 fetches control instructions
app.get('/api/control', async (req, res) => {
  const snapshot = await db.ref('control').once('value');
  res.json(snapshot.val());
});

app.listen(3000, () => console.log('Server running on port 3000'));
