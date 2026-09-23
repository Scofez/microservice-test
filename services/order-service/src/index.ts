import express from 'express';

import { checkAvailability } from './availability.ts';
import { fetchStock } from './inventoryClient.ts';
import { findOrder } from './orders.ts';

const SERVICE_NAME = 'order-service';
const port = Number(process.env.PORT ?? 3001);

const app = express();

app.get('/health', (_req, res) => {
  res.json({ service: SERVICE_NAME, status: 'ok' });
});

app.get('/orders/:id', (req, res) => {
  const order = findOrder(req.params.id);

  if (order === undefined) {
    res.status(404).json({ error: `Order ${req.params.id} does not exist` });
    return;
  }

  res.json(order);
});

app.get('/orders/:id/availability', async (req, res) => {
  const order = findOrder(req.params.id);

  if (order === undefined) {
    res.status(404).json({ error: `Order ${req.params.id} does not exist` });
    return;
  }

  const stockLookup = await fetchStock(order.sku);

  switch (stockLookup.kind) {
    case 'found':
      res.json(checkAvailability(order, stockLookup.stockItem));
      return;

    case 'unknown-sku':
      // Inventory has never stocked this SKU, so it holds zero units. That is an answer, not a failure.
      res.json(checkAvailability(order, { sku: order.sku, available: 0 }));
      return;

    case 'unavailable':
      // 503, not 500: order-service works, but it cannot answer without inventory-service.
      console.warn(`availability of ${order.id}: ${stockLookup.reason}`);
      res.status(503).json({ error: stockLookup.reason });
      return;
  }
});

app.listen(port, () => {
  console.log(`${SERVICE_NAME} listens on http://localhost:${port}`);
});
