import express from 'express';

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

app.listen(port, () => {
  console.log(`${SERVICE_NAME} listens on http://localhost:${port}`);
});
