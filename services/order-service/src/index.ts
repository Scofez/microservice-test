import express from 'express';

import { checkAvailability } from './availability.ts';
import { fetchStock } from './inventoryClient.ts';
import { findOrder } from './orders.ts';

const SERVICE_NAME = 'order-service';
const port = Number(process.env.PORT ?? 3001);
const isDevToolsEnabled = process.env.ENABLE_DEV_TOOLS === 'true';

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
      console.warn(`availability of ${order.id}: ${stockLookup.reason}`, stockLookup.failure);
      // Internal URLs help while learning but leak topology in production, so they are opt-in.
      res.status(503).json({
        error: stockLookup.reason,
        ...(isDevToolsEnabled && { dependency: stockLookup.failure }),
      });
      return;
  }
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
