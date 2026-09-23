import express from 'express';

import { listNotifications } from './notifications.ts';

const SERVICE_NAME = 'notification-service';
const port = Number(process.env.PORT ?? 3003);

const app = express();

app.get('/health', (_req, res) => {
  res.json({ service: SERVICE_NAME, status: 'ok' });
});

app.get('/notifications', (_req, res) => {
  res.json(listNotifications());
});

app.listen(port, () => {
  console.log(`${SERVICE_NAME} listens on http://localhost:${port}`);
});
