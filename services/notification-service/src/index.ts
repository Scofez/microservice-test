import express from 'express';

import { listNotifications } from './notifications.ts';

const SERVICE_NAME = 'notification-service';
const port = Number(process.env.PORT ?? 3003);
const isDevToolsEnabled = process.env.ENABLE_DEV_TOOLS === 'true';

const app = express();

app.get('/health', (_req, res) => {
  res.json({ service: SERVICE_NAME, status: 'ok' });
});

app.get('/notifications', (_req, res) => {
  res.json(listNotifications());
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
