import express from 'express';

import { findStock } from './stock.ts';

const SERVICE_NAME = 'inventory-service';
const port = Number(process.env.PORT ?? 3002);

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

app.listen(port, () => {
  console.log(`${SERVICE_NAME} listens on http://localhost:${port}`);
});
