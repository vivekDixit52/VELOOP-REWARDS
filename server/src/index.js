import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cors from 'cors';
import { initDb } from './db.js';
import authRoutes from './routes/auth.js';
import exchangeRoutes from './routes/exchange.js';
import accountRoutes from './routes/account.js';

initDb();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || true }));
app.use(express.json({ limit: '50kb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/exchange', exchangeRoutes);
app.use('/api', accountRoutes);
app.use('/api', (_req, res) => res.status(404).json({ message: 'Not found.' }));

// Production: serve the built React app from the same server.
const clientDist = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'client', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (_req, res) => res.sendFile(path.join(clientDist, 'index.html')));
}

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Something went wrong. Please try again.' });
});

app.listen(PORT, () => console.log(`VELOOP server running on http://localhost:${PORT}`));
