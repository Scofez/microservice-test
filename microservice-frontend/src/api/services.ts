export type ServiceName = 'order' | 'inventory' | 'notification'

export interface ServiceInfo {
  name: ServiceName
  label: string
  port: number
}

export const serviceByName: Record<ServiceName, ServiceInfo> = {
  order: { name: 'order', label: 'order-service', port: 3001 },
  inventory: { name: 'inventory', label: 'inventory-service', port: 3002 },
  notification: { name: 'notification', label: 'notification-service', port: 3003 },
}

export const services: ServiceInfo[] = Object.values(serviceByName)

export interface ServiceResponse {
  status: number
  body: unknown
}

// A 404 is a real answer the page must display, so every HTTP status resolves.
// Only a missing JSON body rejects: our services always answer JSON, the Vite proxy does not.
export async function callService(service: ServiceName, path: string): Promise<ServiceResponse> {
  const response = await fetch(`/api/${service}${path}`)
  const text = await response.text()

  try {
    return { status: response.status, body: JSON.parse(text) }
  } catch {
    throw new Error(`${service}-service sent no JSON (HTTP ${response.status}). Is it running?`)
  }
}
