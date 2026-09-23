import type { JSX } from 'react'

import { serviceByName } from '../api/services.ts'
import ServiceExplorer from '../components/ServiceExplorer.tsx'

const inventoryService = serviceByName.inventory

export default function InventoryPage(): JSX.Element {
  return (
    <>
      <h1>inventory-service</h1>
      <p className="muted">
        <code>GET /stock/:sku</code> returns the stock. <code>red-cap</code> is a 200 with zero
        units. <code>purple-hat</code> is an unknown SKU.
      </p>
      <ServiceExplorer
        service={inventoryService}
        inputLabel="SKU"
        samples={['blue-shirt', 'red-cap', 'green-socks', 'purple-hat']}
        buildPath={(sku) => `/stock/${sku}`}
      />
    </>
  )
}
