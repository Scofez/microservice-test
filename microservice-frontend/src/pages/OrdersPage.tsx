import type { JSX } from 'react'

import { serviceByName } from '../api/services.ts'
import ServiceExplorer from '../components/ServiceExplorer.tsx'

const orderService = serviceByName.order

export default function OrdersPage(): JSX.Element {
  return (
    <>
      <h1>order-service</h1>
      <p className="muted">
        <code>GET /orders/:id</code> returns one order. <code>ord-999</code> does not exist.
      </p>
      <ServiceExplorer
        service={orderService}
        inputLabel="Order ID"
        samples={['ord-1', 'ord-2', 'ord-3', 'ord-999']}
        buildPath={(id) => `/orders/${id}`}
      />

      <h2 className="section-title">Availability</h2>
      <p className="muted">
        <code>GET /orders/:id/availability</code> makes order-service call inventory-service. Stop
        inventory-service to see the 503.
      </p>
      <ServiceExplorer
        service={orderService}
        inputLabel="Order ID"
        samples={['ord-1', 'ord-2', 'ord-3', 'ord-999']}
        buildPath={(id) => `/orders/${id}/availability`}
      />
    </>
  )
}
