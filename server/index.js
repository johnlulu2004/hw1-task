/**
 * eventually! — Express API server
 * Serves the REST API and (in production) the built React client.
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Ensure the database is initialized on startup.
require('./db');

const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', app: 'eventually!' });
});

app.use('/api/tasks', taskRoutes);

// Serve the Vite production build when available.
const clientDist = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`eventually! API listening on http://localhost:${PORT}`);
});
