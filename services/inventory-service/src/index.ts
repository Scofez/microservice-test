import express from 'express';

import { findStock } from './stock.ts';

const SERVICE_NAME = 'inventory-service';
const port = Number(process.env.PORT ?? 3002);
const isDevToolsEnabled = process.env.ENABLE_DEV_TOOLS === 'true';

const app = express();

app.get('/health', (_req, res) => {
  res.json({ service: SERVICE_NAME, status: 'ok' });
});

app.get('/stock/:sku', (req, res) => {
  const stockItem = findStock(req.params.sku);

  // Zero stock is a valid 200. Only an unknown SKU is a 404, so callers can tell them apart.
  if (stockItem === undefined) {
    res.status(404).json({ error: `SKU ${req.params.sku} does not exist` });
    return;
  }

  res.json(stockItem);
});

// Anyone who can reach the port could stop the service, so this route exists only on explicit opt-in.
if (isDevToolsEnabled) {
  app.post('/admin/shutdown', (_req, res) => {
    console.log(`${SERVICE_NAME} shuts down on request`);
    res.on('finish', () => {
      server.close(() => process.exit(0));
      server.closeAllConnections();
    });
    res.status(202).json({ service: SERVICE_NAME, status: 'shutting down' });
  });
}

const server = app.listen(port, () => {
  const mode = isDevToolsEnabled ? ' (dev tools on)' : '';
  console.log(`${SERVICE_NAME} listens on http://localhost:${port}${mode}`);
});
