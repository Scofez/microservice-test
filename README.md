# microservice-test

A learning project: three small Node.js microservices and a React frontend that inspects them.

## Services

| Service                | Port | Routes                              | Owns            |
| ---------------------- | ---- | ----------------------------------- | --------------- |
| `order-service`        | 3001 | `GET /health`, `GET /orders/:id`, `GET /orders/:id/availability` | orders |
| `inventory-service`    | 3002 | `GET /health`, `GET /stock/:sku`    | stock per SKU   |
| `notification-service` | 3003 | `GET /health`, `GET /notifications` | sent messages   |

Each service is independent: its own `package.json`, `tsconfig.json`, and in-memory data.
`GET /orders/:id/availability` is the first service-to-service call: order-service asks inventory-service for the stock over HTTP (2 s timeout, set its address with `INVENTORY_URL`). If inventory-service is down, slow, or sends a bad body, order-service answers 503.

## Frontend

`microservice-frontend/` is a Vite + React + TypeScript app with four pages:
service health (polled every 3 s, with a **Stop** button per service), and one page per service that shows its raw HTTP response.
Error bodies show as an alert, including the failed dependency call. See [its README](microservice-frontend/README.md).

The Vite dev server proxies `/api/<service>/*` to each service, so the browser uses one origin and CORS does not apply.

## Run it

Requires Node 23.6+ (the services run `.ts` files directly, with no build step).

```sh
# in three terminals
cd services/order-service        && npm install && npm run dev
cd services/inventory-service    && npm install && npm run dev
cd services/notification-service && npm install && npm run dev

# in a fourth terminal
cd microservice-frontend && npm install && npm run dev
```

Then open http://localhost:5173.

### Dev tools

Start a service with `npm run dev` instead of `npm start` to set `ENABLE_DEV_TOOLS=true`. It turns on two things that must never reach production:

- `POST /admin/shutdown`, used by the **Stop** buttons on the health page. Start the service again with `npm run dev`.
- Failure details in 503 bodies: the dependency URL and a cause such as `ECONNREFUSED` or `TIMEOUT`.

## Roadmap

1. ✅ Three services with one `GET` route each
2. ✅ Frontend to inspect them
3. ✅ `order-service` calls `inventory-service` over HTTP
4. `order-service` publishes `order.created`, `notification-service` consumes it through RabbitMQ
