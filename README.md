# microservice-test

A learning project: three small Node.js microservices and a React frontend that inspects them.

## Services

| Service                | Port | Routes                              | Owns            |
| ---------------------- | ---- | ----------------------------------- | --------------- |
| `order-service`        | 3001 | `GET /health`, `GET /orders/:id`    | orders          |
| `inventory-service`    | 3002 | `GET /health`, `GET /stock/:sku`    | stock per SKU   |
| `notification-service` | 3003 | `GET /health`, `GET /notifications` | sent messages   |

Each service is independent: its own `package.json`, `tsconfig.json`, and in-memory data.
The services do not call each other yet.

## Frontend

`microservice-frontend/` is a Vite + React + TypeScript app with four pages:
service health (polled every 3 s), and one page per service that shows its raw HTTP response.

The Vite dev server proxies `/api/<service>/*` to each service, so the browser uses one origin and CORS does not apply.

## Run it

Requires Node 23.6+ (the services run `.ts` files directly, with no build step).

```sh
# in three terminals
cd services/order-service        && npm install && npm start
cd services/inventory-service    && npm install && npm start
cd services/notification-service && npm install && npm start

# in a fourth terminal
cd microservice-frontend && npm install && npm run dev
```

Then open http://localhost:5173.

## Roadmap

1. ✅ Three services with one `GET` route each
2. ✅ Frontend to inspect them
3. `order-service` calls `inventory-service` over HTTP
4. `order-service` publishes `order.created`, `notification-service` consumes it through RabbitMQ
