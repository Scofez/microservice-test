# microservice-frontend

A Vite + React + TypeScript app to inspect the three services in `../services`.

## Pages

| Page            | What it shows                                                                                       |
| --------------- | --------------------------------------------------------------------------------------------------- |
| `/health`       | One card per service, polled every 3 s. Each card has a **Stop** button (needs `npm run dev` on the service). |
| `/orders`       | `GET /orders/:id`, and `GET /orders/:id/availability` (order-service calls inventory-service)        |
| `/inventory`    | `GET /stock/:sku`                                                                                   |
| `/notifications`| `GET /notifications`                                                                                |

Every response shows its HTTP status and raw JSON body. An `error` body also shows as an alert, with the failed dependency call when the service sends it.

## How it reaches the services

The browser only talks to the Vite dev server. `vite.config.ts` proxies each prefix to its service and removes the prefix:

| Browser path          | Forwarded to            |
| --------------------- | ----------------------- |
| `/api/order/*`        | `http://localhost:3001` |
| `/api/inventory/*`    | `http://localhost:3002` |
| `/api/notification/*` | `http://localhost:3003` |

One origin means no CORS headers are needed on the services. In production, an API gateway plays this role.
When a service is down, the proxy answers `502` with an empty body, and the app reports the service as down.

## Structure

```
src/
├── api/services.ts        callService(): every HTTP status resolves as data; only "no JSON" rejects
├── components/
│   ├── Layout.tsx          top bar and tabs
│   ├── ResponseViewer.tsx  status badge, error alert, raw JSON
│   ├── ServiceExplorer.tsx input + sample buttons + ResponseViewer
│   └── StopServiceButton.tsx
└── pages/                 one file per page
```

Data fetching uses TanStack Query. Routing uses React Router.

## Scripts

```sh
npm run dev      # dev server with the proxy, http://localhost:5173
npm run build    # type check, then production build
npm run lint     # oxlint
```

The proxy exists only in the dev server. `npm run build` output has no proxy.
